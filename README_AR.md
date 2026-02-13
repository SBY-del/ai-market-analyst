# محلل الأسواق الذكي (BTC/ETH) — نسخة جاهزة كبداية مشروع

## ما الذي يفعله؟
- يجلب شموع BTC و ETH من Binance (Spot)
- يطبّق تحقق صارم (عتبة 99.9) قبل اعتماد الإشارة
- يولّد صور شارت PNG (4H و 1D)
- يرسل بريد بالمرفقات (اختياري)
- عند DRY_RUN=true: لا يرسل بريد، فقط يسجل ويولّد الصور

## تشغيل على سيرفر سحابي (Amazon Lightsail أو DigitalOcean)
1) ادخل السيرفر عبر SSH
2) ثبّت Docker:
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
sudo systemctl enable --now docker
```
3) ارفع المشروع للسيرفر (GitHub أو ZIP)
4) داخل مجلد المشروع:
```bash
cp .env.example .env   # اختياري للبريد
nano .env              # ضع بيانات SMTP
docker compose up -d --build
docker logs -f ai_market_analyst
```

## ملاحظة
- الدقة 99.9 تعني “اكتمال شروط صارمة” وليس ضمانًا مطلقًا ضد انعكاس السوق.
