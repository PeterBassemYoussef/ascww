# دليل حل المشاكل الشائعة

## المشكلة 1: الصفحة تظهر blank أو 404

### السبب الأساسي
- Node.js server لا يعمل
- SSR API لا يعيد HTML صحيح

### الحل

```bash
# 1. تحقق من أن Node.js يعمل
curl http://localhost:3000/

# يجب أن ترى HTML هو الصفحة الرئيسية

# 2. إذا لم يعمل، ابدأ الخدمة
sudo systemctl start ascww

# 3. تحقق من السجلات
sudo journalctl -u ascww -f

# ابحث عن أخطاء في الـ server.js
```

### إذا رأيت "Cannot find module"
```bash
# ثبت المعتمدات مجدداً
cd /var/www/ascww
npm install

# تأكد من وجود الملفات المطلوبة
ls -la dist/
ls -la api/
```

---

## المشكلة 2: "Connection refused" على port 3000

### السبب
- الـ port 3000 مشغول بعملية أخرى
- Node.js services لم يبدأ

### الحل

```bash
# 1. تحقق من العملية على port 3000
lsof -i :3000
# أو
netstat -tulpn | grep 3000

# 2. إذا كانت هناك عملية قديمة
kill -9 <PID>

# 3. أعد تشغيل الخدمة
sudo systemctl restart ascww

# 4. تحقق من أن الخدمة بدأت
systemctl status ascww
```

---

## المشكلة 3: Apache يرد 502 Bad Gateway

### السبب
- Node.js server ليس مستجيباً
- Reverse proxy مكوّن بشكل خاطئ

### الحل

```bash
# 1. تحقق من أن Node.js يستمع على localhost:3000
curl http://localhost:3000/

# 2. اختبر Apache proxy مباشرة
curl http://localhost/ -v

# يجب أن ترى:
# < HTTP/1.1 200 OK
# < Content-Type: text/html

# 3. تحقق من Apache error logs
sudo tail -f /var/log/apache2/error.log

# 4. تحقق من Apache syntax
sudo apache2ctl -t

# يجب أن ترى: Syntax OK
```

### إذا كان الـ proxy غير مفعّل

```bash
# تأكد من تفعيل Apache modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite

# أعد تشغيل Apache
sudo systemctl restart apache2
```

---

## المشكلة 4: الـ Assets (CSS, JS) لا تحمل

### السبب
- المسارات النسبية خاطئة
- Vite build لم يتم بشكل صحيح

### الحل

```bash
# 1. تحقق من وجود dist folder
ls -la /var/www/ascww/dist/

# يجب أن ترى: index.html و assets folder

# 2. أعد البناء
cd /var/www/ascww
npm run build

# 3. اختبر تحميل الـ assets
curl http://your-domain.com/assets/index-xxx.js -I
# يجب أن تكون: HTTP/1.1 200 OK

# 4. تحقق من أن DocumentRoot صحيح في Apache config
grep DocumentRoot /etc/apache2/sites-available/ascww.conf
```

---

## المشكلة 5: البحث (Search) لا يعمل أو API لا يرد

### السبب
- Backend API غير متاح
- CORS issues

### الحل

```bash
# 1. تحقق من Backend connectivity
curl https://backend.ascww.org/api/health

# 2. اختبر API proxy عبر Node.js
curl http://localhost:3000/api/gallery

# 3. اختبر عبر Apache
curl http://your-domain.com/api/gallery

# 4. اذا فشلت القصفة الأولى والثانية، تحقق من BACKEND_BASE_URL
# في systemd service
cat /etc/systemd/system/ascww.service | grep BACKEND

# 5. غيّر القيمة إذا لزم
sudo nano /etc/systemd/system/ascww.service
# غيّر BACKEND_BASE_URL
sudo systemctl daemon-reload
sudo systemctl restart ascww
```

---

## المشكلة 6: الموقع بطيء

### التحقص الأولي

```bash
# 1. استخدم curl لقياس مدة الاستجابة
curl -w "\nConnect time: %{time_connect}\nFirst byte time: %{time_starttransfer}\nTotal time: %{time_total}\n" \
  -o /dev/null -s http://your-domain.com/

# 2. تحقق من استخدام الموارد
top
free -h
df -h
```

