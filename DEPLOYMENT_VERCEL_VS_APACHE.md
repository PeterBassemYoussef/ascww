# مقارنة Vercel vs Apache + Node.js

## الفروقات الرئيسية

### 1. نقطة الدخول (Entry Point)

**على Vercel:**
- `vercel.json` يتحكم بـ routing و rewrites
- Vercel يدير النشر التلقائي من git

**على Apache:**
- `server.js` هو نقطة الدخول
- Apache يعمل كـ reverse proxy لـ Node.js
- يجب بناء النسخة يدوياً أو عبر CI/CD

### 2. الـ Routing والـ Rewrites

**Vercel (vercel.json):**
```json
{
  "rewrites": [
    { "source": "/news/:id", "destination": "/api/ssr?type=news&id=:id" },
    { "source": "/api/(.*)", "destination": "https://backend.ascww.org/api/$1" }
  ]
}
```

**Apache:**
على Node.js server (server.js) يتعامل مع كل الروابط
- Apache proxy يمرر كل الطلبات إلى `http://127.0.0.1:3000`
- `server.js` هو المسؤول عن التوجيه والمعالجة

### 3. المعالجة الثابتة (Static Files)

**على Vercel:**
- يخدم من `public/` تلقائياً

**على Apache:**
- يخدم من `/var/www/ascww/dist` و `/var/www/ascww/public`
- يمكنك تعديل DocumentRoot في Apache config

### 4. المتغيرات البيئية

**Vercel:**
```bash
VITE_API_BASE_URL=/api
VITE_SITE_URL=https://ascww.org
```

**Apache + Systemd:**
```bash
Environment=BACKEND_BASE_URL=https://backend.ascww.org
Environment=PORT=3000
```

## خطوات المقابلة

### Build Process

| الخطوة | Vercel | Apache |
|-------|--------|---------|
| 1 | `git push` | `npm run build` |
| 2 | Vercel builds & deploys | `npm install` |
| 3 | Auto rollback on fail | Manual rollback |

### Server Architecture

```
Vercel:
┌─────────────────────────────────────┐
│         Vercel Infrastructure       │
│  ┌──────────────────────────────┐   │
│  │  Serverless Functions        │   │
│  │  (api/ssr.js, api/gallery)   │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Static Files (dist/)        │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘

Apache:
┌──────────────────────────────────────────┐
│     Apache Web Server (Port 80/443)      │
│  ┌────────────────────────────────────┐  │
│  │  Reverse Proxy & Forwarding        │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │  Node.js Server (Port 3000)  │  │  │
│  │  │  - SSR Rendering             │  │  │
│  │  │  - API Routing               │  │  │
│  │  │  - Static Files (dist/)      │  │  │
│  │  └──────────────────────────────┘  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## الأداء والاعتبارات

### السرعة

- **Vercel**: مُحسّنة عالمياً مع CDN
- **Apache**: يعتمد على networkconfiguration وموقع السرفر

### العقود (SLA)

- **Vercel**: 99.95% uptime guaranteed
- **Apache**: يعتمد على توفرية السرفر الخاص بك

### التوسع (Scaling)

- **Vercel**: يتوسع تلقائياً
- **Apache**: قد تحتاج إلى tune server resources يدويًا

### التكلفة

- **Vercel**: Pay-as-you-go (functions & bandwidth)
- **Apache**: رسوم الهوستنج فقط

## التحقق من الأداء المتساوي

للتأكد من أن Apache يعمل مثل Vercel تماماً، اختبر:

```bash
# 1. اختبر SSR page
curl -I http://your-domain.com/news/1

# يجب أن ترى HTML (ليس redirect)
# Status: 200 OK
# Content-Type: text/html

# 2. اختبر API proxy
curl http://your-domain.com/api/gallery

# يجب أن ترى JSON response

# 3. اختبر static files
curl -I http://your-domain.com/assets/main.js

# يجب أن يكون Status: 200 OK
```

## Optimizations للـ Apache

### 1. Enable Compression
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### 2. Cache Headers (كما في ascww.conf)
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access 1 year"
  ExpiresByType application/javascript "access 1 year"
</IfModule>
```

### 3. Security Headers
```apache
<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
</IfModule>
```

## الخلاصة

✅ **المميزات المتطابقة:**
- SSR Rendering لـ dynamic pages
- API Proxy إلى backend
- Static files serving
- Gallery API

✅ **المميزات الإضافية على Apache:**
- كنترول كامل على configuration
- بدون تكاليف subscription
- إمكانية تشغيل تطبيقات أخرى على نفس السرفر

⚠️ **نقاط الاهتمام:**
- يجب مراقبة الخدمة يدويًا
- قد تحتاج إلى tune performance settings
- SSL/HTTPS تحتاج إلى إعداد يدوي
