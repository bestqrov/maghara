# شرح مشروع Zawaj App (married)

هاد الملف كيشرح بنية المشروع وكيفاش خدام تقنيا، باش أي واحد يقدر يفهم المشروع بسرعة.

---

## 1. شنو هو المشروع

تطبيق تعارف بقصد الزواج (Zawaj / Married)، فيه:
- **Backend**: NestJS (فـ root المشروع، `src/`)
- **Web App**: Next.js (`apps/web/`)
- **Mobile App**: React Native / Expo (`apps/mobile/`)

المشروع بنيان كـ **monorepo**: backend وحدة فـ root، والفرونط (web + mobile) كل واحد فـ `apps/`.

---

## 2. Tech Stack

| الجزء | التقنية |
|---|---|
| Backend Framework | NestJS (Node.js) |
| Database | MongoDB Atlas (عبر Mongoose ORM) |
| Cache / Rate limiting / Sessions | Redis (عبر `ioredis`) |
| Real-time chat | Socket.io (WebSockets) |
| Auth | JWT (`@nestjs/jwt` + `passport-jwt`) |
| Web Frontend | Next.js + Zustand + React Hook Form |
| Mobile | Expo (React Native) |
| Media Storage | Cloudinary (رفع الصور) |
| Deployment | Docker (`Dockerfile` + `docker-compose.yml`), مُخطط عليه VPS (Coolify) |

---

## 3. بنية الـ Backend (`src/`)

```
src/
├── main.ts                 → نقطة الانطلاق، كيفعّل CORS و ValidationPipe
├── app.module.ts            → الموديول الرئيسي، كيجمع كل الموديولات
├── redis/                   → REDIS_CLIENT (provider عام/Global)
├── common/
│   ├── guards/               → JwtAuthGuard, AdminGuard
│   └── decorators/           → CurrentUser decorator
├── schemas/                  → موديلات Mongoose (User, Match, Conversation, Message, Transaction, ProfileVisitor)
└── modules/
    ├── auth/                 → تسجيل + دخول (JWT)
    ├── users/                 → البروفايل ديال المستخدم
    ├── visitors/               → "المصيدة" - زوار البروفايل
    ├── matching/                → بحث، إرسال إعجاب (Interest)، قبول/رفض، Engaged
    ├── chat/                     → محادثة بـ WebSocket + Paywall
    ├── payments/                  → معاملات مالية (crypto / تحويل بنكي)
    └── verification/               → توثيق الهوية (CIN/Passport)
```

كل module فيه: `*.module.ts` (تسجيل)، `*.controller.ts` (REST routes)، `*.service.ts` (المنطق)، و`dto/` (validation ديال الـ input).

---

## 4. كيفاش خدامة كل ميزة (المنطق ديال الأعمال)

### أ. Auth (`modules/auth`)
- `POST /auth/register` → كيسجل مستخدم جديد، كيهاش الباسوورد بـ `bcrypt` (12 rounds)، كيرجع JWT.
- `POST /auth/login` → كيتحقق من الباسوورد، كيرجع JWT.
- الـ JWT فيه `sub` (userId) و`phoneNumber`، ومحمي بـ `JwtAuthGuard` فـ باقي الـ routes.

### ب. Matching / بحث (`modules/matching`)
- `GET /matching/search`: كيبحث على بروفايلات الجنس المعاكس، بفلاتر (بلد، مدينة، عمر، رغبة فـ الهجرة).
- **منطق التغبيش (Blur logic)**: المستخدم العادي (FREE) كيشوف غير **أول 2 بروفايلات** بوضوح، والباقي `blurred: true`. المستخدم VIP كيشوف الكل بلا تغبيش.
- الترتيب: البروفايلات الموثقة (`isVerified`) كتطلع لفوق أولا (verified-first).
- `POST /matching/interest/:receiverId`: إرسال إعجاب. عندو حد يومي (5 مجانا)، وSuper Like كيكلف coin واحد إلا ماكانش VIP.
- `POST /matching/:matchId/accept` أو `/reject`: الطرف اللي وصلو الإعجاب كيقرر.
- `POST /matching/:matchId/engaged`: تحديد الحالة كـ "مخطوبين" (`ENGAGED`) — خاص Match يكون `ACCEPTED` قبل.

### ج. Visitors / "المصيدة" (`modules/visitors`)
- كل مرة واحد كيزور بروفايل، كيتسجل فـ `ProfileVisitor` (upsert).
- المستخدم FREE كيشوف غير **آخر 8 زوار**، والزائر 9 و10 كيبانو `locked: true` (بلا معلومات) باش يشجعو على VIP.
- VIP كيشوف الكل بلا حدود.

