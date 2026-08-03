# Restaurant Owner Guide

A plain-language guide to what this system does for your business, written for the owner or
manager, not the technical team. For step-by-step admin panel instructions, see
[`ADMIN_MANUAL.md`](./ADMIN_MANUAL.md).

---

## What You Now Have

Three connected pieces working together:

1. **Your website** -- what customers see: your menu, branch locations, photos, reviews, offers,
   and a way to reserve a table or contact you, all from any device.
2. **Your admin panel** -- a private dashboard only your staff can access, where you control
   everything on the website: add dishes, update hours, respond to reviews, manage bookings.
3. **The engine behind both** -- a secure database and image storage system that keeps
   everything in sync automatically. When you add a dish in the admin panel, it appears on the
   website within seconds. No developer needed for day-to-day updates.

## What You Can Do Without Calling a Developer

- Add, edit, or remove menu items and prices any time
- Mark a dish "sold out" instantly during service
- Add a new branch location, or update hours/address for an existing one
- Upload new photos to your gallery
- Approve or hide customer reviews before they go public
- Confirm, reschedule (by editing), or cancel table reservations
- Reply to customer inquiries and see contact history
- Create limited-time offers and coupon codes for festivals or slow periods
- Add or edit frequently asked questions
- Post job openings and review applications
- Update your logo, contact info, and social media links
- Turn on Google Analytics or Facebook Pixel tracking (just paste an ID -- no code)

## What Still Needs Technical Help

- Deploying the system to a live domain the first time (see
  [`DEPLOYMENT.md`](./DEPLOYMENT.md) -- typically a one-time setup by whoever built or manages
  the site for you)
- Adding entirely new features not covered by the admin panel (e.g. online payments, a loyalty
  points system, a native mobile app)
- Major design changes to the website's look and feel
- Setting up or troubleshooting email sending (requires a mail provider account)

## Understanding Your Customer Reviews

Your site shows **two separate kinds of reviews**, and it's worth knowing the difference:

- **Google Reviews**: pulled live from your actual Google Business listing. You manage these
  the same way you always have, through Google -- this system just displays them nicely. It
  never edits, hides, or scrapes your Google listing.
- **Website Reviews**: submitted directly on your site. These sit in a queue for your approval
  before they go public, so you always get a chance to review feedback before it's visible
  (and can decline anything spammy or inappropriate).

Both are shown clearly labeled so customers understand where each rating is coming from.

## Multi-Language Support

Your website's navigation and key buttons are available in English, Telugu, and Hindi -- a
visitor can switch languages using the globe icon in the menu bar. Menu items and reviews stay
in whichever language your staff typed them in (most commonly English), since translating
customer-facing menu descriptions automatically isn't something this system does yet.

## Search Engine Visibility

The website is built to be found: it automatically tells Google and Bing what's on every page
(your menu, locations, hours, ratings) in a format they understand, keeps an up-to-date sitemap
of everything on your site, and is optimized to load quickly on phones -- all of which
influences how prominently you show up in search results and Google Maps. None of this requires
ongoing effort from you; it updates itself as you add content through the admin panel.

## Backups & Peace of Mind

Your menu, branch info, reservations, and reviews are stored in a professionally managed
database with automatic backup options (see [`MAINTENANCE.md`](./MAINTENANCE.md) for the
technical specifics) — this isn't sitting on one person's laptop. Your photos are hosted by
Cloudinary, an image platform used by major companies, which keeps them safe and serves them
quickly to visitors worldwide.

## Getting Help

- **"How do I...?"** questions about using the admin panel -> [`ADMIN_MANUAL.md`](./ADMIN_MANUAL.md)
- **Something looks broken** -> [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)
- **Setting up hosting, domains, or email for the first time** -> [`DEPLOYMENT.md`](./DEPLOYMENT.md),
  best handled with a developer's help
