# تعليمات رفع المشروع على السيرفر الخاص

هذا الملف مخصص للمطور أو مسؤول السيرفر الذي سيقوم برفع المشروع وتشغيله على سيرفر لينكس بحيث يعمل الموقع بنفس فكرة التشغيل الحالية، وليس كاستضافة ملفات `dist` فقط.

## الهدف

تشغيل الموقع عبر:

1. `node server.js`
2. `systemd` للإبقاء على الخدمة شغالة
3. `Nginx` كـ reverse proxy
4. HTTPS عبر `certbot` إن لزم

هذا مهم لأن المشروع يعتمد على:

- SPA routing
- SSR meta tags
- `/api/*` proxy
- `/api/gallery/*`

## افتراضات مهمة

- نظام التشغيل: Ubuntu أو Debian
- اسم الدومين النهائي معروف
- DNS للدومين يشير إلى السيرفر
- الباك إند الحالي سيظل:
  `https://backend.ascww.org`
- مسار المشروع على السيرفر سيكون:
  `/var/www/ascww`

إذا تغير أي عنصر من العناصر السابقة، يجب تعديل القيم في الملفات والأوامر.

## الملفات المهمة داخل المشروع

- `server.js`
- `.env.server.example`
- `deploy/nginx/ascww.conf`
- `deploy/systemd/ascww.service`
- `DEPLOYMENT_PRIVATE_SERVER.md`

## 1) تثبيت المتطلبات على السيرفر

نفذ التالي بصلاحية `root` أو `sudo`:

```bash
sudo apt update
sudo apt install -y nginx curl git
```

### تثبيت Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

المطلوب أن تكون نسخة Node `20` أو أحدث.

## 2) رفع المشروع إلى السيرفر

ارفع المشروع كاملًا إلى هذا المسار:

```bash
/var/www/ascww
```

مهم جدًا:

- لا ترفع مجلد `dist` فقط
- يجب رفع المشروع كاملًا بما فيه:
  - `src`
  - `public`
  - `api`
  - `scripts`
  - `server.js`
  - `package.json`

## 3) الدخول إلى المشروع

```bash
cd /var/www/ascww
```

## 4) تثبيت الاعتمادات

```bash
npm ci
```

إذا فشل `npm ci` بسبب عدم وجود `package-lock.json` متوافق، يمكن استخدام:

```bash
npm install
```

لكن الأفضل هو `npm ci`.

## 5) إنشاء ملف البيئة للإنتاج

انسخ الملف المثال:

```bash
cp .env.server.example .env.production
```

ثم عدل الملف:

```bash
nano .env.production
```

ويكون بالشكل التالي:

```bash
VITE_API_BASE_URL=/api
VITE_SITE_URL=https://your-domain.com
VITE_ROUTER_MODE=browser
PORT=3000
BACKEND_BASE_URL=https://backend.ascww.org
```

### المطلوب تعديله

- استبدال `https://your-domain.com` بالدومين الحقيقي
- إذا كان الباك إند مختلفًا، غيّر `BACKEND_BASE_URL`

### مهم

- لا تستخدم `.env.production.private`
- لا تستخدم `VITE_ROUTER_MODE=hash` في هذا السيناريو
- هذا المشروع يجب أن يعمل على `browser routing` مع `server.js`

## 6) بناء المشروع

```bash
npm run build
```

إذا نجح البناء فهذا يعني أن نسخة الإنتاج أصبحت جاهزة.

## 7) اختبار التشغيل يدويًا قبل ربط Nginx

شغل الموقع:

```bash
npm run start:prod
```

ثم اختبر من نفس السيرفر:

```bash
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/news-archive
curl -I http://127.0.0.1:3000/api/gallery/school_dep
```

المفترض أن تكون الاستجابة `200 OK`.

بعد الاختبار أوقف التشغيل اليدوي:

```bash
Ctrl + C
```

## 8) إعداد خدمة systemd

انسخ ملف الخدمة:

```bash
sudo cp deploy/systemd/ascww.service /etc/systemd/system/ascww.service
```

افتحه للتعديل:

```bash
sudo nano /etc/systemd/system/ascww.service
```

وتأكد من القيم التالية:

