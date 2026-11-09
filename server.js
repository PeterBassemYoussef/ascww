import http from 'http';
import fs from 'fs';
import path from 'path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'url';
import ssrHandler from './api/ssr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
const indexPath = path.join(distDir, 'index.html');
const imageCacheDir = path.join(__dirname, '.img-cache');
const PORT = Number(process.env.PORT || 3000);
const BACKEND_BASE = (process.env.BACKEND_BASE_URL || 'https://backend.ascww.org').replace(/\/+$/, '');
const IMAGE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const IMAGE_QUALITY = 65;

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

const SCHOOL_SUBMISSION_STATE_PATH = '/api/school-submission-data';
const SCHOOL_SUBMISSION_GUARDED_PATHS = new Set(['/api/upload', '/api/addStudent']);
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
    const assetsDir = path.join(distDir, 'assets');
    const cacheControl = filePath === indexPath
      ? 'no-cache'
      : filePath.startsWith(`${assetsDir}${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=2592000';
    res.statusCode = 200;
    res.setHeader('Content-Type', mime);
    res.setHeader('Cache-Control', cacheControl);
    res.end(data);
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

const copyUpstreamHeaders = (upstreamHeaders, res) => {
  upstreamHeaders.forEach((value, key) => {
    const normalizedKey = key.toLowerCase();
    if (SKIPPED_UPSTREAM_HEADERS.has(normalizedKey)) return;
    res.setHeader(key, value);
  });
};

const buildBackendApiUrl = (requestUrl) => {
  const apiPath = requestUrl.pathname.startsWith('/api/')
    ? requestUrl.pathname
    : `/api${requestUrl.pathname.startsWith('/') ? '' : '/'}${requestUrl.pathname}`;
  const normalizedPath = BACKEND_BASE.toLowerCase().endsWith('/api')
    ? apiPath.replace(/^\/api(?=\/|$)/, '')
    : apiPath;
  return `${BACKEND_BASE}${normalizedPath}${requestUrl.search}`;
};

const isImageNotModified = (req, etag) => {
  const header = req.headers['if-none-match'];
  if (!header) return false;
  return header.split(',').some((value) => {
    const candidate = value.trim();
    return candidate === '*' || candidate === etag || candidate === `W/${etag}`;
  });
};

const sendCachedImage = (req, res, image, etag) => {
  res.setHeader('Content-Type', 'image/webp');
  res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=604800');
  res.setHeader('ETag', etag);
  if (isImageNotModified(req, etag)) {
    res.statusCode = 304;
    res.end();
    return;
  }
  res.statusCode = 200;
  res.setHeader('Content-Length', image.length);
  res.end(req.method === 'HEAD' ? undefined : image);
};

const sendOriginalImageHeaders = (res, contentType, contentLength) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=300');
  if (contentLength) res.setHeader('Content-Length', contentLength);
};

const sendOriginalImage = async (req, res, upstream, contentType) => {
  sendOriginalImageHeaders(res, contentType, upstream.headers.get('content-length'));
  if (req.method === 'HEAD') {
    await upstream.body?.cancel();
    res.end();
    return;
  }
  await streamUpstreamBody(upstream, res);
};

const getCachedImage = async (cachePath) => {
  try {
    const stat = await fs.promises.stat(cachePath);
    if (Date.now() - stat.mtimeMs >= IMAGE_CACHE_TTL_MS) {
      await fs.promises.unlink(cachePath);
      return null;
    }
    return await fs.promises.readFile(cachePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('Unable to read image cache:', error);
    }
    return null;
  }
};

const sendImageOptimizationFallback = (req, res, image, contentType) => {
  sendOriginalImageHeaders(res, contentType, image.length);
  res.end(req.method === 'HEAD' ? undefined : image);
};

const handleImageRequest = async (req, res, requestUrl) => {
  const sources = requestUrl.searchParams.getAll('src');
  const widths = requestUrl.searchParams.getAll('w');
  const imageSource = sources.length === 1 ? sources[0] : '';
  const widthValue = widths.length === 1 ? widths[0] : '';
  const width = widthValue === '480' ? 480 : widthValue === '640' ? 640 : widthValue === '800' ? 800 : Number.NaN;
  if (
    !/^\/api\/(?:news\/image|image)\/[A-Za-z0-9._-]+$/.test(imageSource)
    || imageSource.includes('..')
    || ![480, 640, 800].includes(width)
  ) {
    send(res, 400, 'Invalid image source or width.');
    return;
  }

  const cacheKey = createHash('sha1')
    .update(`${imageSource}|${width}|${IMAGE_QUALITY}`)
    .digest('hex');
  const cachePath = path.join(imageCacheDir, `${cacheKey}.webp`);
  const cachedImage = await getCachedImage(cachePath);
  if (cachedImage) {
    const etag = `"${createHash('sha1').update(cachedImage).digest('hex')}"`;
    sendCachedImage(req, res, cachedImage, etag);
    return;
  }

  const upstreamUrl = new URL(requestUrl);
  upstreamUrl.pathname = imageSource;
  upstreamUrl.search = '';

  try {
    const upstream = await fetch(buildBackendApiUrl(upstreamUrl), {
      headers: { accept: 'image/*' },
      redirect: 'error',
      signal: AbortSignal.timeout(10_000),
    });
    const contentType = upstream.headers.get('content-type') || '';
    if (!upstream.ok) {
      await upstream.body?.cancel();
      send(res, upstream.status === 404 ? 404 : 502, 'Image request failed.');
      return;
    }
    if (!/^image\//i.test(contentType)) {
      await upstream.body?.cancel();
      send(res, 404, 'Image not found.');
      return;
    }

    const imageMimeType = contentType.split(';', 1)[0].trim().toLowerCase();
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(imageMimeType)) {
      await sendOriginalImage(req, res, upstream, contentType);
      return;
    }

    const upstreamLength = upstream.headers.get('content-length');
    if (upstreamLength && Number(upstreamLength) > MAX_IMAGE_BYTES) {
      await sendOriginalImage(req, res, upstream, contentType);
      return;
    }

    const chunks = [];
    let totalBytes = 0;
    let passedThrough = false;
    for await (const chunk of upstream.body || []) {
      const buffer = Buffer.from(chunk);
      if (passedThrough) {
        res.write(buffer);
        continue;
      }
      if (totalBytes + buffer.length > MAX_IMAGE_BYTES) {
        sendOriginalImageHeaders(res, contentType, upstreamLength);
        if (req.method === 'HEAD') {
          await upstream.body?.cancel();
          res.end();
          return;
        }
        for (const bufferedChunk of chunks) res.write(bufferedChunk);
        res.write(buffer);
        passedThrough = true;
        continue;
      }
      chunks.push(buffer);
      totalBytes += buffer.length;
    }
    if (passedThrough) {
      res.end();
      return;
    }

    const originalImage = Buffer.concat(chunks, totalBytes);
    let optimizedImage = null;
    try {
      const { default: sharp } = await import('sharp');
      sharp.concurrency(1);
      sharp.cache(false);
      optimizedImage = await sharp(originalImage, { limitInputPixels: 40_000_000 })
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: IMAGE_QUALITY })
        .toBuffer();
    } catch (error) {
      console.warn('Image optimization unavailable or failed; returning the original image:', error);
    }

    if (!optimizedImage) {
      sendImageOptimizationFallback(req, res, originalImage, contentType);
      return;
    }

    try {
      await fs.promises.writeFile(cachePath, optimizedImage);
    } catch (error) {
      console.warn('Unable to write image cache:', error);
    }
    const etag = `"${createHash('sha1').update(optimizedImage).digest('hex')}"`;
    sendCachedImage(req, res, optimizedImage, etag);
  } catch (error) {
    console.error('Image request failed:', error);
    if (!res.headersSent) {
      send(res, 502, 'Image request failed.');
    } else {
      res.end();
    }
  }
};

const parseBackendBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value !== 'string') return false;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  return ['1', 'true', 'yes', 'open', 'active', 'available', 'متاح', 'مفتوح'].includes(normalized);
};

const extractSchoolSubmissionFormState = (payload) => {
  const source = payload && typeof payload === 'object' && !Array.isArray(payload)
    ? (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data) ? payload.data : payload)
    : {};

  return parseBackendBoolean(source.show_submission_form);
};

const ensureSchoolSubmissionIsOpen = async () => {
  const stateUrl = BACKEND_BASE.toLowerCase().endsWith('/api')
    ? `${BACKEND_BASE}/school-submission-data`
    : `${BACKEND_BASE}${SCHOOL_SUBMISSION_STATE_PATH}`;
  const response = await fetch(stateUrl, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`School submission state request failed: ${response.status}`);
  }

  const payload = await response.json();
  return extractSchoolSubmissionFormState(payload);
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

const resolveGalleryDirectory = (imagesRoot, folder) => {
  if (!fs.existsSync(imagesRoot) || !fs.statSync(imagesRoot).isDirectory()) {
    return null;
  }

  const directDir = path.join(imagesRoot, folder);
  if (fs.existsSync(directDir) && fs.statSync(directDir).isDirectory()) {
    return {
      dirPath: directDir,
      publicPath: folder,
    };
  }

  const directoriesToVisit = [imagesRoot];
  while (directoriesToVisit.length > 0) {
    const currentDir = directoriesToVisit.shift();
    const childDirectories = fs
      .readdirSync(currentDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    for (const entry of childDirectories) {
      const candidateDir = path.join(currentDir, entry.name);
      const relativePath = path.relative(imagesRoot, candidateDir).split(path.sep).join('/');

      if (entry.name === folder) {
        return {
          dirPath: candidateDir,
          publicPath: relativePath,
        };
      }

      directoriesToVisit.push(candidateDir);
    }
  }

  return null;
};

const listGalleryImages = (folder) => {
  if (!isSafeGalleryName(folder)) {
    return { status: 400, payload: { error: 'Invalid gallery name.' } };
  }

  const publicGallery = resolveGalleryDirectory(path.join(publicDir, 'images'), folder);
  const distGallery = resolveGalleryDirectory(path.join(distDir, 'images'), folder);
  const targetGallery = publicGallery || distGallery;

  if (!targetGallery) {
    return { status: 404, payload: { images: [] } };
  }

  const files = fs
    .readdirSync(targetGallery.dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const images = files.map((name) => `/images/${targetGallery.publicPath}/${encodeURIComponent(name)}`);
  return { status: 200, payload: { images } };
};

const proxyApiRequest = async (req, res, requestUrl) => {
  const targetUrl = buildBackendApiUrl(requestUrl);
  const method = req.method || 'GET';
  const headers = { ...req.headers };
  delete headers.host;

  try {
    if (method !== 'GET' && SCHOOL_SUBMISSION_GUARDED_PATHS.has(requestUrl.pathname)) {
      const isSubmissionOpen = await ensureSchoolSubmissionIsOpen();
      if (!isSubmissionOpen) {
        send(
          res,
          403,
          JSON.stringify({ message: 'التقديم مغلق حالياً.' }),
          'application/json; charset=utf-8',
        );
        return;
      }
    }

    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' ? undefined : req,
      duplex: method === 'GET' || method === 'HEAD' ? undefined : 'half',
    });

    res.statusCode = upstream.status;
    copyUpstreamHeaders(upstream.headers, res);
    await streamUpstreamBody(upstream, res);
  } catch (error) {
    send(res, 502, `API proxy failed: ${String(error)}`);
  }
};

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const requestUrl = new URL(req.url || '/', `http://${host}`);
  const pathname = requestUrl.pathname;

  if (pathname === '/api/img' && (req.method === 'GET' || req.method === 'HEAD')) {
    await handleImageRequest(req, res, requestUrl);
    return;
  }

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
    ['/news', { type: 'news', routeBase: '/news' }],
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
    '/about',
    '/about-us',
    '/an-elsherka',
    '/branch-of-company',
    '/about/vision-mission',
    '/vision-and-message',
    '/about/structure',
    '/organization-structure',
    '/about/regulations',
    '/contract-and-sell',
    '/contracts-regulation',
    '/about/achievements',
    '/company-achievements',
    '/company-achivement',
    '/awareness',
    '/awareness/contact',
    '/advice-and-contact',
    '/adviceAndContact',
    '/awareness/cyber-security',
    '/cyber-security-guidelines',
    '/awareness/community-outreach',
    '/for-kids-and-women',
    '/forKidsAndWomen',
    '/it-management',
    '/information-technology-of-company',
    '/sanitation',
    '/sanitation/treatment',
    '/sewage-treatment',
    '/sanitation/safe-disposal',
    '/safe-sewage-disposal',
    '/sanitation/network-preservation',
    '/save-sewage-network',
    '/sanitation/industrial-waste',
    '/industrial-waste',
    '/sanitation/industrial-waste-management',
    '/industrial-waste-role',
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
  const isInsidePublic = publicFile === publicDir || publicFile.startsWith(`${publicDir}${path.sep}`);
  if (isInsidePublic && fs.existsSync(publicFile) && fs.statSync(publicFile).isFile()) {
    serveFile(res, publicFile);
    return;
  }

  const requestedFile = path.normalize(path.join(distDir, normalizedPath));
  const isInsideDist = requestedFile === distDir || requestedFile.startsWith(`${distDir}${path.sep}`);
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

try {
  fs.mkdirSync(imageCacheDir, { recursive: true });
} catch (error) {
  console.warn('Unable to create image cache directory:', error);
}

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log('SSR enabled for /, archives, /news/:id, /projects/:id and /projects-company/:id');
  console.log(`API proxy enabled for /api/* -> ${BACKEND_BASE}${BACKEND_BASE.toLowerCase().endsWith('/api') ? '/*' : '/api/*'}`);
});
