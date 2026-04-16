import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const isSafeGalleryName = (value: string) => /^[a-zA-Z0-9_-]+$/.test(value);

const resolveGalleryDirectory = (imagesRoot: string, folder: string) => {
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
    if (!currentDir) continue;

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

const listGalleryImages = (rootDir: string, folder: string) => {
  if (!isSafeGalleryName(folder)) {
    return { status: 400, payload: { error: 'Invalid gallery name.' } };
  }

  const gallery = resolveGalleryDirectory(path.join(rootDir, 'public', 'images'), folder);
  if (!gallery) {
    return { status: 404, payload: { images: [] } };
  }

  const files = fs
    .readdirSync(gallery.dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const images = files.map((name) => `/images/${gallery.publicPath}/${encodeURIComponent(name)}`);
  return { status: 200, payload: { images } };
};

const localGalleryApiPlugin = () => ({
  name: 'local-gallery-api',
  configureServer(server: { middlewares: { use: (path: string, handler: (req: any, res: any) => void) => void } }) {
    server.middlewares.use('/api/gallery', (req, res) => {
      const method = String(req.method || 'GET').toUpperCase();
      if (method !== 'GET' && method !== 'HEAD') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: 'Method not allowed.' }));
        return;
      }

      const rawUrl = String(req.url || '/');
      const pathname = rawUrl.split('?')[0] || '/';
      const galleryName = decodeURIComponent(pathname.replace(/^\/+/, ''));

      if (!galleryName || galleryName.includes('/')) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: 'Invalid gallery name.' }));
        return;
      }

      const { status, payload } = listGalleryImages(process.cwd(), galleryName);
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(payload));
    });
  }
});

export default defineConfig({
  plugins: [react(), localGalleryApiPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist'],
          pageflip: ['react-pageflip']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://backend.ascww.org',
        changeOrigin: true,
        secure: true
      }
    }
  }
});
