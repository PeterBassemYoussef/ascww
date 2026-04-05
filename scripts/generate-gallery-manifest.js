import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);

const getImageFiles = (dirPath) => {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
};

const buildManifest = (publicDir) => {
  const imagesRoot = path.join(publicDir, 'images');
  if (!fs.existsSync(imagesRoot) || !fs.statSync(imagesRoot).isDirectory()) return {};

  const folders = fs
    .readdirSync(imagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const manifest = {};
  for (const folder of folders) {
    const folderPath = path.join(imagesRoot, folder);
    const files = getImageFiles(folderPath);
    if (files.length === 0) continue;
    manifest[folder] = files.map((name) => `/images/${folder}/${encodeURIComponent(name)}`);
  }

  return manifest;
};

const publicDir = path.join(process.cwd(), 'public');
const manifest = buildManifest(publicDir);
const outputPath = path.join(publicDir, 'gallery-manifest.json');

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Gallery manifest generated at ${outputPath}`);
