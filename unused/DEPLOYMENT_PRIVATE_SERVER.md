# Private Linux Server Deployment

This project should not be deployed as a static `dist` folder only if you want it to behave like Vercel.

The current production behavior depends on:

1. `server.js` for SPA fallback.
2. `api/ssr.js` for SEO and Open Graph tags on archive/detail routes.
3. `/api/*` proxying to `https://backend.ascww.org`.
4. `/api/gallery/*` dynamic gallery responses.

To match that behavior on your own Linux server, run the Node server behind Nginx.

## 1) Server requirements

- Ubuntu/Debian or another Linux distro
- Node.js 20 or newer
- Nginx
- A domain name pointed to the server

## 2) Upload the project

Example target path:

```bash
/var/www/ascww
```

Copy the full project, not only `dist`.

## 3) Install dependencies and build

Inside the project directory on the Linux server:

```bash
npm ci
cp .env.server.example .env.production
npm run build
```

Then edit `.env.production` and replace:

- `https://your-domain.com` with your real domain
- any API values if your backend URL is different

Recommended `.env.production`:

```bash
VITE_API_BASE_URL=/api
VITE_SITE_URL=https://your-domain.com
VITE_ROUTER_MODE=browser
```

Important:

- Do not use `.env.production.private` for this setup.
- That file switches the app to hash routing as a fallback for static-only hosting.
- For Vercel-like behavior on Linux, keep browser routing and run `server.js`.

## 4) Test locally on the server

```bash
npm run start:prod
```

Open:

```bash
http://127.0.0.1:3000
```

If the app works, stop it and continue with systemd.

## 5) Create the systemd service

Use the template in `deploy/systemd/ascww.service`.

Example:

```bash
sudo cp deploy/systemd/ascww.service /etc/systemd/system/ascww.service
sudo nano /etc/systemd/system/ascww.service
```

Change these values:

- `WorkingDirectory=/var/www/ascww`
- `VITE_SITE_URL=https://your-domain.com`
- `BACKEND_BASE_URL=https://backend.ascww.org` if needed
- `ExecStart=/usr/bin/node server.js` if Node is installed elsewhere

Then enable the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ascww
sudo systemctl start ascww
sudo systemctl status ascww
```

## 6) Configure Nginx

Use the template in `deploy/nginx/ascww.conf`.

Example:

```bash
sudo cp deploy/nginx/ascww.conf /etc/nginx/sites-available/ascww
sudo nano /etc/nginx/sites-available/ascww
sudo ln -s /etc/nginx/sites-available/ascww /etc/nginx/sites-enabled/ascww
sudo nginx -t
sudo systemctl reload nginx
```

Replace:

- `your-domain.com`
- `www.your-domain.com`

This proxies all traffic to the local Node server on port `3000`, which preserves:

- SPA routing
- SSR metadata
- backend API rewrites
- gallery API endpoints

## 7) Optional SSL

After Nginx is working, add HTTPS:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 8) Updating the site later

When you upload a new version:

```bash
cd /var/www/ascww
npm ci
npm run build
sudo systemctl restart ascww
```

## 9) Troubleshooting

If the site does not behave like Vercel, check these first:

1. The server is running through `node server.js`, not static hosting only.
2. `VITE_SITE_URL` is your real public domain.
3. `VITE_API_BASE_URL=/api` is present during build.
4. Nginx is proxying to `127.0.0.1:3000`.
5. `BACKEND_BASE_URL` points to the correct backend origin.

## 10) Verified locally

The production build and local runtime were verified successfully with:

- `/` returning `200`
- `/news-archive` returning `200`
- `/api/gallery/school_dep` returning `200`
- SSR meta tags present on rendered HTML
