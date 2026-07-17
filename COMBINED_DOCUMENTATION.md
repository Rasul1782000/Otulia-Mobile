# Otulia — Full-Stack Documentation

> **Otulia** is a luxury marketplace mobile application for buying/selling cars, real estate, bikes, yachts, and private jets. This document covers both the **React Native / Expo frontend** and the **Node/Express/SQLite backend**, and how they integrate.

---

# PART A — BACKEND (`/backend`)

## A.1 Overview

- **Language:** TypeScript (ESM, `"type": "module"`)
- **Runtime:** Node.js (dev via `tsx`, prod bundled with `esbuild` → `dist/server.cjs`)
- **Framework:** Express 4
- **Database:** SQLite via `better-sqlite3` (file `otulia.db`, WAL mode)
- **Auth:** JWT (HS256, 7-day expiry) in `Authorization: Bearer` header
- **Default port:** `5001`

## A.2 Project Structure

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

## A.3 Environment Variables (`.env`)

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

## A.4 Database Schema (`src/db.ts`)

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

## A.5 Application Entry (`src/server.ts`)

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

## A.6 Middleware

### `src/middleware/auth.ts` — `authenticate`
Verifies the `Authorization: Bearer <token>` header using `JWT_SECRET`. On success it attaches `req.user = { id, email }` and calls `next()`. Returns `401` for missing/invalid/expired tokens, `500` if `JWT_SECRET` is unconfigured. The `AuthPayload` type extends Express' `Request` globally.

### `src/middleware/rateLimit.ts`
Three `express-rate-limit` instances:
- `authLimiter` — 20 requests / 15 min (login & register)
- `emailLimiter` — 10 requests / 60 min
- `paymentLimiter` — 30 requests / 60 min

## A.7 API Routes

All routes are prefixed with `/api`. Responses follow a `{ success, message, ...data }` shape.

### A.7.1 Auth (`/api/auth`)
| Method | Route | Auth | Rate | Description |
|---|---|---|---|---|
| POST | `/register` | – | auth | Create account, returns JWT |
| POST | `/login` | – | auth | Email/password login, returns JWT |
| POST | `/google` | – | – | Social login; auto-creates user if email unknown |
| GET | `/users` | ✔ | – | List all users (id, name, email, created_at) |

**Register payload:** `full_name`, `email`, `password` (≥8 chars), `confirmPassword`. Hashes password with bcrypt (cost 12). Returns `201` with token + user.

**Login payload:** `email`, `password`. Compares with bcrypt, returns token + user on success (`401` otherwise).

**Google payload:** `email`, `full_name`, `googleId`. If the email is new, a placeholder bcrypt password is stored; the user is created and a JWT is issued.

### A.7.2 Listings (`/api/listings`)
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

