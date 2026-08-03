# Troubleshooting Guide

Common issues and how to resolve them, organized by symptom.

---

## "Can't log in" / "Invalid email or password"

- Double-check the email/password -- they're case-sensitive.
- If you've failed 5+ times recently, the account locks temporarily (15 minutes) as a security
  measure -- wait and try again, or use "Forgot password?"
- Confirm the backend is actually running and reachable: visit
  `<your-api-url>/api/v1/health` in a browser -- it should return
  `{"success":true,"message":"API is healthy",...}`. If it doesn't load, the backend is down or
  `VITE_API_BASE_URL` in the admin panel's `.env` points to the wrong place.

## Admin panel loads but shows no data / spinning forever

- Open browser DevTools -> Network tab, reload, and check for failed requests (red rows).
- **CORS error in console** ("blocked by CORS policy"): the backend's `CLIENT_URL`/`ADMIN_URL`
  env vars don't match the admin panel's actual origin. Update them on the backend and restart
  it.
- **401 errors on every request**: your session may have expired and silent refresh failed --
  log out and back in.
- **Network Error / ERR_CONNECTION_REFUSED**: the backend isn't running, or
  `VITE_API_BASE_URL` is wrong. Confirm both.

## Customer website shows empty sections (no menu items, no branches, etc.)

This is often correct behavior, not a bug -- sections quietly hide themselves when there's no
data rather than showing broken placeholders. Check:
- Has any content actually been added via the admin panel yet? Run `npm run seed` in `server/`
  for sample data during initial setup/testing.
- Is the backend reachable from the customer site? Same CORS/URL checks as above, but for
  `client/.env`'s `VITE_API_BASE_URL`.
- For "Today's Special" / "Featured Dishes" / "Chef Recommendations" specifically: these only
  show items with the matching badge toggled ON in Menu Management -- an empty menu list there
  means no items have that badge set yet.

## Image upload fails

- Check the file is under the size limit (5MB for most images) and is a supported format
  (jpg/jpeg/png/webp for photos, pdf/doc/docx for resumes).
- Confirm Cloudinary credentials are set correctly in the backend's `.env`
  (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) -- a wrong/missing
  credential causes every upload to fail with a vague error.
- Check the backend's logs for the actual Cloudinary error message if the above doesn't
  resolve it.

## Emails aren't sending

- If `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` aren't set in the backend's `.env`, this is expected
  -- the app logs email content to the console instead of sending, by design, so the rest of
  the app keeps working without a mail provider configured. Set real SMTP credentials to
  enable actual sending.
- If SMTP *is* configured and emails still aren't arriving: check spam folders first, then
  check the backend logs for an SMTP authentication or connection error, and verify your
  provider's sending limits haven't been hit.
- Some providers (Gmail in particular) require an "app password" rather than your normal
  account password, and may need "less secure app access" or similar settings enabled.

## Google Reviews tab shows "not configured"

Two things are both required:
1. `GOOGLE_PLACES_API_KEY` set in the backend's `.env` (from Google Cloud Console, with the
   Places API (New) enabled on that key).
2. The specific branch has a **Google Place ID** filled in (Admin Panel -> Branches -> Edit ->
   Google Place ID field).

Missing either one shows this message rather than failing silently -- fill in whichever is
missing and it should populate on next load.

## Reservation/contact form submits but nothing shows in admin

- Confirm you're checking the right branch filter if one is applied in the admin table.
- Check the backend logs for a validation error at submission time (the form should have shown
  an error toast if this happened, but worth confirming).
- Confirm the customer site's `VITE_API_BASE_URL` actually points at your real backend, not a
  stale/local one left over from development.

## Site looks broken / unstyled after deployment

- Usually a build issue: confirm `npm run build` completed without errors, and that your
  hosting platform is serving the `dist/` folder's contents, not the source `src/` folder.
- Confirm environment variables were set **before** the build ran (Vite bakes `VITE_*` vars in
  at build time) -- if you added/changed an env var after building, you must rebuild.

## "This page isn't found" on a valid route after refresh (production only)

Your host isn't rewriting all paths to `index.html` for client-side routing. See the
"Client-side routing" section in [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the fix specific to
your host (Vercel/Netlify/Nginx).

## Rate limit errors ("Too many requests")

By design, to prevent abuse. If legitimate users/staff are hitting this during normal use,
increase `RATE_LIMIT_MAX_REQUESTS` and/or `RATE_LIMIT_WINDOW_MINUTES` in the backend's `.env`
and restart it.

## Still stuck?

1. Check the backend's live logs first -- most issues surface a clear error message there even
   when the frontend shows something generic.
2. Confirm you're running the versions/setup described in each app's `README.md` (Node 18+,
   correct env vars).
3. Work through [`TESTING.md`](./TESTING.md) Section 1 (Authentication) as a baseline sanity
   check -- if basic login/CRUD works, the issue is likely narrower than it first appears.
