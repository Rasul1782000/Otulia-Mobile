# API Test Report — Otulia Mobile

**Date:** 2026-06-17
**Base URL:** `http://localhost:5001`
**Framework:** Express.js + TypeScript (tsx) + better-sqlite3
**Total Tests:** 67 | **Passed:** 67 | **Failed:** 0

---

## Test Results by Endpoint

### 1. Health & Diagnostics (2/2 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `GET` | `/api/health` | 200 | Basic health check |
| `GET` | `/api/cloudinary/health` | 200 | Cloudinary connection ping |

### 2. Auth: Register (7/7 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `POST` | `/api/auth/register` | 400 | Missing fields → validation error |
| `POST` | `/api/auth/register` | 400 | Missing full_name → validation error |
| `POST` | `/api/auth/register` | 400 | Missing password → validation error |
| `POST` | `/api/auth/register` | 400 | Password < 8 chars → validation error |
| `POST` | `/api/auth/register` | 400 | Password mismatch → validation error |
| `POST` | `/api/auth/register` | 201 | Valid registration → token + user |
| `POST` | `/api/auth/register` | 409 | Duplicate email → conflict error |

### 3. Auth: Login (5/5 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `POST` | `/api/auth/login` | 400 | Missing fields → validation error |
| `POST` | `/api/auth/login` | 400 | Missing password → validation error |
| `POST` | `/api/auth/login` | 401 | Wrong password → unauthorized |
| `POST` | `/api/auth/login` | 401 | Non-existent user → unauthorized |
| `POST` | `/api/auth/login` | 200 | Valid credentials → token + user |

### 4. Auth: Google OAuth (4/4 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `POST` | `/api/auth/google` | 400 | Empty email → validation error |
| `POST` | `/api/auth/google` | 400 | Missing name → validation error |
| `POST` | `/api/auth/google` | 200 | New Google user → creates account |
| `POST` | `/api/auth/google` | 200 | Existing Google user → returns token |

### 5. Auth: Users (3/3 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `GET` | `/api/auth/users` | 401 | No token → authentication required |
| `GET` | `/api/auth/users` | 401 | Invalid token → authentication required |
| `GET` | `/api/auth/users` | 200 | Valid token → returns user list |

### 6. Listings: Read (8/8 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `GET` | `/api/listings` | 200 | All listings with Cloudinary images |
| `GET` | `/api/listings/featured` | 200 | Featured listings only |
| `GET` | `/api/listings/type/car` | 200 | Filter by car type |
| `GET` | `/api/listings/type/estate` | 200 | Filter by estate type |
| `GET` | `/api/listings/type/bike` | 200 | Filter by bike type (empty) |
| `GET` | `/api/listings/type/yacht` | 200 | Filter by yacht type (empty) |
| `GET` | `/api/listings/type/jet` | 200 | Filter by jet type (empty) |
| `GET` | `/api/listings/type/airplane` | 400 | Invalid type → validation error |

### 7. Listings: Brands (6/6 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `GET` | `/api/listings/brands/car` | 200 | Brands for car listings |
| `GET` | `/api/listings/brands/estate` | 200 | Brands for estate listings |
| `GET` | `/api/listings/brands/bike` | 200 | Brands for bike listings |
| `GET` | `/api/listings/brands/yacht` | 200 | Brands for yacht listings |
| `GET` | `/api/listings/brands/jet` | 200 | Brands for jet listings |
| `GET` | `/api/listings/brands/airplane` | 400 | Invalid type → validation error |

### 8. Listings: Single (4/4 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `GET` | `/api/listings/1` | 200 | Numeric ID → listing found |
| `GET` | `/api/listings/l1` | 200 | Prefixed ID → listing found |
| `GET` | `/api/listings/99999` | 404 | Non-existent ID → not found |
| `GET` | `/api/listings/abc` | 404 | Non-numeric ID → not found |