### الحلول

```bash
# 1. تمكين الضغط (Compression)
# ((بفعل في ascww.conf بالفعل))
sudo systemctl restart apache2

# 2. تمكين الـ caching
# ((بفعل في ascww.conf بالفعل))

# 3. تحقق من Node.js memory usage
ps aux | grep node

# إذا كان عالياً جداً، قد تحتاج:
# - More RAM
# - Clustering (حسّن server.js)
# - Database caching

# 4. استخدم cdn لـ static assets
# عدّل vite.config.ts وأضف CDN base
```

---

## المشكلة 7: HTTPS/SSL لا يعمل

### الحل

```bash
# 1. اولاً تحقق من أن HTTP يعمل
curl http://your-domain.com/

# 2. احصل على شهادة Let's Encrypt
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d your-domain.com

# 3. تحقق من الملفات
sudo ls -la /etc/letsencrypt/live/your-domain.com/

# 4. فعّل HTTPS في ascww.conf
# استرجع السطور المعلقة في الملف
sudo nano /etc/apache2/sites-available/ascww.conf

# 5. اختبر SSL
curl -I https://your-domain.com/

# 6. إذا فشل، تحقق من error log
sudo tail -f /var/log/apache2/ssl_error_log
```

---

## المشكلة 8: الأخطاء في السجلات (Logs)

### قراءة السجلات الصحيحة

```bash
# سجلات Node.js service
sudo journalctl -u ascww -f
sudo journalctl -u ascww --since "10 minutes ago"

# سجلات Apache
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/access.log

# البحث عن خطأ معين
sudo grep "error" /var/log/apache2/error.log
```

### الأخطاء الشائعة

| الخطأ | المعنى | الحل |
|------|--------|------|
| `EADDRINUSE` | Port مشغول | `kill -9 <PID>` |
| `EACCES` | مشاكل الأذونات | `sudo chown -R www-data:www-data /var/www/ascww` |
| `ENOENT` | ملف غير موجود | `npm install` ثم `npm run build` |
| `Connection refused` | Node.js لا يستمع | `systemctl start ascww` |

---

## المشكلة 9: لا تظهر التغييرات بعد التحديث

### السبب
- Cache في المتصفح
- Old build files

### الحل

```bash
# 1. حذف cache القديم
cd /var/www/ascww
rm -rf dist/

# 2. بناء من جديد
npm run build

# 3. أعد تشغيل الخدمة
sudo systemctl restart ascww

# 4. في المتصفح: Ctrl+Shift+Delete (settings > Clear browsing data)
# أو استخدم Private/Incognito mode للاختبار
```

---

## قائمة فحص قبل الإطلاق

```bash
# ✓ تحقق من أن كل شيء جاهز

# 1. Node.js و npm مثبتين
node --version && npm --version

# 2. المشروع مبني
ls -la dist/

# 3. Dependencies مثبتة
ls -la node_modules/ | wc -l

# 4. Systemd service موجود
ls -la /etc/systemd/system/ascww.service

# 5. Apache config موجود
ls -la /etc/apache2/sites-available/ascww.conf

# 6. Apache modules مفعلة
sudo apache2ctl -M | grep -E "proxy|rewrite"

# 7. Node.js يعمل
curl http://localhost:3000/ -I

# 8. Apache يعمل
curl http://localhost/ -I

# 9. Domain موجود
curl http://your-domain.com/ -I

# 10. SSL يعمل (اختياري لكن مهم)
curl https://your-domain.com/ -I
```

---

## التواصل مع Support

إذا استمرت المشاكل، اجمع هذه المعلومات:

```bash
# عرض معلومات النظام
uname -a
node --version
npm --version

# اختبار الاتصالية
curl -v http://localhost:3000/
curl -v http://localhost/

# Apache status
sudo systemctl status apache2

# Node.js service status
sudo systemctl status ascww

# آخر السجلات
sudo journalctl -u ascww -n 50
sudo tail -50 /var/log/apache2/error.log
```

شارك هذه المعلومات عند طلب المساعدة. 🆘
