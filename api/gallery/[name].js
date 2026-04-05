import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const isSafeGalleryName = (value = '') => /^[a-zA-Z0-9_-]+$/.test(value);

const loadManifest = (rootDir) => {
  const manifestPath = path.join(rootDir, 'public', 'gallery-manifest.json');
  if (!fs.existsSync(manifestPath) || !fs.statSync(manifestPath).isFile()) {
    return null;
  }
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const listFromFilesystem = (rootDir, folder) => {
  const galleryDir = path.join(rootDir, 'public', 'images', folder);
  if (!fs.existsSync(galleryDir) || !fs.statSync(galleryDir).isDirectory()) {
    return [];
  }

  return fs
    .readdirSync(galleryDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((name) => `/images/${folder}/${encodeURIComponent(name)}`);
};

const listGalleryImages = (rootDir, folder) => {
  if (!isSafeGalleryName(folder)) {
    return { status: 400, payload: { error: 'Invalid gallery name.' } };
  }

  const manifest = loadManifest(rootDir);
  if (manifest && typeof manifest === 'object') {
    const images = Array.isArray(manifest[folder]) ? manifest[folder] : [];
    if (images.length > 0) {
      return { status: 200, payload: { images } };
    }
  }

  const images = listFromFilesystem(rootDir, folder);
  return { status: images.length ? 200 : 404, payload: { images } };
};

export default function handler(req, res) {
  const method = String(req.method || 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  const { name } = req.query || {};
  const galleryName = Array.isArray(name) ? name[0] : name;
  const { status, payload } = listGalleryImages(process.cwd(), galleryName);

  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
  res.end(JSON.stringify(payload));
}
