# 💍 Zawaj App - Project Specification & Technical Blueprint

منصة إلكترونية عصرية وجادة للتعارف بقصد الزواج الحلال، قائمة على مبادئ الستر، الأمان، وسيكولوجية القيمة قبل المقابل (Value-First Approach)، مع نظام ربحي هجين وتكامل مستقبلي مع شبكة الخدمات الخاصة بـ Smart Resto، وتركز بشكل خاص على الزواج الدولي والربط مع الجالية فـ الخارج (Cross-Border Matchmaking).

---

## 📋 Table of Contents
1. [Core Features & User Psychology](#1-core-features--user-psychology)
2. [Monetization & Payment System](#2-monetization--payment-system)
3. [Technical Architecture & Tech Stack](#3-technical-architecture--tech-stack)
4. [Database Schemas (MongoDB - Mongoose)](#4-database-schemas-mongodb---mongoose)
5. [Docker Infrastructure](#5-docker-infrastructure)
6. [Backend Implementation Status](#6-backend-implementation-status)

---

## 1. Core Features & User Psychology

* **Identity & Status Verification (التوثيق والهوية):**
  * توثيق عبر CIN/Passport أو Face Match للحصول على شارة "عضو جاد وموثق".
  * إتاحة خيار توثيق وضغية الإقامة/الجنسية بالخارج لزيادة المصداقية.
  * نتائج البحث التعارفية تعطى 2 بروفايلات موثوقة مجاناً (Free Tier)، وتغبيش البقية إلا باستخدام النقاط أو اشتراك VIP.
* **Cross-Border & Diaspora Matching (الزواج الدولي والجالية):**
  * تصفية وحصر البحث بين المقيمين فـ الوطن وأبناء الجالية فـ الخارج (أوروبا، أمريكا، الخليج، الخ).
  * خيارات مرنة لتحديد بلد الإقامة الحالي، بلد الأصل، والاستعداد للهجرة/الالتقاء (`relocationPreference`).
* **Visitor Engine - "المصيدة":**
  * الباقة المجانية كتشوف آخر 8 زوار لبروفايلك فقط، مع إبقاء الزائر 9 و 10 مقفلين ومغبشين (Blurred) مع قفل ذهبي لزيادة الفضول والتحويل لـ VIP.
  * الباقة الممتازة (VIP) كتشوف جميع الزوار بدون حدود.
* **Smart Chat & Safety Rules:**
  * منع تبادل أرقام الهواتف أو روابط وسائل التواصل الاجتماعي أوتوماتيكياً (Regex/AI Moderation).
  * الشات المجاني محدود فـ 7-10 رسائل فقط. عند الوصول للحد، يتم إغلاق الكتابة وإظهار Paywall Trigger لشحن النقاط أو الترقية لـ VIP.
  * إتاحة خيار كشف الصور أو إبقائها مغبشة (Blur) لحين التوافق المتبادل.
* **Marriage Closure & Eco-System Referral:**
  * زر `Mark as Engaged` عند التوافق والاتفاق على الزواج لإغلاق البروفايلات.
  * تقديم هدايا وتخفيضات للعرسان الجداد (Vouchers) بالتعاون مع الموردين والمطاعم والمنازل الشريكة فـ شبكة **Smart Resto**.

---

## 2. Monetization & Payment System

### A. Revenue Streams (نماذج الربح)
1. **Freemium Subscriptions (VIP / Cross-Border VIP):** شات غير محدود، رؤية جميع الزوار، فتح فلاتر البحث الدولي والجالية، وأولوية الظهور.
2. **Pay-As-You-Go Coins (النقاط):** شحن باقات لفتح شات معين، إرسال Super Likes، أو كشف زوار إضافيين.
3. **Verification Fee:** مبلغ رمزي لمرة واحدة لتوثيق الهوية والإقامة.

### B. Payment Gateways (طرق الدفع المعتمدة)
* 🚫 **Excluded:** Stripe (مستبعد تماماً).
* 🪙 **Crypto Payments (العملات الرقمية):**
  * **Chains المعتمدة:** USDT (TRC-20 / BEP-20)، Polygon (MATIC/USDT)، Solana (USDT/USDC)، BNB Chain.
  * ❌ **Ethereum (ETH/ERC-20):** مستبعد نظراً لارتفاع الـ Gas Fees.
  * **Integration Method:** Binance Pay API / NOWPayments / Direct Wallet TxHash Verification.
* 💳 **Local & Manual Payments (الدفع المحلي):**
  * تحويل بنكي مباشر (CIH / Attijari / BMCE).
  * خدمات التعبئة السريعة (Cash Plus / Wafacash) عبر رفع صورة الوصل (Receipt Upload) ومراجعته أوتوماتيكياً أو يدوياً فـ Admin Panel.

---

## 3. Technical Architecture & Tech Stack

* **Hosting Infrastructure:** Hostinger VPS (8GB RAM, 4 vCPU) using Docker Containers.
* **Backend Framework:** NestJS (Node.js) with WebSockets (Socket.io).
* **Database:** MongoDB Atlas (Mongoose ORM).
* **Caching & Rate Limiting:** Redis (for chat message counters, Socket sessions, and visitor limiters).
* **Media Storage:** Cloudinary / AWS S3 (handling original & blurred photo processing) — *not yet integrated*.
* **Frontend:** React Native (Expo) for mobile + Next.js for the Web App, in a monorepo.

---

## 4. Database Schemas (MongoDB - Mongoose)

Implemented at `src/schemas/`.

### `UserSchema`
```javascript
const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },

  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'],
    default: 'UNVERIFIED'
  },
  verificationDocuments: {
    idDocumentUrl: String,
    residencyDocumentUrl: String,
    rejectionReason: String,
    submittedAt: Date
  },

  subscriptionTier: { type: String, enum: ['FREE', 'VIP', 'CROSS_BORDER_VIP'], default: 'FREE' },
  coinBalance: { type: Number, default: 0 },
  dailyInterestsSent: { type: Number, default: 0 },
  lastInterestReset: { type: Date, default: Date.now },

  profile: {
    firstName: { type: String, required: true },
    gender: { type: String, enum: ['MALE', 'FEMALE'], required: true },
    birthDate: { type: Date, required: true },
    residenceCountry: { type: String, required: true },
    currentCity: { type: String, required: true },
    originCountry: { type: String, required: true },
    relocationPreference: {
      type: String,
      enum: ['OPEN_TO_MOVE', 'LOOKING_FOR_EXPAT', 'LOCAL_ONLY'],
      default: 'OPEN_TO_MOVE'
    },
    jobTitle: String,
    educationLevel: String,
    bio: String,
    photos: [String],
    isPhotoBlurred: { type: Boolean, default: true },
    matchCriteria: {
      minAge: Number,
      maxAge: Number,
      targetCountries: [String],
      targetCities: [String]
    }
  }
}, { timestamps: true });
```

### `ProfileVisitorSchema`
```javascript
const profileVisitorSchema = new mongoose.Schema({
  visitedProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visitedAt: { type: Date, default: Date.now }
});
profileVisitorSchema.index({ visitedProfileId: 1, visitedAt: -1 });
```

### `MatchSchema`
```javascript
const matchSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'ENGAGED'], default: 'PENDING' },
  isSuperLike: { type: Boolean, default: false }
}, { timestamps: true });
matchSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
```

### `ConversationSchema` & `MessageSchema`
```javascript
const conversationSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalMessagesCount: { type: Number, default: 0 },
  isLockedForFree: { type: Boolean, default: false },
  unlockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessageAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messageText: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });
```

### `TransactionSchema`
```javascript
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USDT' },
  paymentMethod: {
    type: String,
    enum: ['CRYPTO_TRC20', 'CRYPTO_POLYGON', 'CRYPTO_SOLANA', 'BANK_TRANSFER', 'CASH_PLUS'],
    required: true
  },
  txHashOrReceipt: { type: String },
  type: { type: String, enum: ['COIN_PURCHASE', 'VIP_SUBSCRIPTION', 'VERIFICATION_FEE'], required: true },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' }
}, { timestamps: true });
```

---

## 5. Docker Infrastructure

`docker-compose.yml` runs the API + Redis against **MongoDB Atlas** by default (`MONGODB_URI` comes from `.env`). A local MongoDB + mongo-express pair is also defined behind the `local-db` Docker Compose profile for offline development:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - redis

  # local-db profile only — not needed while using MongoDB Atlas
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    profiles: ["local-db"]

  mongo-express:
    image: mongo-express:latest
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ${MONGO_ROOT_USERNAME}
      ME_CONFIG_MONGODB_ADMINPASSWORD: ${MONGO_ROOT_PASSWORD}
      ME_CONFIG_MONGODB_URL: mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/
    depends_on:
      - mongodb
    profiles: ["local-db"]

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:
```

---

## 6. Backend Implementation Status

Built (`src/modules/`):

| Module | Endpoints | Status |
|---|---|---|
| **auth** | `POST /auth/register`, `POST /auth/login` | ✅ JWT + bcrypt |
| **users** | `GET /users/me`, `PATCH /users/me/profile` | ✅ |
| **visitors** | `POST /visitors/visit/:profileId`, `GET /visitors/me` | ✅ Free-tier 8-visible / 2-locked "trap" logic |
| **matching** | `GET /matching/search`, `POST /matching/interest/:receiverId`, `POST /matching/:matchId/accept\|reject\|engaged` | ✅ 2 free unblurred results, daily interest cap, Super Like, Mark as Engaged |
| **chat** | Socket.io gateway (`joinConversation`, `sendMessage`) + `POST/GET /chat/conversations/...` | ✅ Contact-info regex moderation, 10-message free cap, coin unlock |
| **payments** | `POST /payments/transactions`, `GET /payments/transactions/me`, admin review endpoints | ✅ Crypto (txHash) + manual (receipt) transactions, admin approve/reject |
| **verification** | `POST /verification/submit`, `GET /verification/me`, admin review endpoints | ✅ CIN/Passport + residency doc submission and review |

Not yet built:
* Cloudinary/S3 image upload + blur pipeline (photos are currently plain URL strings).
* Automatic crypto payment verification (Binance Pay / NOWPayments webhooks) — currently manual admin approval only.
* Redis-backed rate limiting (Redis client is wired via `RedisModule` but message/visit counters currently live in MongoDB fields).
* Admin panel UI (admin endpoints exist, gated by `x-admin-key` header, but there is no dashboard yet).
* Frontend (React Native / Next.js) — see `/apps` once scaffolded.

### Local development
```bash
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, ADMIN_API_KEY
npm install
npm run start:dev
```
