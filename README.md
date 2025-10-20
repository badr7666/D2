
# CloudShop Inventory — Flat (v0.1.3)

نسخة بمجلد واحد، تعمل مع Supabase (مصادقة + قاعدة بيانات).

## تشغيل سريع
1) أنشئ مشروع Supabase وخذ `SUPABASE_URL` و `SUPABASE_ANON_KEY`.
2) حرر `config.example.js` وانسخه باسم `config.js` وحط القيم.
3) شغّل خادم محلي:
```
python -m http.server 8000
```
ثم افتح:
```
http://localhost:8000/login.html
```
أو `signup.html` للتسجيل.

## GitHub Pages
- ارفع كل الملفات لمستودعك.
- فعّل Pages من Settings.
- حدّد `main` و`/(root)`.
- عدّل Site URL/Redirect URLs في Supabase إلى رابط GitHub Pages.
- `index.html` يوجّه تلقائيًا إلى `login.html` حسب المسار.

## قاعدة البيانات
شغّل محتوى `schema.sql` ثم `policies.sql` داخل SQL Editor في Supabase.
