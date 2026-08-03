# Testing Guide

A structured QA pass covering every area called out in the project spec: authentication, CRUD
operations, image upload, reservations, reviews, contact forms, performance, SEO, responsive
design, and accessibility. Work through this after any deployment or significant change.

---

## 1. Authentication

| Test | Steps | Expected |
|---|---|---|
| Login | Admin panel -> enter valid superadmin credentials | Redirected to Dashboard, name shown in Topbar |
| Invalid login | Enter wrong password 5+ times | Account temporarily locked (423 response), clear error message |
| Forgot password | Login page -> Forgot password -> submit email | Dev mode: reset link shown inline; Prod: email received via configured SMTP |
| Reset password | Follow reset link -> set new password | Redirected to login, new password works |
| Session persistence | Log in -> refresh the page | Still logged in (silent refresh via httpOnly cookie) |
| Idle auto-logout | Leave tab inactive past the idle timeout (see `admin/src/hooks/useIdleTimer.js`) | Redirected to `/login` |
| Role gating | Log in as a `manager` or `staff` account | Sidebar hides Users/Settings/Audit Logs; visiting `/users` directly redirects away |
| Logout | Click Logout | Redirected to login; back button doesn't restore the session |

## 2. CRUD Operations

For **every** module (Menu, Categories, Branches, Gallery, Offers, FAQs, Careers, Users):
1. **Create** a new record with all fields filled -- confirm it appears in the list immediately.
2. **Read** -- confirm the list/table shows accurate data, pagination works if >1 page.
3. **Update** -- edit a record, confirm changes persist after a page refresh.
4. **Delete** -- delete a record, confirm a confirmation dialog appears first, and the record
   is gone after confirming.
5. **Validation** -- submit a form with a required field empty; confirm a clear inline error
   appears and the request is not sent.

Cross-check every create/update/delete against the **customer website** to confirm the change
is reflected there (e.g. a new menu item appears on `/menu` within a page refresh).

## 3. Image Upload

| Test | Steps | Expected |
|---|---|---|
| Valid upload | Upload a .jpg/.png/.webp under 5MB to a Menu Item | Preview appears, saves successfully, image loads on the customer site |
| Oversized file | Upload a file over the configured size limit | Clear error, upload rejected |
| Wrong file type | Try uploading a .txt or .exe renamed to .jpg | Rejected by both the file input's `accept` filter and the backend's mimetype validation |
| Multi-image | Upload 3+ images to a Menu Item or Gallery entry | All appear, can be individually removed |
| Image removal | Remove one image from a multi-image item | Only that image is deleted from Cloudinary and the record |

## 4. Reservations

| Test | Steps | Expected |
|---|---|---|
| Submit (customer site) | Fill out `/reservation` with a future date/time | Success screen shown; confirmation email logged/sent |
| Admin sees it | Admin panel -> Reservations | New reservation appears with status "pending" |
| Confirm | Admin clicks Confirm | Status -> "confirmed"; status-change email logged/sent |
| Cancel | Admin clicks Cancel | Status -> "cancelled"; status-change email logged/sent |
| Calendar view | Switch to Calendar view, click a day with bookings | Modal shows that day's reservations |
| Past-date guard | Try selecting a date before today on the customer form | Date picker prevents it (`min` attribute) |

## 5. Reviews

| Test | Steps | Expected |
|---|---|---|
| Submit (customer site) | `/reviews` -> Write a Review -> submit | Success message; review does NOT appear publicly yet |
| Moderate | Admin panel -> Reviews -> Approve | Review now appears on the public Reviews page |
| Reject | Submit another review -> Reject in admin | Review never appears publicly |
| Feature | Approve + star a review | Appears in the homepage Testimonials carousel |
| Reply | Admin adds a reply | Reply visible on the public review card |
| Google reviews | Reviews page -> Google Reviews tab (branch with Place ID + API key configured) | Live rating and reviews load, clearly labeled as Google, separate from website reviews |

## 6. Contact Forms

