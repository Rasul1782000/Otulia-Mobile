# Otulia Mobile — Backend API Documentation

## 1. Overview

The **Otulia** backend is a REST API built with **Node.js**, **Express**, and **TypeScript**. It serves a luxury marketplace mobile application (cars, estates, bikes, yachts, jets). The API handles authentication, listing management, image uploads, email sending, and PayPal payment orchestration.

- **Language:** TypeScript (ESM, `"type": "module"`)
- **Runtime:** Node.js (run via `tsx` in dev, bundled with `esbuild` for production)
- **Database:** SQLite via `better-sqlite3` (file `otulia.db`, WAL mode)
- **Auth:** JWT (HS256, 7-day expiry) in `Authorization: Bearer` header
- **Default port:** `5001`

---

## 2. Project Structure

```
backend/
├── package.json            # Dependencies & scripts
├── tsconfig.json
├── .env / .env.example     # Environment configuration
├── otulia.db*              # SQLite database files (WAL + shm)
├── uploads/                # Statically served uploaded images
├── dist/                   # Production build output (server.cjs)
└── src/
    ├── server.ts           # App entry: middleware, routes, server bootstrap
    ├── db.ts               # SQLite connection + schema initialization
    ├── middleware/
    │   ├── auth.ts          # JWT authentication guard
    │   └── rateLimit.ts      # express-rate-limit configurations
    └── routes/
        ├── auth.ts          # Registration, login, Google, user list
        ├── email.ts          # Send email via nodemailer
        ├── payment.ts        # PayPal order create/capture
        ├── upload.ts         # Image upload (base64 + multipart)
        └── listings.ts       # CRUD + filtering for marketplace listings
```

---

## 3. Environment Variables (`.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Server port (default `5001`) |
| `CLIENT_URL` | Allowed CORS origin (default `http://localhost:5173`) |
| `JWT_SECRET` | **Required.** Secret for signing/verifying JWT tokens |
| `PUBLIC_URL` | Base URL used to build uploaded image URLs |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | PayPal sandbox API credentials |
| `EMAIL_USER` / `EMAIL_PASS` / `EMAIL_HOST` / `EMAIL_PORT` | SMTP credentials for sending email |
| `GOOGLE_CLIENT_ID` / `GOOGLE_SECRET` | Google OAuth (client-side sign-in; backend accepts token payload) |
| `GA_PROPERTY_ID` / `GOOGLE_CLIENT_EMAIL` / `GOOGLE_PRIVATE_KEY` | Google Analytics service account (reserved, not yet wired into routes) |
| `VITE_BACKEND_URL` / `EXPO_PUBLIC_BACKEND_URL` / `VITE_GOOGLE_CLIENT_ID` / `VITE_WHATSAPP_NUMBER` | Frontend-facing config (read by the React Native / Expo app) |

> The server **exits immediately** if `JWT_SECRET` is missing (`server.ts:11-20`).

---

## 4. Database Schema (`src/db.ts`)

The database is initialized on import. Two tables are created if they do not exist, and WAL journal mode is enabled.

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `full_name` | TEXT NOT NULL | |
| `email` | TEXT NOT NULL UNIQUE | Case-insensitive uniqueness enforced at query time |
| `password` | TEXT NOT NULL | Bcrypt hash (cost 12) |
| `created_at` | TEXT DEFAULT `datetime('now')` | |

### `listings`
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `type` | TEXT NOT NULL | CHECK: `car`, `estate`, `bike`, `yacht`, `jet` |
| `title` | TEXT NOT NULL | |
| `subtitle` | TEXT | nullable |
| `price` | REAL NOT NULL | |
| `currency` | TEXT DEFAULT `€` | |
| `location` | TEXT NOT NULL | |
| `images` | TEXT DEFAULT `'[]'` | JSON array of URLs or image objects |
| `specs` | TEXT DEFAULT `'{}'` | JSON object of arbitrary specs |
| `is_featured` | INTEGER DEFAULT `0` | boolean flag |
| `dealer_id` | TEXT | nullable |
| `created_at` | TEXT DEFAULT `datetime('now')` | |

---

## 5. Application Entry (`src/server.ts`)

- Loads `.env` (via `db.ts` import side-effect).
- Enforces `JWT_SECRET` presence.
- Applies global middleware:
  - `cors({ origin: CLIENT_URL, credentials: true })`
  - `express.json({ limit: "50mb" })`
  - Static serving of `/uploads` from `process.cwd()/uploads`
- Mounts routers:
  - `GET /api/health` — liveness check
  - `/api/auth` → `authRouter`
  - `/api/email` → `emailRouter`
  - `/api/payment` → `paymentRouter`
  - `/api/upload` → `uploadRouter`
  - `/api/listings` → `listingsRouter`
- Fallback `404` JSON handler for unknown routes.

---

## 6. Middleware

### `src/middleware/auth.ts` — `authenticate`
Verifies the `Authorization: Bearer <token>` header using `JWT_SECRET`. On success it attaches `req.user = { id, email }` and calls `next()`. Returns `401` for missing/invalid/expired tokens, `500` if `JWT_SECRET` is unconfigured. The `AuthPayload` type extends Express' `Request` globally.

### `src/middleware/rateLimit.ts`
Three `express-rate-limit` instances:
- `authLimiter` — 20 requests / 15 min (login & register)
- `emailLimiter` — 10 requests / 60 min
- `paymentLimiter` — 30 requests / 60 min

---

## 7. API Routes

