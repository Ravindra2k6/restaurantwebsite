# Bhojanams & Biryanis -- Restaurant Website & Management System

A production-grade, enterprise-level restaurant website and management platform, built across
four phases: a REST API backend, a customer-facing website, an admin panel, and a final
optimization/hardening pass covering SEO, security, performance, PWA, analytics, email, and
multi-language support.

```
restaurant-website/
├── server/     Phase 1 -- Node.js/Express/MongoDB REST API
├── client/     Phase 2 -- React 19 customer-facing website
├── admin/      Phase 3 -- React 19 admin panel
└── docs/       Phase 4 -- deployment, testing, maintenance & user documentation
```

Each app has its own `README.md` with setup/run/test instructions specific to it. This file is
the map of the whole system.

---

## Quick Start (all three apps, local development)

```bash
# 1. Backend
cd server
npm install
cp .env.example .env        # fill in MONGO_URI, JWT secrets, Cloudinary keys (see server/README.md)
npm run seed                # creates a superadmin + sample Bhojanams & Biryanis content
npm run dev                 # http://localhost:5000

# 2. Customer website (new terminal)
cd client
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173

# 3. Admin panel (new terminal)
cd admin
npm install
cp .env.example .env
npm run dev                 # http://localhost:5174
```

Log into the admin panel with the credentials from `server/.env` (`ADMIN_EMAIL` /
`ADMIN_PASSWORD`), then browse the customer site to see the same live data.

---

## What's in each phase

| Phase | Folder | Summary |
|---|---|---|
| 1 -- Backend | `server/` | JWT auth with RBAC, full CRUD REST API for every restaurant entity, Cloudinary image uploads, Google Business Profile review integration, security middleware, seeded sample data. See `server/README.md` and `server/API_DOCS.md`. |
| 2 -- Customer Website | `client/` | 13 fully API-connected pages, premium responsive design, Framer Motion animation, SEO-ready structure, no dummy data. See `client/README.md`. |
| 3 -- Admin Panel | `admin/` | Enterprise dashboard, full management UI for every backend resource, role-based access, dark mode, charts, reports. See `admin/README.md`. |
| 4 -- Production Hardening | (all three, plus `docs/`) | Structured data / schema.org, dynamic sitemap, PWA, GA4/Meta Pixel, transactional email, audit logging, global search, multi-language (EN/Telugu/Hindi), and this documentation set. See below. |

---

## Phase 4 additions at a glance

**Backend (`server/`)**
- Real audit logging (`AuditLog` model + `logActivity()` utility) wired into auth, users, menu,
  branches, reviews, settings, reservations, and contact controllers
- Transactional email system (nodemailer + 5 branded HTML templates) wired into reservation
  confirmations/status changes, contact replies, newsletter welcome, and staff onboarding --
  gracefully logs to console instead of failing when SMTP isn't configured
- Dynamic XML sitemap generator (`GET /api/v1/sitemap.xml`) built from live branches,
  categories, menu items, and job listings
- Global search endpoint (`GET /api/v1/search?q=`) across menu, branches, and gallery
- XSS input sanitization middleware, hardened Content-Security-Policy via Helmet
- **Bug fix**: CORS previously only allowed the customer site's origin, which would have
  silently blocked the admin panel (different port) in production -- now both are allowed

**Customer Website (`client/`)**
- Full Schema.org structured data library (Organization, Restaurant, LocalBusiness,
  Breadcrumb, FAQ, Review, Menu) wired into Home, Menu, Branches, and Reviews with real data
- PWA support: manifest, icons, hand-written service worker (installable, offline app shell)
- GA4 + Meta Pixel, dynamically driven by admin-configured settings (no redeploy needed)
- Global search with live autocomplete
- Multi-language framework (English/Telugu/Hindi) with a persisted language switcher

**Admin Panel (`admin/`)**
- Audit Logs page rewired from a Phase 3 best-effort placeholder to the real backend endpoint,
  with filters and pagination, plus a proper sidebar entry and superadmin/admin route gating

**Documentation (`docs/`)**
- [`DEPLOYMENT.md`](./docs/DEPLOYMENT.md) -- full production deployment guide
- [`TESTING.md`](./docs/TESTING.md) -- QA checklist covering auth, CRUD, uploads, forms,
  performance, SEO, accessibility, responsiveness
- [`MAINTENANCE.md`](./docs/MAINTENANCE.md) -- backups, updates, monitoring, secret rotation
- [`ADMIN_MANUAL.md`](./docs/ADMIN_MANUAL.md) -- how-to guide for admin panel staff
- [`OWNER_GUIDE.md`](./docs/OWNER_GUIDE.md) -- non-technical guide for the restaurant owner
- [`TROUBLESHOOTING.md`](./docs/TROUBLESHOOTING.md) -- common issues and fixes
- [`PROJECT_STRUCTURE.md`](./docs/PROJECT_STRUCTURE.md) -- full file tree across all three apps

---

## Honest scope notes (carried through from every phase)

This project consolidates a few spec items into existing modules rather than building
duplicate parallel systems, and is upfront about a couple of things that need real
infrastructure (a mail provider, a production database) to fully light up:

- **Events** are handled via the Offers module's `isFestive` flag rather than a separate model.
- **Testimonials** are Reviews with `isFeatured: true` rather than a separate model.
- **Revenue reporting** has no backing data yet -- there's no order/billing model in this
  system. The Reports module's export format is ready to receive that data once ordering
  exists.
- **Email** works out of the box in development (logs to console) but needs real SMTP
  credentials in `server/.env` to actually send mail in production -- see
  [`DEPLOYMENT.md`](./docs/DEPLOYMENT.md).
- **Multi-language** covers navigation and common UI strings as a working pattern (EN/Telugu/
  Hindi); menu items, reviews, and other database content stay in whatever language staff
  enter them in, since translating user-generated content would need per-locale fields on the
  backend models.

Every one of these is a deliberate, documented decision -- not a silently dropped feature.

---

## License & Ownership

This codebase was generated for the named restaurant client project. Replace this section with
your actual licensing terms before distributing or reselling.
