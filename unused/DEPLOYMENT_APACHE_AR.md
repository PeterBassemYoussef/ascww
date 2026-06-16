# دليل التوزيع على Apache Server

## المتطلبات

- Apache 2.4 أو أحدث
- Node.js 20.0.0 أو أحدث
- npm أو yarn
- Sudo/root access للتثبيت على السرفر

## الخطوة 1: تحضير البيئة على السرفر

### تثبيت المتطلبات

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js (إذا لم يكن مثبتاً)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# التحقق من الإصدارات
node --version  # يجب أن يكون v20+
npm --version

# تثبيت Apache (إذا لم يكن مثبتاً)
sudo apt install -y apache2

# تفعيل Apache modules المطلوبة
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod expires
sudo a2enmod deflate
```

### إنشاء مجلد التطبيق

```bash
# إنشاء مجلد التطبيق
sudo mkdir -p /var/www/ascww
sudo chown -R $USER:$USER /var/www/ascww

# أو إذا كنت تستخدم www-data user
sudo mkdir -p /var/www/ascww
sudo chown -R www-data:www-data /var/www/ascww
```

## الخطوة 2: نسخ وبناء المشروع

### على جهازك المحلي أو على السرفر

```bash
# إذا كنت تنسخ من machine محلية
# 1. انسخ ملفات المشروع إلى السرفر
scp -r /path/to/ascww-project user@your-server:/var/www/ascww

# أو استخدم git
cd /var/www/ascww
git clone https://repository-url.git .

# 2. ثبت المعتمدات
cd /var/www/ascww
npm install

# 3. بناء المشروع (النسخة الإنتاجية)
npm run build

# 4. تحقق من وجود مجلد dist
ls -la dist/
```

### إعدادات المتغيرات البيئية

قم بإنشاء ملف `.env` أو تعيين متغيرات البيئة في systemd service:

```bash
# انسخ من الملف الافتراضي إذا كان موجوداً
cp .env.example .env

# أو أنشئ ملف جديد
cat > /var/www/ascww/.env << 'EOF'
NODE_ENV=production
PORT=3000
BACKEND_BASE_URL=https://backend.ascww.org
VITE_API_BASE_URL=/api
VITE_SITE_URL=https://your-domain.com
EOF
```

## الخطوة 3: إعداد Apache

### نسخ ملف الإعدادات

```bash
# انسخ ملف Apache config إلى مجلد Apache
sudo cp /var/www/ascww/deploy/apache/ascww.conf /etc/apache2/sites-available/

# أو أنشئ رابطة symbolic
sudo ln -s /var/www/ascww/deploy/apache/ascww.conf /etc/apache2/sites-available/ascww.conf
```

### تحديث إعدادات الدومين

```bash
# عدّل ملف Apache config وغيّر your-domain.com
sudo nano /etc/apache2/sites-available/ascww.conf
```

ابحث عن `your-domain.com` وغيره إلى نطاقك الفعلي

### تفعيل الموقع

```bash
# تفعيل الـ virtual host
sudo a2ensite ascww

# تعطيل الـ default site (اختياري)
sudo a2dissite 000-default

# اختبر إعدادات Apache
sudo apache2ctl configtest
# يجب أن تحصل على: Syntax OK

# أعد تشغيل Apache
sudo systemctl restart apache2
```

## الخطوة 4: إعداد Node.js Server

### استخدام Systemd Service

```bash
# انسخ ملف systemd service
sudo cp /var/www/ascww/deploy/systemd/ascww.service /etc/systemd/system/

# عدّل الملف إذا لزم (مسارات، ports، env vars)
sudo nano /etc/systemd/system/ascww.service
```

تأكد من المجلد الصحيح والمتغيرات:
- `WorkingDirectory=/var/www/ascww`
- `User=www-data` و `Group=www-data` (أو المستخدم الصحيح)
- `PORT=3000`
- `BACKEND_BASE_URL=https://backend.ascww.org`

### تشغيل الخدمة

```bash
# أعد تحميل systemd
sudo systemctl daemon-reload

# ابدأ الخدمة
sudo systemctl start ascww

# فعّل الخدمة لتبدأ عند إعادة التشغيل
sudo systemctl enable ascww

# تحقق من حالة الخدمة
sudo systemctl status ascww

# شاهد سجلات الخدمة
sudo journalctl -u ascww -f
```

## الخطوة 5: اختبار التوزيع

```bash
# اختبر أن Node.js يستمع على port 3000
curl http://localhost:3000

# اختبر عبر Apache proxy
curl http://localhost/

# أو استخدم اسم الدومين
curl http://your-domain.com
```

## الخطوة 6: إعداد SSL/HTTPS (مهم جداً)

### استخدام Let's Encrypt

```bash
# تثبيت Certbot
sudo apt install -y certbot python3-certbot-apache

# الحصول على شهادة SSL
sudo certbot --apache -d your-domain.com -d www.your-domain.com

# التحديث التلقائي
sudo systemctl enable certbot.timer
```

بعد حصولك على شهادة، استخدم HTTPS config في ascww.conf (راجع التعليقات في الملف)

## الخطوة 7: المراقبة والصيانة

### مراقبة الخدمة

```bash
# شاهد حالة الخدمة
sudo systemctl status ascww

# شاهد السجلات
sudo journalctl -u ascww -f

# مراقبة استخدام الموارد
top
free -h
```

### التحديثات

```bash
# تحديث الكود من git
cd /var/www/ascww
git pull

# إعادة بناء
npm run build

# إعادة تشغيل الخدمة
sudo systemctl restart ascww
```

### حل المشاكل

```bash
# إذا كان port 3000 مشغولاً
lsof -i :3000
kill -9 <PID>

# إذا كانت الأذونات خاطئة
sudo chown -R www-data:www-data /var/www/ascww

# اختبر إعدادات Apache
sudo apache2ctl -t -D DUMP_VHOSTS
```

## المقارنة بـ Vercel

| الميزة | Vercel | Apache Server |
|-------|--------|---------------|
| **التوزيع** | Automatic | Manual بـ npm run build + systemd |
| **الـ Reverse Proxy** | Built-in | Apache config |
| **SSR** | ✅ يعمل تلقائياً | ✅ Node.js server يتولاه |
| **API Proxy** | vercel.json rewrites | Apache proxy rules |
| **الـ Scaling** | Auto | Manual |
| **سعر التكلفة** | Subscription | Your server |

## الخطوات الضرورية لتشغيل محلياً أولاً

قبل التوزيع على السرفر، اختبر محلياً:

```bash
# بناء النسخة الإنتاجية
npm run build

# تشغيل الـ server
npm start

# افتح في المتصفح
# http://localhost:3000
```

استمتع بتوزيعك! 🚀
