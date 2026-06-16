# خطوات البناء والتوزيع السريعة

## على جهازك المحلي - البناء

```bash
# 1. انتقل إلى مجلد المشروع
cd d:\ascww.main

# 2. بناء النسخة الإنتاجية
npm run build

# 3. اختبر محلياً
npm start

# اذهب إلى http://localhost:3000
```

## على السرفر - التثبيت والتشغيل

```bash
# 1. نسخ الملفات المبنية من جهازك إلى السرفر
scp -r dist your-user@your-server:/var/www/ascww/
scp -r node_modules your-user@your-server:/var/www/ascww/
scp server.js your-user@your-server:/var/www/ascww/

# أو انسخ كل المشروع
scp -r . your-user@your-server:/var/www/ascww/

# 2. على السرفر - تثبيت الـ dependencies
ssh your-user@your-server
cd /var/www/ascww
npm install

# 3. اختبر تشغيل الـ server
node server.js
# يجب أن ترى: Server running on port 3000

# 4. إذا كان يعمل، قم بتفعيل الخدمة
sudo systemctl start ascww
sudo systemctl enable ascww
sudo systemctl status ascww

# 5. أعد تشغيل Apache
sudo systemctl restart apache2
```

## التحقق من أن كل شيء يعمل

```bash
# على السرفر
curl http://localhost:3000     # اختبر Node.js مباشرة
curl http://localhost           # اختبر Apache proxy
curl http://your-domain.com     # اختبر عبر الدومين
```

## إذا واجهت مشاكل

```bash
# شاهد سجلات الخدمة
sudo journalctl -u ascww -f

# شاهد سجلات Apache
sudo tail -f /var/log/apache2/error.log

# تحقق من أن Node.js يستمع
netstat -an | grep 3000

# تحقق من أن Apache modules مفعلة
sudo apache2ctl -M | grep proxy
```

---

**ملاحظة**: استبدل:
- `your-user` بـ اسم المستخدم على السرفر
- `your-server` بـ IP address أو hostname السرفر
- `your-domain.com` بـ الدومين الفعلي