### A.7.3 Upload (`/api/upload`)
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/image` | – | Accepts a base64 `data:` URL, decodes to file, returns URL + publicId |
| POST | `/asset` | – | Multipart upload (`multer`, field name `image`) |

**Constraints:** Only `image/*` MIME types; max file size **10 MB**. Filenames are randomized (`asset_<timestamp>_<random>.<ext>`). Files saved to `uploads/` and served statically. The public URL uses `PUBLIC_URL` or the request host.

### A.7.4 Email (`/api/email`)
| Method | Route | Auth | Rate | Description |
|---|---|---|---|---|
| POST | `/send` | ✔ | email | Send an email via nodemailer SMTP |

**Payload:** `to`, `subject`, `html`. Validates email format, trims/limits input lengths, and strips dangerous tags (`<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`) via `sanitizeHtml`. Requires SMTP env vars or returns `503`. nodemailer is imported lazily.

### A.7.5 Payment (`/api/payment`) — PayPal Sandbox
| Method | Route | Rate | Description |
|---|---|---|---|
| POST | `/create` | payment | Create a PayPal order, returns `orderId` + `status` |
| POST | `/capture` | payment | Capture a previously created order |

Uses PayPal's sandbox endpoints (`api-m.sandbox.paypal.com`). Obtains a client-credentials access token, then creates/captures an order with `intent: CAPTURE`. Requires `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` or returns `503`.

## A.8 Authentication Flow

1. Client calls `/api/auth/register` or `/api/auth/login` (or `/google`).
2. Server validates, then issues a JWT signed with `JWT_SECRET` (7-day expiry) containing `{ id, email }`.
3. Client stores the token and sends it as `Authorization: Bearer <token>` on protected routes.
4. `authenticate` middleware verifies the token and populates `req.user`.

Protected routes: `GET /api/auth/users`, `POST /api/listings`, `POST /api/email/send`.

## A.9 Backend Scripts (`package.json`)

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `tsx src/server.ts` | Run in development (TS, no build) |
| `npm run build` | `esbuild ... --outfile=dist/server.cjs` | Bundle to CJS (keeps `better-sqlite3` external) |
| `npm start` | `node dist/server.cjs` | Run production build |
| `npm run clean` | removes `dist/` | Clean build artifacts |

**Dependencies:** `bcryptjs`, `better-sqlite3`, `cors`, `dotenv`, `express`, `express-rate-limit`, `google-auth-library`, `jsonwebtoken`, `multer`, `nodemailer`.

---

# PART B — FRONTEND (`/frontend`)

## B.1 Overview

- **Framework:** React Native (via Expo) **and** web (via Vite + `react-native-web`)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) + `twrnc` (Tailwind-in-React-Native) + `clsx`/`tailwind-merge`
- **State:** Local React state (`useState`/`useEffect`); global auth token held in `lib/api.ts` module memory; theme via React Context
- **Icons:** `lucide-react` (web) + `lucide-react-native` (native), `react-native-svg`
- **Animation:** `motion` (installed)
- **Navigation:** Custom view-state switcher in `App.tsx` (no React Navigation); bottom tab bar `BottomNav.tsx`
- **Platforms:** iOS, Android, Web (Expo dev client + Vite build)

## B.2 Project Structure

```
frontend/
├── package.json            # Dependencies & scripts
├── app.config.js           # Expo config (reads .env, injects VITE_/EXPO_PUBLIC_ vars)
├── vite.config.ts          # Vite + proxy /api → backend:5001, RN-web aliases
├── eas.json               # EAS Build profiles (development/preview/production)
├── tsconfig.json
├── .env / .env.example     # Frontend env (backend URLs, social IDs, WhatsApp)
├── index.html / index.js / main.tsx
├── theme.tsx              # ThemeProvider + gold/dark/light color palette
├── types.ts               # Shared TS types (ViewState, Listing, User, Message, Category)
├── data.ts                # Static category list (cars, estate, yacht, jet)
├── App.tsx                # Root: view-state machine, fade transitions, BottomNav
├── components/
│   ├── BottomNav.tsx        # 5-tab nav + center "Sell" FAB
│   ├── FilterPanel.tsx      # Pill-dropdown filters per category
│   ├── ListingCard.tsx      # (present)
│   ├── OptimizedImage.tsx   # Image loader w/ placeholder + queue
│   └── ImageGalleryModal.tsx# Fullscreen gallery (FlatList)
├── lib/
│   ├── api.ts               # Fetch wrapper, all backend calls, token storage
│   ├── images.ts            # Image URL resolvers (mostly passthrough)
│   ├── imageQueue.ts        # Concurrent image prefetch queue + localStorage cache
│   ├── whatsapp.ts          # openWhatsApp() deep link helper
│   └── utils.ts             # cn() class-name merge utility
└── views/
    ├── AuthView.tsx         # Sign in / Sign up + Google/Facebook/Apple buttons
    ├── HomeView.tsx         # Hero, collections, featured/estate/car sections
    ├── ExploreView.tsx      # Category tabs, filters, paginated listings
    ├── DetailView.tsx       # Listing detail, gallery, contact actions
    ├── AddListingView.tsx   # 4-step listing creation wizard (mock submit)
    ├── InboxView.tsx        # Empty-state messages screen
    ├── ProfileView.tsx      # User profile, settings link, member registry
    └── SettingsView.tsx     # Account/preferences/support settings
```

## B.3 Environment Variables (`.env`)

| Variable | Purpose |
|---|---|
| `VITE_BACKEND_URL` / `EXPO_PUBLIC_BACKEND_URL` | Base URL of backend API (default `http://10.0.2.2:5001` — Android emulator loopback) |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number used by `openWhatsApp()` |
| `VITE_GOOGLE_CLIENT_ID` | Google client ID (checked before Google login) |
| `VITE_APPLE_CLIENT_ID` / `VITE_FACEBOOK_APP_ID` | Reserved for social login (not yet wired) |
| `VITE_PAYPAL_CLIENT_ID` / `VITE_GA_PROPERTY_ID` | Reserved (payments handled server-side) |

`app.config.js` exposes only `VITE_*`/`EXPO_PUBLIC_*` vars to the Expo bundle; `vite.config.ts` injects all `.env` vars as `process.env.*` and `import.meta.env.*` defines, plus proxies `/api` → `http://127.0.0.1:5001`.

## B.4 Shared Types (`types.ts`)

- **`ViewState`**: `'auth' | 'home' | 'explore' | 'detail' | 'inbox' | 'profile' | 'add-listing' | 'settings'`
- **`Listing`**: `id, type ('car'|'estate'|'bike'|'yacht'|'jet'), title, subtitle?, brand, price, currency, location, images: ListingImage[], specs: Record<string,string>, isFeatured?, dealerId?`
- **`ListingImage`**: `{ src, alt, width, height, format, loading }`
- **`User`**, **`Message`**, **`Category`**: profile, inbox, and home-category models

## B.5 Application Architecture (`App.tsx`)

`App` wraps everything in `<ThemeProvider>`. `AppContent` holds:
- `currentView` (the active screen — a simple state machine, not a router)
- `currentUser` (set on successful login/register)
- `selectedListing` (passed into `DetailView`)
- `exploreType` (default category for Explore)

`handleViewChange` plays a cross-fade (`Animated` opacity 1→0→1) when switching views. `renderView()` switches on `currentView`. `BottomNav` is always rendered (hidden on `auth`).

## B.6 Views (Screens)

### B.6.1 `AuthView.tsx`
- Tabs: **Sign In** / **Sign Up**.
- Validates name, email, password (≥8), confirm match.
- Calls `login()` / `register()` from `lib/api.ts`; on success stores token via `setAuthToken()` and user via `onLoginSuccess`, then navigates to `home`.
- Social buttons: **Google** (real — calls `googleLogin()`), **Apple** / **Facebook** (stubbed: show "coming soon" if client ID configured).
- Google payload: `{ email, full_name, googleId: 'google_' + Date.now() }`.

### B.6.2 `HomeView.tsx`
- Header (logo, menu → settings, bell → inbox).
- Hero text + horizontal category carousel (`data.ts` categories).
- Search bar (non-functional input) + filter button.
- **"Collections"** horizontal category cards → `explore`.
- Sections: **Featured** (`getFeaturedListings`), **Real Estates** (`getListingsByType('estate')`), **Cars** (`getListingsByType('car')`), each limited to `HOME_SECTION_LIMIT = 3`, loaded in parallel via `Promise.all`.
- Each listing rendered as a tappable card → `onListingClick` → `detail`.

### B.6.3 `ExploreView.tsx`
- Header image changes per category; subheadline text per type.
- Category tabs: All/Cars/Real Estate/Yachts/Bikes (note: no Jet tab here; Jet reachable via Home category card).
- Loads `getListingsByType(activeTab)` + `getBrandsByType(activeTab)` on tab change.
- **Filtering (client-side):** search query (title/location/brand), brand, price range, plus type-specific spec filters (car: year, fuel, mileage; estate: type, beds, baths; bike: type; yacht: type, length). Sort: Newest / Low→High / High→Low.
- **Pagination:** "Load more" appends next page (`page` state, `PAGE_SIZE = 5`).
- Filter UI built from `FilterPanel` (pill dropdowns).

### B.6.4 `DetailView.tsx`
- Hero image + thumbnail strip (first 4 images) → opens `ImageGalleryModal`.
- Title, location, price, featured badge.
- Action row: **Book Drive / Schedule**, **Call**, **Chat** (→ inbox), **WhatsApp** (`openWhatsApp`).
- Tabs: Overview / Specs or Details / Features / Gallery / Location.
- Specs grid from `listing.specs`; dealer card; sticky bottom bar with **Offer** / **Buy Now** (alert only).
- `ImageGalleryModal` provides swipeable fullscreen gallery.

### B.6.5 `AddListingView.tsx`
- 4-step wizard: Basic Info → Location & Price → Images → Review.
- Step guard `canProceed()`; review summary.
- **Note:** submit is **mocked** — `handleSubmit` just waits 4s and shows success; it does **not** call `createListing()` or the upload API.

### B.6.6 `InboxView.tsx`
- Empty-state inbox with tabs (All/Unread/Starred/Archive). No backend integration yet.

### B.6.7 `ProfileView.tsx`
- Profile header (avatar, name, Platinum Member badge), stats (static 0s).
- Sections: Marketplace Activity, Preferences & Security (some → settings/inbox/whatsapp).
- **Member Registry**: calls `getUsers()` (protected) and lists all registered users (id, name, email, created_at).
- Logout clears `currentUser` and returns to `auth`.

### B.6.8 `SettingsView.tsx`
- Account / Preferences / Support sections.
- **Dark Appearance** toggle wired to `toggleTheme()` (ThemeProvider).
- Other items currently show `Alert` placeholders; WhatsApp → `openWhatsApp`.

## B.7 Components

- **`BottomNav.tsx`**: 5 tabs (Home, Explore, Sell FAB, Inbox, Profile). Hidden on `auth`. "Sell" FAB → `add-listing`.
- **`FilterPanel.tsx`**: `FilterState` shape + `EMPTY_FILTERS`. `PillDropdown` reusable selector. Per-type option sets (years, fuels, mileage, estate types, price ranges, bike/yacht/jet types & ranges). Renders active-filter chips with "Clear All".
- **`OptimizedImage.tsx`**: Wrapper over RN `Image` with placeholder, blur, lazy `onLayout`-triggered load via `imageQueue.enqueueImage`, priority-based sizing, error fallback.
- **`ImageGalleryModal.tsx`**: Fullscreen `Modal` + `FlatList` (paging) gallery with counter and dots.

## B.8 Lib Utilities

- **`api.ts`**: Central HTTP client.
  - `getBaseUrl()` resolves backend URL (Vite `process.env` → Expo `EXPO_PUBLIC_*` → `import.meta.env` → `window.__env__` → default `http://10.0.2.2:5001`).
  - Token stored in module-level `authToken`; `setAuthToken`/`getAuthToken`; `getHeaders()` attaches `Authorization: Bearer`.
  - `get/post` with verbose logging (redacts passwords) and network/CORS error messages.
  - Exports: `getHealth`, `register`, `login`, `googleLogin`, `getUsers`, `sendEmail`, `createPayPalOrder`, `capturePayPalOrder`, `uploadImage`, `uploadAssetImage` (FormData multipart), `getListings`, `getFeaturedListings`, `getListingsByType`, `getBrandsByType`, `getListingById`, `createListing`, `request`, and an `apiClient` object aggregating all.
- **`images.ts`**: URL resolvers (`getOptimizedListingImage`, `getThumbnailUrl`, `getGalleryImageUrl`, `getHeroImageUrl`, `getCategoryImageUrl`, `getBlurPlaceholderUrl`). Currently mostly **pass-through** (no real image CDN/transformation).
- **`imageQueue.ts`**: Concurrent (max 6) image prefetch queue with priority (`high`/`normal`/`low`), retry w/ backoff, and `localStorage` cache (`otulia_img_cache`, last 200).
- **`whatsapp.ts`**: `openWhatsApp(message?, phone?)` builds `https://wa.me/<number>?text=...` and opens via `Linking`.
- **`utils.ts`**: `cn()` = `twMerge(clsx(...))`.

## B.9 Theme (`theme.tsx`)

`ThemeProvider` (default **dark**) + `useTheme()` exposing `{ theme, toggleTheme, isDark }`. Palette `colors` includes brand `gold: '#b18b24'`, `goldLight`, and full `dark`/`light` surface/background/text/border scales.

## B.10 Frontend Scripts (`package.json`)

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite` | Web dev server (proxies `/api` → backend) |
| `npm start` | `npx expo start` | Expo dev server (native/Expo Go) |
| `npm run android` | `npx expo start --android` | Run on Android |
| `npm run build` | `vite build` | Production web build → `dist/` |
| `npm run preview` | `vite preview` | Preview the web build |
| `npm run lint` | `tsc --noEmit` | Type-check |

**Key dependencies:** `expo`, `@expo/cli`, `react` (19.2.3), `react-native` (0.85.3), `react-native-web`, `react-native-svg`, `lucide-react` / `lucide-react-native`, `motion`, `twrnc`, `clsx`, `tailwind-merge`, `@google/genai`. Dev: `vite`, `@tailwindcss/vite`, `tailwindcss` v4, `typescript`.

---

# PART C — INTEGRATION (Frontend ↔ Backend)

## C.1 Connection
- Frontend talks to backend over **HTTP fetch** via `lib/api.ts`.
- Base URL default `http://10.0.2.2:5001` (Android emulator → host). For web dev, Vite proxies `/api` → `http://127.0.0.1:5001`.
- Auth token set after login/register and attached as `Bearer` on every request.

## C.2 Endpoint Mapping

| Frontend call | Backend route | Notes |
|---|---|---|
| `getHealth()` | `GET /api/health` | |
| `register(body)` | `POST /api/auth/register` | |
| `login(body)` | `POST /api/auth/login` | |
| `googleLogin(body)` | `POST /api/auth/google` | Client-built payload |
| `getUsers()` | `GET /api/auth/users` | **Protected** (Bearer) — used in ProfileView registry |
| `sendEmail(body)` | `POST /api/email/send` | **Protected** |
| `createPayPalOrder` / `capturePayPalOrder` | `POST /api/payment/{create,capture}` | Rate-limited |
| `uploadImage` / `uploadAssetImage` | `POST /api/upload/{image,asset}` | Multipart uses field `image` |
| `getListings` | `GET /api/listings?limit=` | |
| `getFeaturedListings` | `GET /api/listings/featured?limit=` | |
| `getListingsByType` | `GET /api/listings/type/:type?limit=&page=` | |
| `getBrandsByType` | `GET /api/listings/brands/:type` | |
| `getListingById` | `GET /api/listings/:id` | |
| `createListing` | `POST /api/listings` | **Protected** — defined but **not called** by AddListingView (mocked) |

## C.3 Auth Mapping
- Backend issues `token` + `user { id, full_name, email }`.
- Frontend constructs its own `User` object: `{ id: String(id), name: full_name, email, avatar: '', isVerified: true, type: 'buyer' }`.
- Token persisted only in memory (`lib/api.ts` module variable) — **lost on app reload**.

## C.4 Data Flow Example (Browse → Detail)
1. `HomeView` mounts → parallel `getFeaturedListings`, `getListingsByType('estate')`, `getListingsByType('car')`.
2. Backend returns `listings` (formatted with derived `brand`, `images`, `specs`).
3. User taps card → `onListingClick(listing)` sets `selectedListing` and switches to `detail`.
4. `DetailView` renders from the already-loaded `Listing` object (no refetch).

---

# PART D — SECURITY & QUALITY NOTES

## D.1 Backend
- **Secrets in `.env`**: live PayPal, SMTP, Google service-account private key, and JWT secret are committed in the repo's `.env`. These should be rotated and excluded from version control (use `.env.example` only).
- **`/api/auth/users`** returns all users to any authenticated user — consider admin-only scoping.
- **Google auth** (`/api/auth/google`) trusts the client-supplied `email`/`full_name`/`googleId` without verifying a Google ID token server-side (`google-auth-library` is installed but unused in routes). A malicious client could impersonate any email.
- **Upload routes** are unauthenticated; consider gating `/upload/asset` and `/upload/image` behind `authenticate` to prevent abuse.
- Email HTML is only loosely sanitized (dangerous tags commented out, not fully stripped/escaped).
- Payments are not persisted; PayPal orders are created/captured on demand.

## D.2 Frontend
- **Token not persisted** — logout on app restart; no refresh strategy.
- **`AddListingView` submit is mocked** — never calls `createListing`/upload APIs, so created listings do not reach the backend.
- **`InboxView` is static** — no real messaging backend.
- **Apple/Facebook login are stubs** (alert only).
- **`lib/images.ts` resolvers are passthrough** — no real resizing/CDN; `OptimizedImage` sizing is cosmetic.
- **`VITE_WHATSAPP_NUMBER=0000000000`** in `.env` → WhatsApp links will be non-functional until set.
- Image queue relies on `navigator.product === 'ReactNative'` detection; on web it uses the browser `Image` API.

## D.3 Cross-cutting
- Frontend default backend URL `10.0.2.2:5001` only works on Android emulators; **physical devices / iOS** need the machine's LAN IP or a tunnel.
- CORS is locked to `CLIENT_URL` (default `localhost:5173`) — native apps are unaffected, but web preview from another origin will be blocked unless `CLIENT_URL` is updated.
- The repo mixes **Expo native** and **Vite web** toolchains; `vite.config.ts` aliases `react-native` → `react-native-web` and stubs `codegenNativeComponent` for web builds.
