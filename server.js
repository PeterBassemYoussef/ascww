import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ssrHandler from './api/ssr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
const indexPath = path.join(distDir, 'index.html');
const PORT = Number(process.env.PORT || 3000);
const BACKEND_BASE = process.env.BACKEND_BASE_URL || 'https://backend.ascww.org';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

const GALLERY_API_PREFIX = '/api/gallery/';
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);

const IMAGE_PROXY_PATH_PATTERN = /^\/api\/(?:news|projects)\/image\/|^\/api\/image\//;
const NON_WEBP_IMAGE_TYPES = ['image/svg+xml', 'image/gif', 'image/webp'];
const SKIPPED_UPSTREAM_HEADERS = new Set([
  'content-encoding',
  'transfer-encoding',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'upgrade',
]);

let sharpLoadPromise;
const getSharp = async () => {
  if (sharpLoadPromise) return sharpLoadPromise;
  sharpLoadPromise = import('sharp')
    .then((module) => module.default)
    .catch(() => null);
  return sharpLoadPromise;
};

const send = (res, statusCode, body, contentType = 'text/plain; charset=utf-8') => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  res.end(body);
};

const serveFile = (res, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, 'Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    send(res, 200, data, mime);
  });
};

const createSsrResponseAdapter = (res) => {
  const adapter = {
    statusCode: 200,
    setHeader: (key, value) => {
      res.setHeader(key, value);
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(payload) {
      res.statusCode = this.statusCode;
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
      }
      res.end(payload);
      return this;
    },
  };
  return adapter;
};

const copyUpstreamHeaders = (upstreamHeaders, res, { transformed = false } = {}) => {
  upstreamHeaders.forEach((value, key) => {
    const normalizedKey = key.toLowerCase();
    if (SKIPPED_UPSTREAM_HEADERS.has(normalizedKey)) return;
    if (transformed && (normalizedKey === 'content-length' || normalizedKey === 'content-type' || normalizedKey === 'etag' || normalizedKey === 'content-md5')) return;
    res.setHeader(key, value);
  });
};

const shouldTryWebpConversion = (req, pathname, method) => {
  if (method !== 'GET') return false;
  if (!IMAGE_PROXY_PATH_PATTERN.test(pathname)) return false;
  const acceptHeader = String(req.headers.accept || '').toLowerCase();
  return acceptHeader.includes('image/webp');
};

const streamUpstreamBody = async (upstream, res) => {
  if (!upstream.body) {
    res.end();
    return;
  }
  for await (const chunk of upstream.body) {
    res.write(chunk);
  }
  res.end();
};

const isSafeGalleryName = (value) => /^[a-zA-Z0-9_-]+$/.test(value);

