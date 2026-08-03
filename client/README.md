# Restaurant Website — Frontend (Phase 2)

Customer-facing website for **Bhojanams & Biryanis**, built with React 19, Vite, Tailwind CSS,
React Router, Framer Motion, React Icons, and Axios — fully wired to the Phase 1 backend API.
No dummy data: every page fetches live from the backend.

---

## 1. Prerequisites

- Node.js 18+
- The **Phase 1 backend running** (see `../server/README.md`) — this frontend has nothing to
  render without it, since every page pulls real data from the API.

---

## 2. Setup

```bash
cd restaurant-website/client
npm install
cp .env.example .env
```

`.env` defaults to pointing at the backend on `http://localhost:5000/api/v1` — adjust
`VITE_API_BASE_URL` if your backend runs elsewhere.

---

## 3. Run

```bash
npm run dev
```

Vite will start on **http://localhost:5173** and open it automatically.

> **Make sure the backend is seeded first** (`npm run seed` in `../server`) — otherwise pages
> like Menu, Branches, and the homepage sections will correctly show their "nothing here yet"
> empty states rather than errors, since there's simply no data to display.

---

## 4. Test it

Walk through each page and confirm it's pulling real data:

| Page | URL | What to check |
|---|---|---|
| Home | `/` | Hero loads, Today's Special / Featured Dishes / Chef Picks show seeded menu items, Branches preview shows the seeded branch, FAQ accordion expands |
| About | `/about` | Story, mission/vision cards, chef profile, awards render |
| Menu | `/menu` | Search a dish (e.g. "biryani"), filter by Veg/Non-Veg, filter by category, confirm pagination if >12 results |
| Branches | `/branches` | Seeded "Madhapur" branch card shows address, phone, hours, Get Directions/Call/WhatsApp buttons work |
| Gallery | `/gallery` | If no gallery items are seeded yet, add one via the backend API (`POST /api/v1/gallery` as admin) and confirm it appears with lightbox on click |
| Offers | `/offers` | Add a test offer via the backend as admin, confirm it shows with a copyable coupon code |
| Reviews | `/reviews` | Submit a review via the "Write a Review" button — note it won't appear publicly until approved via the backend's moderation endpoint (`PATCH /api/v1/reviews/:id/moderate`) |
| Reservation | `/reservation` | Fill out and submit — should show a success confirmation screen |
| Careers | `/careers` | Add a job via the backend as admin, confirm it lists and the apply form accepts a resume upload |
| Contact | `/contact` | Submit the form, confirm success state; map renders using the seeded branch coordinates |
| Privacy / Terms | `/privacy`, `/terms` | Static legal content renders |
| 404 | any unknown URL, e.g. `/xyz` | Custom 404 page with links back to Home/Menu |

### Quick end-to-end smoke test
1. Start the backend (`npm run dev` in `../server`), confirm `/api/v1/health` responds.
2. Seed it (`npm run seed` in `../server`).
3. Start this frontend (`npm run dev`).
4. Visit `http://localhost:5173` — you should see the Bhojanams & Biryanis hero, seeded dishes,
   and the Madhapur branch card, all pulled live from MongoDB through the API.
5. Open browser DevTools → Network tab and confirm requests are hitting
   `http://localhost:5000/api/v1/...` and returning `200` responses.

### Build for production
```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally to sanity-check it
```

---

## 5. What's implemented in Phase 2

- **13 fully functional pages**, each connected to the backend: Home, About, Menu, Branches,
  Gallery, Offers, Reviews, Reservation, Careers, Contact, Privacy, Terms, 404.
- **Services layer**: one Axios-based service module per backend resource, sharing a single
  configured Axios instance with normalized error handling.
- **Reusable component library**: Navbar (sticky, animated mobile menu), Footer, Hero (video
  background), SectionHeading, MenuItemCard, BranchCard, skeleton loaders, error states, SEO
  component, toast notifications, floating WhatsApp button, and more — no duplicated markup
  across pages.
- **Design**: premium gold/charcoal palette, glassmorphism accents, Framer Motion scroll/hover
  animations, fully responsive from mobile to desktop.
- **Forms**: Reservation, Contact, Write a Review, and Job Application — all with client-side
  validation, loading states, and success/error feedback via the toast system.
- **SEO**: `react-helmet-async` on every page for dynamic titles/meta descriptions, canonical
  URLs, Open Graph, Twitter Cards, and JSON-LD structured data on the homepage.
- **Performance**: every page is code-split via `React.lazy` + `Suspense`, images are
  lazy-loaded, and Vite's build splits vendor chunks for better caching.
- **Accessibility**: semantic landmarks, skip-to-content link, visible focus rings, `aria-label`s
  on icon-only buttons, keyboard-operable mobile menu and lightbox.
- **Live Google Reviews**: the Reviews page fetches Google rating/reviews per branch through the
  backend's Places API integration — separate from website reviews, exactly as specified.

## 6. Known Phase-2 boundaries (intentional — Phase 3 connects these)

- No admin UI yet — all content (menu items, branches, offers, gallery, jobs) must currently be
  managed via direct API calls (see `../server/API_DOCS.md`) until the Phase 3 admin panel exists.
- Newsletter subscription and review submission are one-way (submit only) from this site; viewing
  subscriber lists or moderating reviews happens in the Phase 3 admin panel.
- PWA/offline support and push notifications are part of the "Extra Professional Features" scope
  and are intentionally deferred to a later phase.

---

## Project structure

```
client/
├── public/               robots.txt, favicon
├── src/
│   ├── assets/            images/videos/logos (add your own restaurant media here)
│   ├── components/         one folder per component area (Navbar, Hero, Menu cards, etc.)
│   ├── context/            SettingsContext (site config), ToastContext (notifications)
│   ├── hooks/              useFetch, useDebounce, useScrolled, useOnClickOutside
│   ├── layouts/            MainLayout (Navbar + Footer + Outlet)
│   ├── pages/              one folder per route
│   ├── routes/             AppRoutes.jsx (lazy-loaded route definitions)
│   ├── services/           one Axios service module per backend resource
│   ├── styles/             global Tailwind entry + custom utility classes
│   ├── utils/              constants, formatters, link builders
│   ├── App.jsx             provider composition + router
│   └── main.jsx            React 19 entry point
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

Next: **Phase 3 — Admin Panel**, giving staff a UI to manage everything this site displays.