All routes are prefixed with `/api`. Responses follow a `{ success, message, ...data }` shape.

### 7.1 Auth (`/api/auth`)
| Method | Route | Auth | Rate | Description |
|---|---|---|---|---|
| POST | `/register` | – | auth | Create account, returns JWT |
| POST | `/login` | – | auth | Email/password login, returns JWT |
| POST | `/google` | – | – | Social login; auto-creates user if email unknown |
| GET | `/users` | ✔ | – | List all users (id, name, email, created_at) |

**Register payload:** `full_name`, `email`, `password` (≥8 chars), `confirmPassword`. Hashes password with bcrypt (cost 12). Returns `201` with token + user.

**Login payload:** `email`, `password`. Compares with bcrypt, returns token + user on success (`401` otherwise).

**Google payload:** `email`, `full_name`, `googleId`. If the email is new, a placeholder bcrypt password is stored; the user is created and a JWT is issued.

### 7.2 Listings (`/api/listings`)
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | – | All listings; supports `?limit=&page=` |
| GET | `/featured` | – | Listings where `is_featured = 1`; supports `?limit=&page=` |
| GET | `/type/:type` | – | Filter by `car`/`estate`/`bike`/`yacht`/`jet`; supports `?limit=&page=` |
| GET | `/brands/:type` | – | Unique derived brands for a type |
| GET | `/:id` | – | Single listing (`:id` may be `l<number>` or numeric) |
| POST | `/` | ✔ | Create a listing |

**Create payload:** `type`, `title`, `price`, `location`, `specs` (required); `subtitle`, `currency` (default `€`), `images`, `isFeatured`, `dealerId` optional. `images` and `specs` are JSON-stringified into the DB.

**Listing formatting (`formatListing`):** Normalizes DB rows into the client shape:
- `id` → string `l<id>`
- `brand` → derived via `deriveBrand` from a built-in `BRAND_PATTERNS` dictionary per type (falls back to first word of title)
- `images` → parsed from JSON; string URLs are mapped into `{ src, alt, width, height, format, loading }` objects via `deriveAlt`
- `isFeatured` from `is_featured` boolean
- `specs` parsed from JSON

### 7.3 Upload (`/api/upload`)
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/image` | – | Accepts a base64 `data:` URL, decodes to file, returns URL + publicId |
| POST | `/asset` | – | Multipart upload (`multer`, field name `image`) |

**Constraints:** Only `image/*` MIME types; max file size **10 MB**. Filenames are randomized (`asset_<timestamp>_<random>.<ext>`). Files saved to `uploads/` and served statically. The public URL uses `PUBLIC_URL` or the request host.

### 7.4 Email (`/api/email`)
| Method | Route | Auth | Rate | Description |
|---|---|---|---|---|
| POST | `/send` | ✔ | email | Send an email via nodemailer SMTP |

**Payload:** `to`, `subject`, `html`. Validates email format, trims/limits input lengths, and strips dangerous tags (`<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`) via `sanitizeHtml`. Requires SMTP env vars or returns `503`. nodemailer is imported lazily.

### 7.5 Payment (`/api/payment`) — PayPal Sandbox
| Method | Route | Rate | Description |
|---|---|---|---|
| POST | `/create` | payment | Create a PayPal order, returns `orderId` + `status` |
| POST | `/capture` | payment | Capture a previously created order |

Uses PayPal's sandbox endpoints (`api-m.sandbox.paypal.com`). Obtains a client-credentials access token, then creates/captures an order with `intent: CAPTURE`. Requires `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` or returns `503`.

---

## 8. Authentication Flow

1. Client calls `/api/auth/register` or `/api/auth/login` (or `/google`).
2. Server validates, then issues a JWT signed with `JWT_SECRET` (7-day expiry) containing `{ id, email }`.
3. Client stores the token and sends it as `Authorization: Bearer <token>` on protected routes.
4. `authenticate` middleware verifies the token and populates `req.user`.

Protected routes: `GET /api/auth/users`, `POST /api/listings`, `POST /api/email/send`.

---

## 9. Scripts (`package.json`)

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `tsx src/server.ts` | Run in development (TS, no build) |
| `npm run build` | `esbuild ... --outfile=dist/server.cjs` | Bundle to CJS (keeps `better-sqlite3` external) |
| `npm start` | `node dist/server.cjs` | Run production build |
| `npm run clean` | removes `dist/` | Clean build artifacts |

**Dependencies:** `bcryptjs`, `better-sqlite3`, `cors`, `dotenv`, `express`, `express-rate-limit`, `google-auth-library`, `jsonwebtoken`, `multer`, `nodemailer`.

---

## 10. Security Notes & Observations

- **Secrets in `.env`:** The repo's `.env` contains live-ish credentials (PayPal, SMTP, Google service account private key, JWT secret). These should be rotated and excluded from version control (use `.env.example` only).
- **`/api/auth/users`** returns all users to any authenticated user — consider admin-only scoping.
- **Google auth** trusts the client-supplied `email`/`full_name`/`googleId` without verifying a Google ID token server-side (`google-auth-library` is installed but unused in routes). A malicious client could impersonate any email.
- **Upload routes** are unauthenticated; consider gating `/upload/asset` and `/upload/image` behind `authenticate` to prevent abuse.
- Email HTML is only loosely sanitized (dangerous tags commented out, not fully stripped/escaped).
- `PAYPAL_CLIENT_ID`/`SECRET` are read per-request but never persisted; payments are not stored in the database.
