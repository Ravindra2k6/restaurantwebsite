# Admin Panel User Manual

A practical, module-by-module guide for restaurant staff using the admin panel day to day. For
initial setup/deployment, see [`DEPLOYMENT.md`](./DEPLOYMENT.md) instead.

---

## Logging In

Go to your admin panel URL (e.g. `https://admin.yourrestaurant.com`) and sign in with the email
and password given to you. Forgot your password? Click "Forgot password?" on the login screen
and follow the emailed link.

**Roles**: your account is one of four levels, which controls what you can see and do:
- **Staff** -- day-to-day operational access (toggle menu availability, manage reservations,
  view messages)
- **Manager** -- staff access plus creating/editing menu items, branches, offers, and content
- **Admin** -- manager access plus staff account management, site settings, and audit logs
- **Superadmin** -- full access, including deleting other admin accounts

If a menu item in this manual isn't visible in your sidebar, it's because your role doesn't
have access to it -- ask an Admin/Superadmin if you believe you need it.

---

## Dashboard

Your homepage after login. Shows at a glance: visitor counts, menu/branch/reservation/review
totals, a visitor trend chart, a reservation status chart, and your most recent reservations
and pending reviews. Use the **Quick Actions** buttons to jump straight to adding a menu item,
branch, offer, or gallery photo.

## Menu Items

**Add a dish**: Menu -> Add Menu Item. Fill in the name, description, choose a category and
food type (Veg/Non-Veg/Egg), then choose pricing:
- **Flat Price** for a single price (most dishes)
- **Half/Full Variants** for items like biryani sold at two sizes

Upload up to 5 photos, and toggle any badges that apply (Available, Popular, Chef Recommended,
Today's Special). Popular and Chef Recommended items automatically appear in their matching
homepage sections -- no extra step needed.

**Quickly mark something sold out**: in the Menu table, click the Available toggle directly --
no need to open the edit form. This is the fastest way to "86" an item during service.

**Search & filter**: use the search box and Category/Food Type dropdowns above the table to
find items quickly, especially once your menu grows past a page.

## Categories

Categories organize the menu (Starters, Biryanis, Desserts, etc.) and power the filter buttons
on the public Menu page. You can't delete a category that still has menu items in it -- move or
delete those items first.

## Branches

Each branch needs: name, full address, phone, opening hours (set per day -- mark a day
"Closed" if you don't operate that day), facilities (comma-separated, e.g. "AC, Parking,
Rooftop"), and at least one photo. The **Google Place ID** field (optional) is what powers the
live Google rating shown on the Reviews page for that branch -- find it via
[Google's Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).

## Gallery

Upload photos in batches (select multiple files at once), tag each batch with a category
(Food, Ambience, Events, Staff, Awards) and optionally a specific branch. Star an image to mark
it "Featured" -- featured images show up in the homepage gallery preview.

## Reviews

Two tabs' worth of content live here:
- **Website Reviews**: guests submit these directly on your site. New ones start as
  "pending" -- **you must Approve them before they show up publicly.** Reject anything spammy
  or inappropriate. Star a review to feature it prominently on the homepage. You can also post
  a public reply underneath any review.
- **Google Rating card** (top of page): shows your live Google rating and latest Google
  reviews, pulled directly from Google -- these are separate from website reviews and can't be
  moderated here (manage them via your Google Business Profile directly).

## Reservations

New bookings arrive as "pending." Review the details and click **Confirm** (sends the guest a
confirmation email) or **Cancel** if you can't accommodate it. Mark **Completed** after the
guest has dined. Switch to **Calendar view** for a day-by-day overview -- click any day with
bookings to see the full list for that date.

## Contact Messages

Incoming messages start as "new." Open one to read the full message and either:
- **Reply via Email** -- type a response, which emails the guest directly and marks the message
  "resolved," or
- Change the status manually (in-progress, resolved, spam) if you're handling it outside the
  system.

Use **Export CSV** to download the full message list for record-keeping or import elsewhere.

## Offers & Coupons

Create percentage or flat-amount discounts, optionally tied to a coupon code guests enter at
checkout (external to this system) or that you reference verbally/in-store. Set an expiry date
-- offers automatically show as "Expired" once that date passes (they aren't deleted
automatically, so clean up old ones periodically). Toggle "Festive Offer" for seasonal
promotions you want to visually highlight.

## FAQs

Simple question/answer pairs shown in an accordion on the homepage and wherever else FAQs
appear. Use "Display Order" to control the sequence (lower numbers show first).

## Careers

Post open positions (Careers -> Post Job) with department, employment type, and a description.
Applicants apply directly on the public site with a resume upload. Review applications under
**View Applications** on each job, download resumes, and update each applicant's status
(Received -> Reviewing -> Shortlisted -> Hired/Rejected) as you progress them.

## Staff & Roles *(Admin/Superadmin only)*

Add new staff/admin accounts here (Users -> Add Staff Account), assigning a role and optionally
a specific branch. Deactivate an account (toggle "Account Active" off) rather than deleting it
if someone leaves temporarily -- deactivated accounts can't log in but keep their history intact.

## SEO *(Admin/Superadmin only)*

Set your site's default title, meta description, and keywords (used as a fallback for pages
that don't set their own), your Google Business Profile write-a-review link, and your Google
Analytics / Meta Pixel IDs -- once saved here, analytics activates on the public site
automatically, no code changes needed.

## Homepage *(Admin/Superadmin only)*

Edit the hero headline, background video URL, tagline, restaurant story text, and site logo.
Everything else on the homepage (Today's Special, Featured Dishes, Reviews, Gallery, Branches,
Offers, FAQs) pulls automatically from those respective modules -- this page includes direct
links to each one.

## Settings *(Admin/Superadmin only)*

Restaurant name, logo/favicon, contact phone/email/WhatsApp, social media links, currency, and
theme mode (light/dark/auto default for new visitors, plus a manual festive theme toggle).

## Analytics

Visitor trends, reservation breakdowns by status and branch, and your most popular menu items
(by price, as a proxy pending true view-count data). For deeper page-level insight, connect
Google Analytics via the SEO page above.

## Reports

Export Reservation, Customer (newsletter subscriber), or Menu data as CSV, Excel, or PDF for
record-keeping, accounting handoff, or marketing use.

## Notifications

A live feed of everything currently awaiting your attention: pending reservations, new contact
messages, and pending reviews -- click any item to jump straight to it.

## Audit Logs *(Admin/Superadmin only)*

A record of who did what and when across the system -- every login, create, update, delete, and
status change by any staff account. Filter by entity type or action. Useful for accountability
and for investigating "who changed this?" questions.

## My Profile

Update your own avatar and password. Do this immediately after your account is first created if
you were given a temporary password.

---

## Tips for Day-to-Day Use

- **Dark mode**: toggle via the sun/moon icon in the top bar -- your preference is remembered.
- **Mobile**: the admin panel works on phones/tablets (the sidebar becomes a slide-out menu),
  handy for checking reservations or replying to messages on the go.
- **When in doubt about a delete**: every delete action asks for confirmation first -- there's
  no "undo" after that, so double-check before confirming.
