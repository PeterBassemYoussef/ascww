import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const releaseDir = path.join(rootDir, 'release');
const bundleDir = path.join(releaseDir, 'ascww-server');

const requiredPaths = [
  path.join(rootDir, 'dist'),
  path.join(rootDir, 'server.js'),
  path.join(rootDir, 'api', 'ssr.js'),
];

for (const requiredPath of requiredPaths) {
  if (!fs.existsSync(requiredPath)) {
    throw new Error(`Missing required path: ${path.relative(rootDir, requiredPath)}. Run the production build first.`);
  }
}

fs.rmSync(bundleDir, { recursive: true, force: true });
fs.mkdirSync(bundleDir, { recursive: true });

const copyIntoBundle = (sourceRelativePath, targetRelativePath = sourceRelativePath) => {
  const sourcePath = path.join(rootDir, sourceRelativePath);
  if (!fs.existsSync(sourcePath)) return;

  const targetPath = path.join(bundleDir, targetRelativePath);
  const sourceStats = fs.statSync(sourcePath);

  if (sourceStats.isDirectory()) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.cpSync(sourcePath, targetPath, { recursive: true });
    return;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
};

copyIntoBundle('dist');
copyIntoBundle('public');
copyIntoBundle('server.js');
copyIntoBundle(path.join('api', 'ssr.js'));
copyIntoBundle('.env.server.example');
copyIntoBundle(path.join('deploy', 'systemd', 'ascww-apache.service'));
copyIntoBundle('DEPLOYMENT_RELEASE_BUNDLE_AR.md');

const sourcePackageJsonPath = path.join(rootDir, 'package.json');
const sourcePackageJson = JSON.parse(fs.readFileSync(sourcePackageJsonPath, 'utf8'));

const runtimePackageJson = {
  name: `${sourcePackageJson.name}-server`,
  version: sourcePackageJson.version,
  private: true,
  type: sourcePackageJson.type,
  description: 'Minimal deployment bundle for the ASCWW private server runtime.',
  engines: sourcePackageJson.engines,
  scripts: {
    start: 'node server.js',
    'start:prod': 'node server.js',
  },
  dependencies: {
    sharp: sourcePackageJson.dependencies?.sharp,
  },
};

fs.writeFileSync(
  path.join(bundleDir, 'package.json'),
  `${JSON.stringify(runtimePackageJson, null, 2)}\n`,
  'utf8',
);

const readmeContent = `ASCWW private server deployment bundle
====================================

Included files
- dist/
- public/
- api/ssr.js
- server.js
- package.json
- .env.server.example
- deploy/systemd/ascww-apache.service
- DEPLOYMENT_RELEASE_BUNDLE_AR.md

Server steps
1. Upload this folder to your server.
2. Copy .env.server.example to .env.production and adjust the values.
3. Run: npm install --omit=dev
4. Run: npm run start:prod

Notes
- This bundle keeps the Node server behavior, including SPA fallback, SSR metadata, /api proxying, and gallery endpoints.
- Arabic deployment instructions are included in DEPLOYMENT_RELEASE_BUNDLE_AR.md.
- Source folders such as src/, node_modules/, testsprite_tests/, and local docs are intentionally excluded.
`;

fs.writeFileSync(path.join(bundleDir, 'README.txt'), readmeContent, 'utf8');

console.log(`Deployment bundle created at ${bundleDir}`);