const listGalleryImages = (folder) => {
  if (!isSafeGalleryName(folder)) {
    return { status: 400, payload: { error: 'Invalid gallery name.' } };
  }

  const publicGalleryDir = path.join(publicDir, 'images', folder);
  const distGalleryDir = path.join(distDir, 'images', folder);

  const selectExistingDir = () => {
    if (fs.existsSync(publicGalleryDir) && fs.statSync(publicGalleryDir).isDirectory()) {
      return publicGalleryDir;
    }
    if (fs.existsSync(distGalleryDir) && fs.statSync(distGalleryDir).isDirectory()) {
      return distGalleryDir;
    }
    return null;
  };

  const targetDir = selectExistingDir();
  if (!targetDir) {
    return { status: 404, payload: { images: [] } };
  }

  const files = fs
    .readdirSync(targetDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const images = files.map((name) => `/images/${folder}/${encodeURIComponent(name)}`);
  return { status: 200, payload: { images } };
};

const proxyApiRequest = async (req, res, requestUrl) => {
  const targetUrl = `${BACKEND_BASE}${requestUrl.pathname}${requestUrl.search}`;
  const method = req.method || 'GET';
  const headers = { ...req.headers };
  delete headers.host;
  const tryWebp = shouldTryWebpConversion(req, requestUrl.pathname, method);

  try {
    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' ? undefined : req,
      duplex: method === 'GET' || method === 'HEAD' ? undefined : 'half',
    });

    res.statusCode = upstream.status;
    const upstreamContentType = String(upstream.headers.get('content-type') || '').toLowerCase();
    const canTranscode =
      tryWebp
      && upstream.ok
      && upstreamContentType.startsWith('image/')
      && !NON_WEBP_IMAGE_TYPES.some((type) => upstreamContentType.includes(type));

    if (!canTranscode) {
      copyUpstreamHeaders(upstream.headers, res);
      await streamUpstreamBody(upstream, res);
      return;
    }

    const sharp = await getSharp();
    if (!sharp) {
      copyUpstreamHeaders(upstream.headers, res);
      await streamUpstreamBody(upstream, res);
      return;
    }

    const sourceBuffer = Buffer.from(await upstream.arrayBuffer());
    const webpBuffer = await sharp(sourceBuffer).webp({ quality: 75, effort: 4 }).toBuffer();

    copyUpstreamHeaders(upstream.headers, res, { transformed: true });
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Length', String(webpBuffer.length));
    res.setHeader('Vary', 'Accept');
    res.setHeader('X-Image-Format', 'webp');
    res.end(webpBuffer);
  } catch (error) {
    send(res, 502, `API proxy failed: ${String(error)}`);
  }
};

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const requestUrl = new URL(req.url || '/', `http://${host}`);
  const pathname = requestUrl.pathname;

  if (pathname.startsWith(GALLERY_API_PREFIX)) {
    const galleryName = decodeURIComponent(pathname.slice(GALLERY_API_PREFIX.length));
    if (galleryName.includes('/')) {
      send(res, 400, JSON.stringify({ error: 'Invalid gallery name.' }), 'application/json; charset=utf-8');
      return;
    }
    const { status, payload } = listGalleryImages(galleryName);
    send(res, status, JSON.stringify(payload), 'application/json; charset=utf-8');
    return;
  }

  if (pathname.startsWith('/api/')) {
    await proxyApiRequest(req, res, requestUrl);
    return;
  }

  const archiveMetaRoutes = new Map([
    ['/news-archive', { type: 'news', routeBase: '/news-archive' }],
    ['/news-company', { type: 'news', routeBase: '/news-company' }],
    ['/projects-archive', { type: 'project', routeBase: '/projects-archive' }],
    ['/projects-company', { type: 'project', routeBase: '/projects-company' }],
    ['/projects', { type: 'project', routeBase: '/projects' }],
    ['/tenders-archive', { type: 'tender', routeBase: '/tenders-archive' }],
    ['/tenders', { type: 'tender', routeBase: '/tenders' }],
    ['/allTenders', { type: 'tender', routeBase: '/allTenders' }],
    ['/alltenders', { type: 'tender', routeBase: '/alltenders' }],
  ]);

  const archiveMetaConfig = archiveMetaRoutes.get(pathname);
  if (archiveMetaConfig) {
    const ssrReq = { query: { type: archiveMetaConfig.type, routeBase: archiveMetaConfig.routeBase }, headers: req.headers };
    const ssrRes = createSsrResponseAdapter(res);
    await ssrHandler(ssrReq, ssrRes);
    return;
  }

  const homeMetaPaths = new Set([
    '/',
    '/index.html',
    '/an-elsherka',
    '/branch-of-company',
    '/vision-and-message',
    '/organization-structure',
    '/contract-and-sell',
    '/company-achivement',
    '/adviceAndContact',
    '/forKidsAndWomen',
    '/water-quality',
    '/refining-water',
    '/lab-of-company-water',
    '/sewage-treatment',
    '/Riddence-waste-water',
    '/save-web-waste-water',
    '/manufactring-waste',
    '/waste-water-in-manufactring',
    '/forKids',
    '/toWomen',
  ]);
  if (homeMetaPaths.has(pathname)) {
    const routeBase = pathname === '/index.html' ? '/' : pathname;
    const ssrReq = { query: { type: 'home', routeBase }, headers: req.headers };
    const ssrRes = createSsrResponseAdapter(res);
    await ssrHandler(ssrReq, ssrRes);
    return;
  }

  const newsMatch = pathname.match(/^\/(news|news-company)\/([^/]+)$/);
  if (newsMatch) {
    const routeBase = `/${newsMatch[1]}`;
    const id = newsMatch[2];
    const ssrReq = { query: { id, type: 'news', routeBase }, headers: req.headers };
    const ssrRes = createSsrResponseAdapter(res);
    await ssrHandler(ssrReq, ssrRes);
    return;
  }

  const projectMatch = pathname.match(/^\/(projects|projects-company)\/([^/]+)$/);
  if (projectMatch) {
    const routeBase = `/${projectMatch[1]}`;
    const id = projectMatch[2];
    const ssrReq = { query: { id, type: 'project', routeBase }, headers: req.headers };
    const ssrRes = createSsrResponseAdapter(res);
    await ssrHandler(ssrReq, ssrRes);
    return;
  }

  const tenderMatch = pathname.match(/^\/(tenders|allTenders|alltenders)\/([^/]+)$/);
  if (tenderMatch) {
    const routeBase = `/${tenderMatch[1]}`;
    const id = tenderMatch[2];
    const ssrReq = { query: { id, type: 'tender', routeBase }, headers: req.headers };
    const ssrRes = createSsrResponseAdapter(res);
    await ssrHandler(ssrReq, ssrRes);
    return;
  }

  const normalizedPath = pathname === '/' ? '/index.html' : pathname;
  const publicFile = path.normalize(path.join(publicDir, normalizedPath));
  const isInsidePublic = publicFile.startsWith(publicDir);
  if (isInsidePublic && fs.existsSync(publicFile) && fs.statSync(publicFile).isFile()) {
    serveFile(res, publicFile);
    return;
  }

  const requestedFile = path.normalize(path.join(distDir, normalizedPath));
  const isInsideDist = requestedFile.startsWith(distDir);
  const hasExtension = path.extname(requestedFile) !== '';

  if (isInsideDist && hasExtension && fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    serveFile(res, requestedFile);
    return;
  }

  if (fs.existsSync(indexPath)) {
    serveFile(res, indexPath);
    return;
  }

  send(res, 500, 'Build files not found. Run `npm run build` first.');
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log('SSR enabled for /, archives, /news/:id, /projects/:id and /projects-company/:id');
  console.log(`API proxy enabled for /api/* -> ${BACKEND_BASE}/api/*`);
});
