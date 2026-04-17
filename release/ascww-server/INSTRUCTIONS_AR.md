# تعليمات تشغيل وتفعيل المشروع على سيرفر Apache

مرحباً، 
يحتوي هذا المجلد على ملفات البناء (Build) الجاهزة للتشغيل لـموقع ASCWW. 
المشروع ليس مجرد ملفات ثابتة (Static)، بل يحتاج إلى العمل من خلال **Node.js Server** وتكوين **Apache كـ Reverse Proxy**، وذلك لضمان عمل الـ SSR (دعم محركات البحث) و API Proxy بشكل صحيح.

الرجاء اتباع هذه الخطوات تباعاً بعد فك الضغط ووضع الملفات في مسارها على السيرفر (على سبيل المثال: `/var/www/ascww`):

---

### 1. إعداد المتغيرات البيئية وتثبيت الحزم
من خلال الـ Terminal داخل مجلد المشروع المرفوع على السيرفر:

```bash
# تثبيت الحزم المطلوبة لبيئة الإنتاج فقط
npm install --omit=dev

# أخذ نسخة من ملف الإعدادات
cp .env.server.example .env.production
```

**مهم:** افتح ملف `.env.production` وقم بتعديل المتغيرات لتطابق الدومين الخاص بالموقع:
```env
VITE_SITE_URL=https://your-domain.com
VITE_API_BASE_URL=/api
```

---

### 2. تشغيل سيرفر Node.js ليعمل دائماً في الخلفية
لكي يستمر ملف `server.js` بالعمل في الخلفية بشكل موثوق، استخدم إعدادات Systemd المرفقة:

```bash
# 1. انسخ ملف الخدمة المرفق مع المشروع إلى مجلد خدمات النظام
sudo cp deploy/systemd/ascww-apache.service /etc/systemd/system/ascww.service

# 2. قم بتحديث مسارات الخدمة إذا تطلب الأمر (اختياري)
# sudo nano /etc/systemd/system/ascww.service
# (تأكد أن WorkingDirectory يشير إلى المسار الصحيح للمشروع /var/www/ascww)

# 3. تفعيل وتشغيل الخدمة
sudo systemctl daemon-reload
sudo systemctl enable ascww
sudo systemctl start ascww

# 4. تحقق أن الخدمة تعمل بنجاح (المفترض أن تعمل على Port 3000)
sudo systemctl status ascww
```

---

### 3. إعداد خادم Apache ليعمل كـ Reverse Proxy
الآن وبعد أن أصبح سيرفر Node.js يستقبل الطلبات داخلياً على البورت `3000`، نحتاج إلى توجيه زيارات Apache الخارجية إليه.

**تأكد أولاً من تفعيل الموديولات الأساسية للبروكسي في Apache:**
```bash
sudo a2enmod proxy proxy_http rewrite
```

**إعداد الـ Virtual Host للدومين:**
قم بإنشاء أو تعديل إعدادات الدومين الخاص بالموقع (مثلاً `/etc/apache2/sites-available/ascww.conf`) وإضافة التوجيه التالي:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com

    # إعداد الـ Proxy لتوجيه الطلبات لسيرفر Node.js
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # (اختياري) إعدادات ملفات السجلات لتسهيل المتابعة
    ErrorLog ${APACHE_LOG_DIR}/ascww-error.log
    CustomLog ${APACHE_LOG_DIR}/ascww-access.log combined
</VirtualHost>
```

**تفعيل الموقع وإعادة تشغيل Apache:**
```bash
sudo a2ensite ascww.conf
sudo systemctl restart apache2
```

---

### 4. اختبار نجاح العمل
بعد تطبيق الخطوات السابقة:
1. قم بزيارة الدومين الخاص بالموقع.
2. تأكد من أن الصفحات تعمل بشكل سليم.
3. يمكنك تجربة الدخول على روابط الـ API للتأكد من نجاح عمل الـ Proxy الداخلي.

*(ملاحظة: لتفعيل الـ HTTPS، قم باستخدام Certbot و Let's Encrypt لتثبيت الشهادة على سيرفر Apache بعد التأكد من عمل الموقع بشكل صحيح على HTTP).*
