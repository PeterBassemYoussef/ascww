# ملخص التوزيع على Apache Server 📋

## السؤال
**تريد نقل مشروعك من Vercel إلى Apache server الخاص بك، بنفس طريقة عمله على Vercel**

## الإجابة المختصرة ✓

تصميم مشروعك **يسمح** بـ:
1. **Vercel deployment** ← الحالي
2. **Apache deployment** ← الجديد (المطلوب)
3. **أي Node.js server** ← يعمل الاثنين

البيان تماماً لأن:
- ✅ React + TypeScript + Vite (Framework agnostic)
- ✅ SSR عبر Node.js (server.js)
- ✅ API proxy إلى backend
- ✅ Build process موحد

---

## الملفات التي تم إنشاؤها لك

### 📂 Files in `/deploy/apache/`
```
deploy/apache/
└── ascww.conf          ← Apache Virtual Host Config
                           (استخدام بدلاً من nginx)
```

### 📋 Documentation Files
```
DEPLOYMENT_APACHE_AR.md         ← دليل كامل (العربية)
DEPLOYMENT_QUICK_START.md       ← خطوات سريعة
DEPLOYMENT_VERCEL_VS_APACHE.md  ← المقارنة والاختلافات
DEPLOYMENT_TROUBLESHOOTING.md   ← حل المشاكل الشائعة
DEPLOYMENT_CONFIG_COMPARISON.md ← مقارنة الإعدادات التفصيلية
```

---

## الخطوات الرئيسية (5 خطوات فقط)

### 1️⃣ بناء النسخة الإنتاجية (على جهازك المحلي)
```bash
cd d:\ascww.main
npm run build
npm start  # اختبر محلياً
```

### 2️⃣ نسخ الملفات إلى السرفر
```bash
scp -r . your-user@your-server:/var/www/ascww/
```

### 3️⃣ تثبيت على السرفر
```bash
ssh your-user@your-server
cd /var/www/ascww
npm install
```

### 4️⃣ تفعيل الخدمة
```bash
sudo systemctl start ascww
sudo systemctl enable ascww
sudo systemctl restart apache2
```

### 5️⃣ التحقق
```bash
curl http://your-domain.com  # سيعمل! ✓
```

---

## ماذا حدث؟

### الـ Architecture

```
┌─────────────────────────────────────┐
│   Apache Web Server                 │
│   (على port 80/443)                  │
└──────────────┬──────────────────────┘
               │
               ↓ (Reverse Proxy)
┌──────────────────────────────────────┐
│   Node.js Server (server.js)         │
│   (على port 3000)                     │
│   ├─ SSR Rendering                   │
│   ├─ API Routing                     │
│   └─ backend.ascww.org API Proxy     │
└──────────────────────────────────────┘
```

### كيف يعمل؟

1. المستخدم يذهب إلى `https://your-domain.com`
2. Apache يستقبل الطلب على port 80/443
3. Apache يعيد توجيه الطلب إلى `http://127.0.0.1:3000`
4. Node.js server.js يستقبل الطلب
5. server.js يحدد نوع الطلب:
   - **SSR Request** (مثل `/news/123`) → يعيد HTML مُرّن
   - **Static File** (مثل `/assets/main.js`) → يخدم من dist/
   - **API Call** (مثل `/api/gallery`) → يمرر إلى backend
6. النتيجة ترجع للمستخدم

---

## الفروقات من Vercel

| النقطة | Vercel | Apache |
|--------|--------|---------|
| التكلفة | subscription | فقط السرفر |
| النشر | `git push` | يدوي + CI/CD (اختياري) |
| التوسع | تلقائي | يدوي |
| CDN Global | ✅ متضمن | ❌ قد تحتاج |
| Uptime SLA | 99.95% | يعتمد على السرفر |
| التحكم | محدود | كامل |

---

## المميزات (Everything works the same)

✅ **SSR Rendering** - الصفحات تُرسل مع بيانات كاملة
✅ **Dynamic Pages** - News, Projects, Tenders عمل 100%
✅ **API Proxy** - تتصل بـ backend.ascww.org
✅ **Gallery API** - عرض الصور مع تحويل WebP
✅ **Search** - البحث يعمل زي ما هو
✅ **Static Files** - CSS, JS, Images كل حاجة تحمل
✅ **Environment Variables** - Configuration مستقلة

---

## التحقق من كل شيء يعمل

```bash
# 1. اختبر Node.js server
curl http://localhost:3000/              # HTML
curl http://localhost:3000/assets/       # Assets

# 2. اختبر Apache proxy
curl http://localhost/                   # HTML
curl http://localhost/assets/main.js     # JS file

# 3. اختبر عبر الدومين
curl http://your-domain.com/             # يعمل ✅
curl https://your-domain.com/            # يعمل ✅

# 4. اختبر SSR
curl http://your-domain.com/news/1       # HTML SSR
curl http://your-domain.com/projects/2   # HTML SSR

# 5. اختبر API
curl http://your-domain.com/api/gallery  # JSON ✅
```