### 9. Listings: Create (4/4 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `POST` | `/api/listings` | 401 | No token → authentication required |
| `POST` | `/api/listings` | 401 | Invalid token → authentication required |
| `POST` | `/api/listings` | 400 | Missing required fields → validation error |
| `POST` | `/api/listings` | 201 | Valid listing → created with Cloudinary sync |

### 10. Listings: Sync (2/2 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `POST` | `/api/listings/sync` | 401 | No token → authentication required |
| `POST` | `/api/listings/sync` | 200 | Valid token → synced N/N listings |

### 11. Listings: Cloudinary (2/2 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `GET` | `/api/listings/cloudinary` | 200 | All Cloudinary resources grouped by folder |
| `GET` | `/api/listings/cloudinary/listings` | 200 | Resources by prefix |

### 12. Email (6/6 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `POST` | `/api/email/send` | 401 | No token → authentication required |
| `POST` | `/api/email/send` | 401 | Invalid token → authentication required |
| `POST` | `/api/email/send` | 400 | Missing fields → validation error |
| `POST` | `/api/email/send` | 400 | Invalid email format → validation error |
| `POST` | `/api/email/send` | 400 | Empty subject → validation error |
| `POST` | `/api/email/send` | 200 | Valid email → sent successfully |

### 13. Payment (8/8 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `POST` | `/api/payment/create` | 400 | No amount → validation error |
| `POST` | `/api/payment/create` | 400 | Negative amount → validation error |
| `POST` | `/api/payment/create` | 400 | Zero amount → validation error |
| `POST` | `/api/payment/create` | 400 | String amount → validation error |
| `POST` | `/api/payment/create` | 200 | Valid amount → order created |
| `POST` | `/api/payment/capture` | 400 | No orderId → validation error |
| `POST` | `/api/payment/capture` | 400 | Empty orderId → validation error |
| `POST` | `/api/payment/capture` | 502 | Fake orderId → PayPal error returned |

### 14. Upload (2/2 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `POST` | `/api/upload/image` | 400 | Missing image data → validation error |
| `POST` | `/api/upload/image` | 500 | Invalid image → Cloudinary rejects |

### 15. Edge Cases & 404 (4/4 passed)

| Method | Path | Status | Description |
|--------|------|--------|-------------|
| `GET` | `/api/nonexistent` | 404 | JSON 404 response (not HTML) |
| `POST` | `/api/nonexistent` | 404 | JSON 404 response (not HTML) |
| `GET` | `/api/auth/nonexistent` | 404 | JSON 404 response |
| `GET` | `/api/listings/nonexistent` | 404 | JSON 404 response |

### 16. Rate Limiting

| Metric | Value |
|--------|-------|
| Rate limit policy | 20 requests / 15 minutes |
| Rate limit remaining (after test) | 7 |
| Returns 429 when exceeded | Confirmed |

---

## Security Checklist

| Check | Status |
|-------|--------|
| JWT auth on protected routes | Working (401 without token) |
| Invalid JWT rejected | Working (401 for bad token) |
| Rate limiting on auth endpoints | Working (429 when exceeded) |
| Rate limiting on email | Working |
| Rate limiting on payment | Working |
| Custom 404 returns JSON | Working (no HTML leaks) |
| Input validation on all POST routes | Working |
| Email address format validation | Working |
| Payment amount validation | Working |
| Email HTML sanitization | Active |

---

## Files Modified

| File | Changes |
|------|---------|
| `backend/src/middleware/auth.ts` | **New** — JWT verification middleware |
| `backend/src/middleware/rateLimit.ts` | **New** — Rate limiters for auth/email/payment |
| `backend/src/server.ts` | Custom 404 JSON handler |
| `backend/src/routes/auth.ts` | Auth middleware on `/users`, rate limiter on register/login |
| `backend/src/routes/email.ts` | Auth + rate limiter, email validation, HTML sanitization |
| `backend/src/routes/payment.ts` | Rate limiter, amount validation, proper error handling |
| `backend/src/routes/listings.ts` | Auth middleware on create/sync, 404 for non-numeric IDs |
