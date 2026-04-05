# Private Server Deployment (Vite + React SPA)

## 1) Build

```bash
npm run build
```

Upload the `dist` folder to your server.

## 2) SPA Rewrite (Required)

Your server must return `index.html` for unknown routes, otherwise direct links like `/news/123` will return `404`.

### Nginx

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/ascww/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Apache (.htaccess inside dist)

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### IIS (web.config inside dist)

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ReactRoutes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## 3) If deploying under sub-path (example: /portal/)

Set Vite base path before build:

```bash
npm run build -- --base=/portal/
```

Then deploy the built output under `/portal/`.

## 4) White Screen Quick Fix

If you still get a white page on private hosting, it is usually one of:
1. Missing SPA rewrite to `index.html`.
2. Wrong deploy base path.

Temporary fallback (works even without rewrite):
1. Copy `.env.production.private` content into `.env.production`.
2. Build again:

```bash
npm run build
```

This enables hash routing (`/#/about-company`) and avoids blank pages caused by server routing.
