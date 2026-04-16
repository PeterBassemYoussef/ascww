# Config Files Comparison: Vercel vs Apache

## الملفات المطلوبة

### Vercel Setup
```
ascww.main/
├── vercel.json          ← Master config
├── vite.config.ts       ← Build config
├── package.json
└── server.js            ← Optional SSR server
```

### Apache Setup
```
ascww.main/
├── vite.config.ts                    ← Build config
├── package.json
├── server.js                         ← Required for SSR
├── .env                              ← Optional env file
└── deploy/
    ├── apache/
    │   └── ascww.conf               ← Apache virtual host
    └── systemd/
        └── ascww.service            ← Node.js service manager
```

---

## 1. Vercel Config (vercel.json)

```json
{
  "functions": {
    "api/gallery/[name].js": {
      "includeFiles": "public/gallery-manifest.json"
    }
  },
  "rewrites": [
    { "source": "/news/:id", "destination": "/api/ssr?type=news&id=:id&routeBase=/news" },
    { "source": "/projects/:id", "destination": "/api/ssr?type=project&id=:id&routeBase=/projects" },
    { "source": "/tenders/:id", "destination": "/api/ssr?type=tender&id=:id&routeBase=/tenders" },
    { "source": "/api/(.*)", "destination": "https://backend.ascww.org/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### ماذا يفعل:
- **functions**: يخبر Vercel عن serverless functions
- **rewrites**: إعادة توجيه داخلية بدون تغيير URL
- الـ SSR pages (news, projects, tenders) توجه إلى `/api/ssr`
- API calls توجه إلى backend
- كل requests الأخرى توجه إلى `index.html` (SPA fallback)

---

## 2. Apache Config (ascww.conf)

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com

    # Proxy requests to Node.js server
    ProxyPreserveHost On
    ProxyRequests Off

    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # Pass original request headers
    RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"
    RequestHeader set X-Forwarded-Proto "%{REQUEST_SCHEME}s"
    RequestHeader set X-Forwarded-Host "%{HTTP_HOST}s"
</VirtualHost>
```

### ماذا يفعل:
- جميع الطلبات (كل المسارات) يتم توجيهها إلى `http://127.0.0.1:3000`
- **Node.js server** (server.js) هو المسؤول عن التوجيه والمعالجة
- Apache فقط واسطة (Reverse Proxy)
- لا توجيه URLs داخل Apache، كل شيء في Node.js

---

## 3. Node.js Server (server.js)

في Apache setup، يقوم server.js بـ:

```javascript
// 1. قراءة vercel.json JSON والتصرف على أساسه
const REWRITES = [
  { "source": "/news/:id", "destination": "/api/ssr?type=news&id=:id&routeBase=/news" },
  { "source": "/projects/:id", "destination": "/api/ssr?type=project&id=:id&routeBase=/projects" },
  { "source": "/tenders/:id", "destination": "/api/ssr?type=tender&id=:id&routeBase=/tenders" },
  // ... etc
];

// 2. مطابقة الـ request path مع الـ rewrites
// 3. استدعاء الـ handler المناسب (SSR, Static, API proxy)

// 4. إعادة الاستجابة
```

---

## 4. Build Configuration (vite.config.ts)

**نفس الملف لـ Vercel و Apache:**

```typescript
export default defineConfig({
  plugins: [react(), localGalleryApiPlugin()],
  build: {
    // Output يتم إنشاؤه في dist/ folder
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
        changeOrigin: true
      }
    }
  }
});
```

**لا تغييرات مطلوبة بين Vercel و Apache!** ✅

---

## 5. Environment Variables (متغيرات البيئة)

### Vercel Dashboard
```
VITE_API_BASE_URL=/api
VITE_SITE_URL=https://ascww.org
BACKEND_BASE_URL=https://backend.ascww.org
```

### Apache Systemd Service
```ini
[Service]
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=BACKEND_BASE_URL=https://backend.ascww.org
Environment=VITE_API_BASE_URL=/api
Environment=VITE_SITE_URL=https://your-domain.com
```

