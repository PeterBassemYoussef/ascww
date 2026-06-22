# تعليمات رفع نسخة `release/ascww-server` إلى السيرفر

هذا الملف مخصص للمطور المسؤول عن رفع المشروع على السيرفر الخاص وتشغيله بنفس أسلوب نسخة `release/ascww-server`.

## 1. المتطلبات

- نظام Linux على السيرفر
- Node.js 20
- Nginx
- صلاحية SSH على السيرفر
- دومين موجه إلى السيرفر

## 2. إنشاء نسخة الرفع على جهاز التطوير

من داخل جذر المشروع شغّل:

```powershell
npm run bundle:server
```

سيتم إنشاء نسخة جاهزة للرفع داخل:

```text
release/ascww-server
```

محتوى هذا المجلد يكفي للتشغيل على السيرفر، ولا حاجة لرفع `src` أو `node_modules` أو بقية ملفات التطوير.

## 3. تجهيز مجلد المشروع على السيرفر

بعد الدخول إلى السيرفر عبر SSH شغّل:

```bash
sudo mkdir -p /var/www/ascww
sudo chown -R $USER:$USER /var/www/ascww
```

إذا كان المسار النهائي مختلفًا، استبدل `/var/www/ascww` بالمسار الصحيح في جميع الأوامر التالية.

## 4. رفع الملفات من جهاز التطوير إلى السيرفر

### خيار PowerShell على ويندوز

```powershell
scp -r .\release\ascww-server\* user@your-server:/var/www/ascww/
```

استبدل:

- `user` باسم مستخدم السيرفر
- `your-server` بـ IP أو الدومين الخاص بالسيرفر

### خيار Linux أو macOS

```bash
scp -r ./release/ascww-server/* user@your-server:/var/www/ascww/
```

## 5. تثبيت الحزم وتشغيل المشروع على السيرفر

بعد اكتمال الرفع، ادخل إلى السيرفر وشغّل:

```bash
cd /var/www/ascww
cp .env.server.example .env
npm install --omit=dev
npm run start:prod
```

لو فتح الموقع محليًا على السيرفر من:

```text
http://127.0.0.1:3000
```

فهذا يعني أن التطبيق يعمل بشكل صحيح.

## 6. إعداد ملف البيئة `.env`

عدّل الملف:

```text
/var/www/ascww/.env
```

ليكون بالشكل التالي:

```env
PORT=3000
BACKEND_BASE_URL=https://backend.ascww.org
VITE_API_BASE_URL=/api
VITE_SITE_URL=https://your-domain.com
VITE_ROUTER_MODE=browser
```

استبدل `https://your-domain.com` بالدومين الحقيقي للموقع.

## 7. تشغيل المشروع تلقائيًا عبر `systemd`

أنشئ الملف التالي على السيرفر:

```text
/etc/systemd/system/ascww.service
```

واستخدم هذا المحتوى:

```ini
[Unit]
Description=ASCWW Frontend Node Server
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/ascww
Environment=NODE_ENV=production
EnvironmentFile=/var/www/ascww/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ascww

[Install]
WantedBy=multi-user.target
```

ثم نفذ:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ascww
sudo systemctl start ascww
sudo systemctl status ascww
```

إذا كان مسار Node مختلفًا على السيرفر، غيّر سطر `ExecStart`.

## 8. ربط Nginx مع تطبيق Node

أنشئ الملف التالي:

```text
/etc/nginx/sites-available/ascww
```

واستخدم هذا المحتوى:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

ثم فعّل الإعداد:

```bash
sudo ln -s /etc/nginx/sites-available/ascww /etc/nginx/sites-enabled/ascww
sudo nginx -t
sudo systemctl reload nginx
```

استبدل:

- `your-domain.com`
- `www.your-domain.com`

## 9. تفعيل SSL

بعد التأكد أن Nginx يعمل، فعّل HTTPS:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 10. تحديث الموقع لاحقًا

كلما خرج إصدار جديد:

### على جهاز التطوير

```powershell
npm run bundle:server
scp -r .\release\ascww-server\* user@your-server:/var/www/ascww/
```

### على السيرفر

```bash
cd /var/www/ascww
npm install --omit=dev
sudo systemctl restart ascww
```

## 11. فحص سريع بعد النشر

نفذ هذه الأوامر على السيرفر:

```bash
systemctl status ascww
curl -I http://127.0.0.1:3000
curl -I https://your-domain.com
```

## 12. ملاحظات مهمة

- لا ترفع مجلد `dist` فقط، لأن المشروع يعتمد أيضًا على `server.js` و`api/ssr.js`.
- هذا الأسلوب يحافظ على SSR للـ meta tags، ومسارات SPA، و`/api/*` proxy، و`/api/gallery/*`.
- إذا تم رفع نسخة جديدة، يكفي رفع محتويات `release/ascww-server` ثم إعادة تشغيل الخدمة.
