# Restaurant Website — Admin Panel (Phase 3)

Enterprise-style admin panel for **Bhojanams & Biryanis**, built with React 19, Vite, Tailwind
CSS, React Router, Axios, Framer Motion, React Hook Form, React Icons, and Chart.js — fully
wired to the Phase 1 backend.

---

## 1. Prerequisites

- Node.js 18+
- The **Phase 1 backend running and seeded** (`../server`) — this panel manages that data, so
  nothing will work without it.
- At least one superadmin account (created by the backend's `npm run seed`).

---

## 2. Setup

```bash
cd restaurant-website/admin
npm install
cp .env.example .env
```

`.env` defaults to `http://localhost:5000/api/v1`. Adjust `VITE_API_BASE_URL` if your backend
runs elsewhere.

---

## 3. Run

```bash
npm run dev
```

Opens on **http://localhost:5174** (separate from the customer site's 5173, so both can run
simultaneously).

---

## 4. Log in

Use the superadmin credentials from the backend's `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`,
defaults to `admin@restaurant.com` / `ChangeThisPassword123!` unless you changed them before
seeding).

If you forget: use "Forgot password?" on the login screen. Since no email provider is
configured in Phase 1, the backend returns the reset token directly in the API response when
`NODE_ENV=development` — the Forgot Password page surfaces it as a clickable link automatically
so you can test the full flow without setting up email.

---

## 5. Test & verify — a walkthrough of every module

Work through these in order; each builds content the next one can display.

1. **Login** — sign in, confirm the sidebar and dashboard load. Try an idle timeout by leaving
   the tab inactive for 30+ minutes (or temporarily lower `timeoutMs` in
   `src/hooks/useIdleTimer.js` for a quick test) — you should be redirected to `/login`.
2. **Categories** (`/categories`) — create 2-3 categories (or confirm the seeded ones from
   Phase 1 appear). Edit one, confirm the change persists after refresh.
3. **Menu** (`/menu`) — add a dish with a flat price and one with Half/Full variants, upload
   images, mark it Popular. Toggle availability directly from the table. Search and filter by
   category/food type.
4. **Branches** (`/branches`) — add or edit a branch: address, opening hours per day, facilities,
   images + banner. If you set a Google Place ID, verify it later in Reviews.
5. **Gallery** (`/gallery`) — upload a batch of images, filter by category, mark one Featured,
   delete one.
6. **Reviews** (`/reviews`) — approve/reject a review submitted from the public site (Phase 2),
   mark one Featured, add an admin reply. If a branch has a Google Place ID and the backend has
   `GOOGLE_PLACES_API_KEY` set, confirm the Google Rating card loads live data (otherwise it
   shows a clear "not configured" message rather than failing silently).
7. **Reservations** (`/reservations`) — confirm/cancel/complete a reservation submitted from the
   public site. Switch to Calendar view and click a day with bookings to see the day's detail.
8. **Contact** (`/contact`) — view a submitted message, update its status, export the list to
   CSV, and try "Reply via Email" (opens your mail client).
9. **Offers** (`/offers`) — create a percentage-off offer with a coupon code and an expiry date;
   confirm it shows "Active" then edit the expiry to a past date and confirm it flips to
   "Expired".
10. **FAQs** (`/faqs`) — add/edit/delete an FAQ.
11. **Careers** (`/careers`) — post a job, then (from the Phase 2 public site) submit a test
    application with a resume upload, then come back here and view/update its status.
12. **Users & Roles** (`/users`, superadmin/admin only) — create a manager account, log out,
    log back in as that manager, and confirm the sidebar hides Users/Settings for that role.
13. **SEO** (`/seo`) — set a default meta title/description and Google Analytics ID; confirm it
    saves.
14. **Homepage** (`/homepage`) — set a hero headline and restaurant story; confirm the linked
    "Manage" shortcuts route correctly to Menu/Reviews/Gallery/Branches/Offers/FAQs.
15. **Settings** (`/settings`) — update site name, contact info, social links, currency, and
    theme; confirm the logo/favicon upload works.
16. **Analytics** (`/analytics`) — confirm charts render (they'll be sparse until the public
    site has real traffic and more reservations/reviews exist).