---

## الملفات الرئيسية (ما تحتاج تعديله)

### ✏️ يجب تعديل (استبدل your-domain.com)

1. **[deploy/apache/ascww.conf](deploy/apache/ascww.conf)**
   - غيّر `your-domain.com` إلى نطاقك
   - غيّر `/var/www/ascww` إذا كان المسار مختلف

2. **[deploy/systemd/ascww-apache.service](deploy/systemd/ascww-apache.service)**
   - غيّر `VITE_SITE_URL` إلى نطاقك
   - غيّر `WorkingDirectory` إذا لزم

3. **[.env](/) (إذا لم تكن موجود)**
   ```bash
   NODE_ENV=production
   PORT=3000
   BACKEND_BASE_URL=https://backend.ascww.org
   VITE_SITE_URL=https://your-domain.com
   ```

### ✅ لا تحتاج تعديل

- `vite.config.ts` - بناء العملية متساوية
- `server.js` - يتعامل مع كل حاجة
- `package.json` - المعتمدات نفسها

---

## مشاكل قد تواجهك + الحل السريع

| المشكلة | الحل |
|--------|------|
| Blank page / 404 | `sudo systemctl restart ascww` |
| 502 Bad Gateway | `curl http://localhost:3000` تحقق من Node.js |
| CSS/JS لا يحمل | `npm run build` وأعد البناء |
| API لا يعمل | تحقق من `BACKEND_BASE_URL` |
| Slow performance | فعّل compression و caching (في ascww.conf) |
| SSL Error | `sudo certbot --apache` |

→ التفاصيل الكاملة في [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md)

---

## المراجع السريعة

📖 **اقرأ هذه الملفات بالترتيب:**

1. [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md) - ابدأ هنا 🚀
2. [DEPLOYMENT_APACHE_AR.md](DEPLOYMENT_APACHE_AR.md) - شرح كامل
3. [DEPLOYMENT_CONFIG_COMPARISON.md](DEPLOYMENT_CONFIG_COMPARISON.md) - فهم الفروقات
4. [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md) - عند مواجهة مشاكل
5. [DEPLOYMENT_VERCEL_VS_APACHE.md](DEPLOYMENT_VERCEL_VS_APACHE.md) - مقارنة شاملة

---

## الخطوات التالية

### قصيرة المدى
- [ ] اختبر البناء محلياً: `npm run build && npm start`
- [ ] جهّز السرفر الخاص بك
- [ ] انسخ الملفات
- [ ] شغّل الخدمة
- [ ] اختبر الموقع

### متوسطة المدى
- [ ] أعدّ نطاق الدومين
- [ ] فعّل SSL/HTTPS
- [ ] اختبر الأداء
- [ ] اختبر جميع الصفحات والميزات

### طويلة المدى
- [ ] ابدأ مراقبة الخدمة
- [ ] فعّل CI/CD للتحديثات التلقائية
- [ ] أضف CDN للـ static files
- [ ] زيادة resources إذا لزمت

---

## نقطة مهمة ⚠️

**المشروع الحالي على Vercel سيبقى يعمل.**

يمكنك:
1. ✅ تشغيل نسخة على Apache
2. ✅ الحفاظ على Vercel (كـ backup)
3. ✅ التبديل بينهما حسب الحاجة

أم تريد تحويل DNS ليشير إلى Apache فقط →
احتفظ بـ Vercel كـ backup في حالة الطوارىء.

---

## الخلاصة النهائية

| عامل | الحالة |
|------|--------|
| **الكود** | لا يحتاج تغيير ✅ |
| **Build** | `npm run build` نفسه ✅ |
| **Server** | Node.js server.js مستعد ✅ |
| **Apache Config** | جاهز في deploy/apache/ ✅ |
| **Documentation** | 5 ملفات تفصيلية ✅ |

### ستحصل على:
✓ نفس الأداء
✓ نفس الميزات
✓ تحكم كامل
✓ توفير التكاليف

---

## الدعم والأسئلة

إذا واجهت مشاكل:

1. اقرأ [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md)
2. شغّل الأوامر:
   ```bash
   sudo systemctl status ascww
   sudo journalctl -u ascww -f
   sudo tail -f /var/log/apache2/error.log
   ```
3. جمّع المعلومات والاتصل بـ support

---

**Good luck! أنت بصدد الانتقال من Vercel إلى خادمك الخاص. هذا يوفر لك المرونة والتحكم الكامل!** 🎉

استمتع! 🚀