### أو .env File
```bash
NODE_ENV=production
PORT=3000
BACKEND_BASE_URL=https://backend.ascww.org
VITE_API_BASE_URL=/api
VITE_SITE_URL=https://your-domain.com
```

---

## 6. Deployment Flow

### Vercel Flow
```
1. git push مشروعك
   ↓
2. Vercel يكتشف التغيير تلقائياً
   ↓
3. Vercel يعمل `npm run build`
   ↓
4. Vercel uploads the dist folder
   ↓
5. vercel.json routing يتم تطبيقها
   ↓
6. Live على production
```

### Apache Flow
```
1. تشغيل `npm run build` محلياً أو على السرفر
   ↓
2. dist/ folder يتم نسخه إلى السرفر
   ↓
3. npm install في `/var/www/ascww`
   ↓
4. systemd service يبدأ Node.js server على port 3000
   ↓
5. Apache proxy يعيد توجيه requests إلى Node.js
   ↓
6. server.js يتعامل مع routing و rewrites
   ↓
7. Live على production
```

---

## 7. Routing Comparison

### مثال: طلب إلى `/news/123`

**على Vercel:**
```
Request /news/123
   ↓
vercel.json matches: /news/:id
   ↓
Rewrite to: /api/ssr?type=news&id=123&routeBase=/news
   ↓
Serverless function /api/ssr.js يعمل
   ↓
Returns HTML (SSR rendered)
   ↓
User sees الصفحة الكاملة
```

**على Apache:**
```
Request /news/123
   ↓
Apache ProxyPass إلى http://127.0.0.1:3000/news/123
   ↓
Node.js server.js يستقبل الطلب
   ↓
server.js matches path مع file-based routes من React Router
   ↓
اختياري: يمكن SSR إذا تم تنفيذ آلية SSR في server.js
   ↓
Returns HTML
   ↓
User sees الصفحة
```

---

## 8. Important Differences

| الجانب | Vercel | Apache |
|--------|--------|---------|
| **Micro Architecture** | Serverless functions | Node.js server always on |
| **Routing** | vercel.json | server.js + React Router |
| **Cold starts** | 0-100ms | Always warm (always running) |
| **Scaling** | Automatic | Manual (increase resources) |
| **Deployment** | Push to git | Manual build + systemd |
| **Networking** | Global CDN | Single server |

---

## 9. Checklist: Ensuring Parity

- [ ] `npm run build` ينتج نفس dist/ folder
- [ ] server.js يتعامل مع جميع routes التي في vercel.json
- [ ] SSR API endpoint (`/api/ssr`) موجود ويعمل
- [ ] Gallery API موجود ويعمل
- [ ] Backend API proxy يعمل
- [ ] Static files تحمل بشكل صحيح
- [ ] Environment variables متطابقة
- [ ] CORS headers صحيحة
- [ ] SSL/HTTPS مفعّل
- [ ] Performance متقارب

---

## 10. Quick Migration Commands

```bash
# 1. Build locally
npm run build

# 2. Copy to server
scp -r dist/ server:/var/www/ascww/
scp server.js server:/var/www/ascww/
scp package.json server:/var/www/ascww/

# 3. On server
cd /var/www/ascww
npm install --production  # Only prod dependencies

# 4. Start service
sudo systemctl start ascww
sudo systemctl enable ascww

# 5. Verify
curl http://your-domain.com

# ✓ Done! Same as Vercel now
```

---

## Notes

- **server.js**: هذا هو القلب. يجب أن يتعامل مع كل الـ routing
- **Apache**: فقط واسطة. لا تعقد هنا
- **dist folder**: مهم جداً أن يكون حديثاً
- **Environment variables**: مهمة جداً للـ API endpoints
- **Port 3000**: يجب ألا يكون مشغول

استمتع بالتوزيع! 🚀