| Test | Steps | Expected |
|---|---|---|
| Submit | `/contact` -> fill and submit | Success screen; message appears in admin Contact Messages as "new" |
| Reply | Admin -> open message -> Reply via Email | Email sent (or logged) to the sender, status -> "resolved" |
| Status update | Change status manually | Persists, reflected in list filters |
| CSV export | Contact Messages -> Export CSV | File downloads with correct columns |
| Newsletter signup | Footer/homepage newsletter form -> submit email | Success toast; welcome email logged/sent; subscriber appears in admin |

## 7. Performance

Run [Lighthouse](https://developer.chrome.com/docs/lighthouse/) (Chrome DevTools -> Lighthouse,
or `npx lighthouse <url> --view`) against the **production build** (not `npm run dev`) of the
customer site:
```bash
cd client && npm run build && npm run preview
npx lighthouse http://localhost:4173 --view
```
Target scores: 95+ across Performance, Accessibility, Best Practices, and SEO. If a score is
short:
- **Performance**: check image sizes (Cloudinary already serves optimized/responsive
  transforms via the URL params in `config/cloudinary.js`), confirm lazy-loading attributes
  are present on below-the-fold images, check bundle size with `npm run build` output.
- **Accessibility**: run axe DevTools browser extension for a detailed breakdown; see Section 10.
- **SEO**: confirm every page has a unique title/description via the `<SEO>` component, and
  that `robots.txt`/sitemap are reachable.

## 8. SEO Verification

- [ ] View source (or DevTools -> Elements) on `/`, `/menu`, `/branches`, `/reviews` -- confirm
      `<title>`, meta description, canonical link, and `<script type="application/ld+json">`
      blocks are present and populated with real data (not placeholders).
- [ ] Paste each page's URL into
      [Google's Rich Results Test](https://search.google.com/test/rich-results) -- confirm the
      Restaurant/LocalBusiness/FAQ/Review schema validates with no errors.
- [ ] Visit `/robots.txt` and `<api-url>/api/v1/sitemap.xml` directly -- confirm both return
      valid content (not 404).
- [ ] Confirm Open Graph tags render correctly by pasting a page URL into
      [Meta's Sharing Debugger](https://developers.facebook.com/tools/debug/) or
      [Twitter Card Validator].

## 9. Responsive Design

Test at minimum these breakpoints (Chrome DevTools device toolbar, or real devices):
- Mobile: 375px (iPhone SE), 390px (iPhone 12/13)
- Tablet: 768px (iPad)
- Desktop: 1280px, 1920px

For each: confirm the Navbar collapses to the mobile drawer below `lg` breakpoint, no
horizontal scroll/overflow anywhere, tap targets are reasonably sized (buttons/links not
cramped), and images/text remain readable without zooming.

## 10. Accessibility

- [ ] **Keyboard-only navigation**: unplug your mouse (or just don't use it) and Tab through an
      entire page -- every interactive element (nav links, buttons, form fields, the mobile
      menu toggle) should be reachable and show a visible focus ring.
- [ ] **Skip link**: on any page, press Tab once immediately after load -- a "Skip to main
      content" link should appear and jump focus past the Navbar when activated.
- [ ] **Screen reader spot-check**: use VoiceOver (Mac, Cmd+F5) or NVDA (Windows, free) to read
      through the homepage -- confirm images have meaningful alt text, buttons announce their
      purpose (not just "button"), and form fields announce their labels.
- [ ] **Color contrast**: run axe DevTools or Lighthouse's Accessibility audit -- resolve any
      contrast failures flagged.
- [ ] **Forms**: confirm every input has an associated `<label>` (via `htmlFor`/`id`), and
      validation errors are announced (they use `role`/text adjacent to the field already).

---

## Automated testing note

This project does not currently include an automated test suite (Jest/Vitest/Playwright/
Cypress) -- the above is a manual QA checklist. For a team maintaining this long-term, the
highest-value first additions would be:
1. Backend: integration tests per route using `supertest` + an in-memory MongoDB
   (`mongodb-memory-server`), starting with auth and the most-used CRUD routes.
2. Frontend: component tests for forms (Reservation, Contact, Review) with React Testing
   Library, and a handful of Playwright end-to-end smoke tests covering the critical paths
   listed in Sections 4-6 above.