### د. Chat (`modules/chat`)
- Conversation كيتخلق غير إلا Match كان `ACCEPTED` أو `ENGAGED`.
- الشات عبر **WebSocket** (namespace `chat`)، بحدثين: `joinConversation` و`sendMessage`.
- `moderation.util.ts` (`containsContactInfo`) كيمنع تبادل أرقام الهاتف أو روابط التواصل الاجتماعي فـ الرسائل (Regex).
- **Paywall**: أول 10 رسائل مجانية (`FREE_MESSAGE_LIMIT`)، بعدها المحادثة كتقفل (`isLockedForFree`) إلا كان المستخدم VIP أو دفع 5 coins باش يفتحها (`unlockConversationWithCoins`).

### هـ. Payments (`modules/payments`)
- `POST /payments/transactions`: كيخلق transaction بحالة `PENDING`. خاص `txHashOrReceipt` (TxHash للـ crypto، أو رقم الوصل للدفع اليدوي).
- Admin كيراجع (`/payments/admin/transactions/:id/approve` أو `/reject`) عبر `AdminGuard` (header `x-admin-key`).
- عند الموافقة (`applyTransactionEffect`)، حسب نوع المعاملة:
  - `COIN_PURCHASE` → كيزيد `coinBalance`
  - `VIP_SUBSCRIPTION` → كيبدل `subscriptionTier` لـ `VIP`
  - `VERIFICATION_FEE` → كيبدل `verificationStatus` لـ `PENDING`

### و. Verification (`modules/verification`)
- المستخدم كيبعث وثائق (`idDocumentUrl`, `residencyDocumentUrl`) → الحالة كتبدل لـ `PENDING`.
- Admin كيوافق (`isVerified: true`) أو كيرفض (مع سبب) عبر `AdminGuard`.

---

## 5. Guards والأمان

- **JwtAuthGuard** (`common/guards/jwt-auth.guard.ts`): كيحمي كل route محتاج المستخدم يكون داخل (Bearer token).
- **AdminGuard** (`common/guards/admin.guard.ts`): كيتحقق من header `x-admin-key` مقارنة مع `ADMIN_API_KEY` فـ `.env`. مستعمل فـ routes ديال الإدارة (موافقة على transactions/verification).
- **WsJwtGuard**: نفس فكرة JwtAuthGuard لكن للـ WebSocket connections ديال الشات.
- `ValidationPipe({ whitelist: true, transform: true })`: كيرفض أي حقل زايد ماشي معرف فـ الـ DTO، وكيحول الأنواع أوتوماتيك.

---

## 6. Infrastructure / البنية التحتية

- **MongoDB**: مستضاف فـ **MongoDB Atlas** (cloud)، ماشي محلي — `MONGODB_URI` فـ `.env`.
- **Redis**: مستعمل لـ rate limiting/throttling وربما caching. لازم يكون accessible من `REDIS_HOST`/`REDIS_PORT`.
- **Docker**: `Dockerfile` + `docker-compose.yml` — فيهم service `api` (الـ backend)، و`redis`، و(اختياري) `mongodb` + `mongo-express` محليين (تحت profile `local-db`، غير محتاجين حيت كنستعملو Atlas).
- **Deployment target**: VPS (Hostinger)، عبر Coolify — الـ API خاصها `MONGODB_URI`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_API_KEY` كـ Environment Variables.

---

## 7. كيفاش تخدم المشروع محليا

```bash
# 1. تثبيت الـ dependencies (backend)
npm install

# 2. تأكد .env فيه القيم الصحيحة (MONGODB_URI, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, JWT_SECRET, ADMIN_API_KEY...)

# 3. تشغيل Redis محليا (إلا ماكانش خدام)
redis-server

# 4. تشغيل الـ backend (dev mode, watch)
npm run start:dev
# → خدام على http://localhost:3000

# 5. تشغيل الـ web app
cd apps/web && npm install && npm run dev
# → خدام على http://localhost:3000 (ولا بورت آخر إلا كان محجوز)

# 6. تشغيل الـ mobile app
cd apps/mobile && npm install && npm run start
# → Expo Dev Tools
```

للـ production build ديال الـ backend:
```bash
npm run build && npm run start:prod
```

---

## 8. النقط المهمة اللي خاص واحد يديرها بعناية

- `.env` فيه معلومات حساسة (روابط قاعدة البيانات، مفاتيح سرية) — **ماشي مفروض يتبعث لـ git** (موجود فـ `.gitignore` أصلا).
- `ADMIN_API_KEY` خاصو يكون نفسو فـ `.env` المحلي وفـ Environment Variables ديال الـ deployment (Coolify).
- `REDIS_HOST` محليا `localhost`، لكن فـ Coolify/production خاصو يشير لاسم الـ Redis service (مثلا `redis`) ماشي `localhost`.
- IP ديال أي سيرفر كيحاول يتصل بـ MongoDB Atlas خاص يكون مزيد فـ **Network Access whitelist** ديال Atlas.