17. **Reports** (`/reports`) — switch between Reservation/Customer/Menu reports, export each as
    CSV, Excel, and PDF (the PDF export opens your browser's print dialog — choose "Save as PDF").
18. **Notifications** (`/notifications`) — confirm it lists any pending reservations, new
    contact messages, and pending reviews as a live "needs attention" feed.
19. **Audit Logs** (`/audit-logs`) — read the in-app note explaining this is a best-effort view
    (see Section 7 below) rather than a true audit trail.
20. **Profile** (`/profile`) — upload an avatar, change your password, log out, log back in with
    the new password.
21. **Dark mode** — toggle the sun/moon icon in the top bar; confirm it persists across a page
    refresh.
22. **Mobile responsiveness** — shrink the browser window or use DevTools device mode; confirm
    the sidebar collapses into an animated drawer.

---

## 6. What's implemented in Phase 3

- **Auth**: JWT login with silent token refresh (via httpOnly cookie) on 401, forgot/reset
  password, remember-me checkbox, idle-timeout auto-logout, role-based route protection
  (superadmin > admin > manager > staff), role-filtered sidebar navigation.
- **Full CRUD management** for: Menu Items (flat/variant pricing, images, badges, availability
  toggle), Categories, Branches (hours, geolocation, facilities, images/banner), Gallery
  (multi-upload, featured flag), Reviews (approve/reject/feature/reply + live Google rating),
  Reservations (status workflow + calendar view), Contact Messages (status + CSV export),
  Offers/Coupons (with expiry logic), FAQs, Careers (jobs + applications + resume review),
  Staff/Roles (superadmin/admin only).
- **Content management**: SEO defaults, Homepage hero/story content (with live links to the
  content-driven sections managed elsewhere), Settings (business info, social links, currency,
  theme).
- **Dashboard**: 12 KPI cards, visitor trend line chart, reservation doughnut chart, quick
  actions, recent activity feeds.
- **Analytics**: visitor trend, reservation status/branch breakdowns, review rating
  distribution, popular menu items.
- **Reports**: reservation/customer/menu reports, exportable as CSV, Excel-compatible CSV, and
  PDF (via print).
- **Notifications**: a live, derived "needs attention" feed from pending reservations/messages/
  reviews.
- **Design**: dark/light mode (persisted), glassmorphism touches, Framer Motion transitions,
  fully responsive sidebar/drawer, professional data tables with search/filter/pagination
  everywhere they're needed, reusable form inputs wired for React Hook Form.

## 7. Known Phase-3 boundaries (intentional -- flagged honestly rather than faked)

- **Audit Logs**: the backend has no AuditLog model recording "who changed what, when." The
  Audit Logs page says so plainly and shows the closest real signal (recently updated
  reservations/reviews) instead of fabricating log entries. To build this properly: add an
  AuditLog model plus a shared middleware wrapping mutating routes in the backend.
- **Notifications**: there's no backend Notification model or email/push delivery service.
  The Notifications page derives a live in-app feed from existing pending-state records, which
  is genuinely useful but is not the same as push/email alerts -- see the TODO (production)
  comments already left in the Phase 1 controllers for where to wire in a provider.
- **Revenue reporting**: flagged as "future ready" in the spec -- there's no order/billing model
  in Phase 1, so no real revenue figures exist yet to report on. The Reports page's export
  format is ready to receive that data once an ordering system is added.
- **"Most Viewed Pages"**: the backend's Visit model does record a page path per visit, but no
  aggregation endpoint exposes a per-path ranking yet (only totals + daily trend). Noted
  directly on the Analytics page with the specific endpoint that would unlock it.
- **Excel/PDF export**: implemented as CSV-with-Excel-MIME-type and browser-print-to-PDF
  respectively, rather than pulling in xlsx/jspdf purely for this. Both produce genuinely
  usable files; swap in those libraries later if native .xlsx/.pdf binaries are required.
- **"Remember me"**: the checkbox is present on login, but the backend issues a fixed-length
  refresh token cookie (30 days) regardless -- there's no variable-expiry session support in
  Phase 1 to hook it up to yet.
- **Events**: consolidated into Offers (isFestive flag) rather than a separate module, since
  the backend has no distinct Events model -- this was a deliberate scope merge, documented here
  rather than silently dropped.

---

## Project structure

```
admin/
├── src/
│   ├── components/         Sidebar, Topbar, DataTable, Charts, Modals, Inputs, etc. (all reusable)
│   ├── context/             AuthContext, ThemeContext
│   ├── hooks/               useFetch, useDebounce, useClickOutside, useIdleTimer
│   ├── layouts/              AdminLayout (Sidebar + Topbar + Outlet)
│   ├── pages/                one folder per module (Dashboard, Menu, Branches, ...)
│   ├── routes/               AppRoutes.jsx (public + role-protected, lazy-loaded)
│   ├── services/             one Axios service module per backend resource
│   ├── styles/                global Tailwind entry with dark-mode utility classes
│   ├── utils/                 constants, formatters, exportUtils
│   ├── App.jsx                provider composition + router + toast host
│   └── main.jsx                React 19 entry point
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

This completes the three-phase build: **Phase 1** (backend API), **Phase 2** (customer-facing
website), **Phase 3** (this admin panel) -- all three run independently and talk to the same
backend, giving you a full working restaurant website plus management system end to end.
