import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const isSafeGalleryName = (value: string) => /^[a-zA-Z0-9_-]+$/.test(value);

const listGalleryImages = (rootDir: string, folder: string) => {
  if (!isSafeGalleryName(folder)) {
    return { status: 400, payload: { error: 'Invalid gallery name.' } };
  }

  const publicGalleryDir = path.join(rootDir, 'public', 'images', folder);
  if (!fs.existsSync(publicGalleryDir) || !fs.statSync(publicGalleryDir).isDirectory()) {
    return { status: 404, payload: { images: [] } };
  }

  const files = fs
    .readdirSync(publicGalleryDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const images = files.map((name) => `/images/${folder}/${encodeURIComponent(name)}`);
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
