ASCWW private server deployment bundle
====================================

Included files
- dist/
- public/
- api/ssr.js
- server.js
- package.json
- .env.server.example
- deploy/systemd/ascww-apache.service

Server steps
1. Upload this folder to your server.
2. Copy .env.server.example to .env.production and adjust the values.
3. Run: npm install --omit=dev
4. Run: npm run start:prod

Notes
- This bundle keeps the Node server behavior, including SPA fallback, SSR metadata, /api proxying, and gallery endpoints.
- Source folders such as src/, node_modules/, testsprite_tests/, and local docs are intentionally excluded.
