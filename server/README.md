# Restaurant Website — Backend (Phase 1)

Production-ready REST API for a multi-branch restaurant website with an admin panel.
Node.js + Express + MongoDB (Mongoose) + JWT auth + Cloudinary image storage.

Full endpoint reference: **[API_DOCS.md](./API_DOCS.md)**

---

## 1. Prerequisites

- Node.js 18+
- A MongoDB instance — either:
  - Local: `mongod` running on `mongodb://127.0.0.1:27017`, or
  - Free cloud: a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free [Cloudinary](https://cloudinary.com) account (for image uploads — the API will start without it, but any upload route will fail until it's configured)
- Optional: a Google Cloud project with the **Places API (New)** enabled, if you want to test the live Google Reviews endpoint

---

## 2. Setup

```bash
cd restaurant-website/server
npm install
cp .env.example .env
```

Open `.env` and fill in at minimum:

```
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_website
JWT_SECRET=<any long random string>
JWT_REFRESH_SECRET=<a different long random string>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Generate strong random secrets quickly with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## 3. Seed the database (recommended for testing)

This creates a superadmin account plus realistic sample data (one branch, 15 categories, ~35 menu items, FAQs, and site settings) so you have something to query immediately instead of an empty database.

```bash
npm run seed
```

You should see output ending in `Seed complete!`. The superadmin login is whatever you set in `.env` under `ADMIN_EMAIL` / `ADMIN_PASSWORD` (defaults to `admin@restaurant.com` / `ChangeThisPassword123!` — **change this before deploying anywhere real**).

To wipe the seeded data later:

```bash
npm run seed:destroy
```

---

## 4. Run the server

```bash
npm run dev      # nodemon, auto-restarts on file changes
# or
npm start        # plain node, for production-like runs
```

You should see:

```
MongoDB Connected: 127.0.0.1/restaurant_website
Server running in development mode on port 5000
API base path: /api/v1
```

---

## 5. Test it

### Quick smoke test
```bash
curl http://localhost:5000/api/v1/health
```
Expect `{"success":true,"message":"API is healthy", ...}`.

### Public read endpoints (no auth needed)
```bash
curl http://localhost:5000/api/v1/branches
curl http://localhost:5000/api/v1/categories
curl "http://localhost:5000/api/v1/menu?foodType=non-veg&limit=5"
curl http://localhost:5000/api/v1/faqs
curl http://localhost:5000/api/v1/settings
```

### Log in as the seeded superadmin
```bash
curl -i -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"ChangeThisPassword123!"}'
```
Copy the `accessToken` from the JSON body (or use `-c cookies.txt -b cookies.txt` with curl to persist the httpOnly cookie automatically).

### Create something as admin (example: a new category)
```bash
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer <accessToken>" \
  -F "name=Chef Specials" \
  -F "type=mixed"
```

### Create a menu item with images
```bash
curl -X POST http://localhost:5000/api/v1/menu \
  -H "Authorization: Bearer <accessToken>" \
  -F "name=Hyderabadi Chicken Biryani" \
  -F "category=<a category _id from /categories>" \
  -F "foodType=non-veg" \
  -F "price=350" \
  -F "images=@/path/to/photo.jpg"
```

### Submit a public reservation
```bash
curl -X POST http://localhost:5000/api/v1/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Rao",
    "phone": "9876543210",
    "branch": "<a branch _id from /branches>",
    "partySize": 4,
    "reservationDate": "2026-08-01",
    "reservationTime": "19:30"
  }'
```

### Check the admin dashboard
```bash
curl http://localhost:5000/api/v1/dashboard/summary \
  -H "Authorization: Bearer <accessToken>"
```

### Import into Postman / Insomnia
Every route in `API_DOCS.md` maps 1:1 to `{{baseUrl}}/api/v1/<path>`. Set `baseUrl = http://localhost:5000`, add an `Authorization: Bearer {{accessToken}}` header as an environment variable, and you can hand-build a collection quickly — or just hit the curl examples above directly.

---

## 6. What's implemented in Phase 1

- **Auth:** JWT access + refresh tokens (httpOnly cookies or Bearer header), role-based access control (`superadmin > admin > manager > staff`), bcrypt password hashing, account lockout after repeated failed logins, password reset flow.
- **Full CRUD APIs:** Menu Items, Categories, Branches (with geospatial "nearby" search), Gallery, Website Reviews (moderation workflow), Reservations, Contact Messages, Offers/Coupons, FAQs, Users/Staff, Careers (jobs + applications), Newsletter, Site Settings (singleton for homepage/SEO/social/currency).
- **Google Business Profile integration:** live-fetched via the official Places API using each branch's `googlePlaceId` — never scraped, never persisted, kept fully separate from the website's own `Review` collection.
- **Image uploads:** Cloudinary via Multer, scoped per feature (menu/branches/gallery/avatars/etc.), with cleanup of old images on update/delete.
- **Admin dashboard:** aggregated counts (visitors, branches, reviews, menu/gallery counts, reservations, contact requests, newsletter subscribers) plus a visitor trend endpoint.
- **Security:** Helmet, CORS with credential support, rate limiting (global + strict auth limiter + public-write limiter), MongoDB query sanitization, HTTP parameter pollution protection, centralized error handling, environment-variable validation on boot.
- **Validation:** express-validator on every write endpoint with a consistent 422 error shape.
- **Seed script:** realistic sample data based on a real multi-category Indian restaurant menu, so Phase 2 (frontend) has real content to render from day one.

## 7. Known Phase-1 boundaries (intentional — will connect in later phases)

- Email/SMS sending is stubbed with `// TODO (production)` comments in `authController`, `reservationController`, and `contactController` — plug in a provider (SendGrid, Twilio, etc.) when ready.
- The Google Reviews endpoint requires `GOOGLE_PLACES_API_KEY` in `.env` (not included in `.env.example` by default, since it's optional for local dev) and a branch's `googlePlaceId` field populated.
- File-serving for the frontend, sitemap.xml/robots.txt generation, and SSR-based SEO tags belong to the client (Phase 2) and SEO layer (Phase 4).

---

## Project structure

```
server/
├── config/          db.js, cloudinary.js
├── controllers/      business logic per resource
├── data/             seedData.js (sample content)
├── middleware/        auth, error handling, rate limiting, uploads, validation
├── models/           Mongoose schemas
├── routes/           Express routers per resource + index.js aggregator
├── uploads/           (empty — Cloudinary handles storage; kept for local fallback use)
├── utils/             ApiError, ApiResponse, asyncHandler, token helpers, handlerFactory, seeder
├── validators/         express-validator rule sets
├── app.js             Express app wiring (security, routes, error handling)
├── server.js          process entrypoint, DB connect, graceful shutdown
├── .env.example
├── API_DOCS.md
└── package.json
```

Next: **Phase 2 — React 19 + Vite + Tailwind frontend**, wired to this API and rendering the seeded menu/branch data.