```ini
[Unit]
Description=ASCWW frontend Node server
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/ascww
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=VITE_API_BASE_URL=/api
Environment=VITE_SITE_URL=https://your-domain.com
Environment=BACKEND_BASE_URL=https://backend.ascww.org
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### نقاط يجب مراجعتها

- `WorkingDirectory` يجب أن يساوي مسار المشروع الفعلي
- `VITE_SITE_URL` يجب أن يساوي الدومين الحقيقي
- `ExecStart` يجب أن يشير إلى مسار `node`

لمعرفة مسار `node` الصحيح:

```bash
which node
```

إذا لم يكن `/usr/bin/node`، غيّر القيمة داخل ملف الخدمة.

### تشغيل الخدمة

```bash
sudo systemctl daemon-reload
sudo systemctl enable ascww
sudo systemctl start ascww
sudo systemctl status ascww
```

### أوامر مفيدة

```bash
sudo systemctl restart ascww
sudo systemctl stop ascww
sudo journalctl -u ascww -n 100 --no-pager
```

## 9) ضبط صلاحيات المجلد

إذا لزم الأمر:

```bash
sudo chown -R www-data:www-data /var/www/ascww
```

إذا كان الرفع تم بمستخدم آخر، تأكد فقط أن المستخدم الذي سيشغل الخدمة لديه صلاحية القراءة والتنفيذ.

## 10) إعداد Nginx

انسخ ملف الإعداد:

```bash
sudo cp deploy/nginx/ascww.conf /etc/nginx/sites-available/ascww
```

ثم افتحه:

```bash
sudo nano /etc/nginx/sites-available/ascww
```

واجعله كالتالي:

```nginx
server {
  listen 80;
  server_name your-domain.com www.your-domain.com;

  client_max_body_size 25m;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### المطلوب تعديله

- استبدال `your-domain.com`
- استبدال `www.your-domain.com`

### تفعيل الموقع

```bash
sudo ln -s /etc/nginx/sites-available/ascww /etc/nginx/sites-enabled/ascww
sudo nginx -t
sudo systemctl reload nginx
```

إذا كان هناك ملف افتراضي يسبب تعارضًا، يمكن تعطيله:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 11) إعداد HTTPS عبر Certbot

ثبت certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

ثم نفذ:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

اتبع الخطوات حتى يتم إصدار الشهادة وربط HTTPS.

## 12) اختبارات ما بعد الرفع

بعد اكتمال الرفع، يجب اختبار الروابط التالية من المتصفح:

```text
https://your-domain.com/
https://your-domain.com/news-archive
https://your-domain.com/projects-archive
https://your-domain.com/tenders-archive
```

ويجب أيضًا اختبار:

- فتح صفحة داخلية مباشرة من رابط مباشر
- إعادة تحميل الصفحة الداخلية بدون 404
- ظهور الصور والملفات الثابتة
- عمل الأخبار والمشروعات والمناقصات
- عدم وجود أخطاء console أو network

## 13) اختبارات سريعة من الطرفية

```bash
curl -I https://your-domain.com/
curl -I https://your-domain.com/news-archive
curl -I https://your-domain.com/api/gallery/school_dep
```

## 14) في حالة تحديث المشروع لاحقًا

كلما تم رفع نسخة جديدة:

```bash
cd /var/www/ascww
npm ci
npm run build
sudo systemctl restart ascww
```

إذا تغيرت ملفات البيئة أو إعدادات الخدمة:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ascww
```

## 15) أهم الأخطاء المتوقعة وحلها

### الموقع يفتح صفحة بيضاء

راجع:

- هل تم تشغيل `npm run build`
- هل الخدمة تعمل فعلًا
- هل `Nginx` يوجّه إلى `127.0.0.1:3000`
- هل `VITE_SITE_URL` مضبوط بشكل صحيح

### الدومين يعمل لكن الصفحات الداخلية لا تعمل

غالبًا السبب:

- تشغيل الموقع كاستضافة static فقط بدل `server.js`

### الخدمة لا تبدأ

راجع:

```bash
sudo systemctl status ascww
sudo journalctl -u ascww -n 100 --no-pager
which node
```

### ملفات الـ API لا تعمل

راجع:

- قيمة `BACKEND_BASE_URL`
- هل السيرفر يستطيع الوصول إلى `backend.ascww.org`

اختبار:

```bash
curl -I https://backend.ascww.org
```

## 16) المطلوب النهائي من المطور بعد الإنجاز

يرجى تسليم التالي بعد الرفع:

1. رابط الموقع النهائي
2. تأكيد أن HTTPS يعمل
3. تأكيد أن الصفحات الداخلية تعمل بدون `404`
4. تأكيد أن الأخبار والمشروعات والمناقصات تعمل
5. تأكيد أن خدمة `systemd` مفعلة وتعمل بعد إعادة تشغيل السيرفر
6. تزويدنا بأي قيم تم تغييرها عن الافتراضات المذكورة هنا

## 17) ملخص سريع جدًا

الأوامر الأساسية بالترتيب:

```bash
cd /var/www/ascww
npm ci
cp .env.server.example .env.production
nano .env.production
npm run build
sudo cp deploy/systemd/ascww.service /etc/systemd/system/ascww.service
sudo nano /etc/systemd/system/ascww.service
sudo systemctl daemon-reload
sudo systemctl enable ascww
sudo systemctl start ascww
sudo cp deploy/nginx/ascww.conf /etc/nginx/sites-available/ascww
sudo nano /etc/nginx/sites-available/ascww
sudo ln -s /etc/nginx/sites-available/ascww /etc/nginx/sites-enabled/ascww
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```
