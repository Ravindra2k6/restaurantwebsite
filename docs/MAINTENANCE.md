# Maintenance Guide

Ongoing operational tasks for keeping the system healthy after launch.

---

## 1. Database Backups

**MongoDB Atlas (recommended)**: paid tiers include automated continuous backups with
point-in-time restore out of the box (Atlas -> Backup tab). For the free/shared tier, set up a
scheduled manual export instead:

```bash
# Full database dump
mongodump --uri="<production MONGO_URI>" --out=./backups/$(date +%F)

# Restore from a dump
mongorestore --uri="<production MONGO_URI>" ./backups/2026-01-15
```

Recommended cadence: automated daily dump via a cron job (or a scheduled GitHub Action /
Render Cron Job) piping to encrypted cloud storage (S3, Backblaze B2, etc.), retained for at
least 30 days. Test the restore procedure quarterly on a scratch database -- an untested backup
is not a real backup.

## 2. Image Backups

Images live in Cloudinary, which retains everything you upload indefinitely on paid plans and
does not require a separate backup process for normal operation. For extra safety:
- Cloudinary's **Backup** add-on (Settings -> Backup) mirrors your media library to your own
  cloud storage automatically.
- Alternatively, periodically run the [Cloudinary CLI](https://cloudinary.com/documentation/cloudinary_cli)
  or Admin API to export a manifest + download all assets under the `restaurant-website/`
  folder prefix used throughout this app.

## 3. Restore Instructions

1. **Database**: `mongorestore` the most recent good dump into a fresh Atlas cluster (or the
   existing one, with `--drop` to replace collections cleanly). Update `MONGO_URI` on the
   backend if you restored into a new cluster, then redeploy/restart the backend.
2. **Images**: if Cloudinary itself is unaffected (the common case -- you're restoring the
   database, not Cloudinary), no image action is needed since MongoDB only stores the Cloudinary
   URLs/public IDs, not the images themselves. If Cloudinary assets were actually lost, restore
   from your backup add-on/export and confirm the `publicId`s match what's referenced in the
   restored database.
3. **Verify**: run through [`TESTING.md`](./TESTING.md) Sections 2-6 against the restored
   environment before considering the restore complete.

## 4. Dependency Updates

Check for updates quarterly at minimum, monthly for security patches:

```bash
# In each of server/, client/, admin/
npm outdated
npm audit
npm audit fix          # non-breaking fixes
npm update              # bump within semver ranges
```

For major version bumps (React, Express, Mongoose, etc.), update one at a time, re-run the full
[`TESTING.md`](./TESTING.md) checklist, and check that package's changelog for breaking changes
before deploying.

## 5. Monitoring

At minimum, set up:
- **Uptime monitoring**: a free service (UptimeRobot, Better Uptime, or your host's built-in
  health checks) pinging `GET /api/v1/health` on the backend every few minutes, alerting on
  failure.
- **Error tracking**: the backend already logs errors to stdout (captured by most hosts'
  logging dashboards -- Render, Railway, etc. all show live logs). For a more structured
  setup, wire in Sentry or a similar service in `middleware/errorHandler.js`'s catch block.
- **MongoDB Atlas alerts**: Atlas -> Alerts -> enable notifications for high connection count,
  disk usage, and replication lag (relevant once you're past the free tier).

## 6. Log Review

The backend uses `morgan` for HTTP request logging (`combined` format in production) and plain
`console.error` for application errors. Review your host's log dashboard periodically for:
- Repeated 401/423 responses from one IP (possible brute-force attempt -- the rate limiter and
  account lockout already mitigate this, but repeated attempts are worth noting)
- 5xx errors, which indicate a real bug or a downstream failure (Cloudinary, MongoDB, SMTP)
- Rate limit hits (429 responses) -- if legitimate traffic is being throttled, adjust
  `RATE_LIMIT_MAX_REQUESTS`/`RATE_LIMIT_WINDOW_MINUTES` in the backend's `.env`

## 7. Secret Rotation

Rotate these periodically (at minimum annually, or immediately if you suspect exposure):
- `JWT_SECRET` / `JWT_REFRESH_SECRET` -- rotating these invalidates all existing sessions,
  forcing everyone to log in again. Plan rotation for low-traffic periods.
- Cloudinary API secret -- regenerate from the Cloudinary dashboard, update
  `CLOUDINARY_API_SECRET` on the backend, redeploy.
- SMTP credentials -- rotate per your provider's recommendations.
- The seeded/default superadmin password -- change this immediately after first login if you
  haven't already (Admin Panel -> Profile -> Change Password).

## 8. Content & Data Hygiene

- Periodically review **pending reviews** and **new contact messages** -- the admin
  Notifications page surfaces anything awaiting action.
- Archive or delete old **job applications** for closed positions once no longer needed
  (resumes are stored in Cloudinary and count toward storage usage).
- Review **expired offers** -- the Offers page auto-labels them "Expired" but doesn't
  auto-delete them; clean up periodically if the list gets long.
- Re-run `npm audit` and dependency updates (Section 4) alongside any content cleanup pass, so
  maintenance happens on a predictable rhythm rather than only reactively.

## 9. Scaling Notes

If traffic grows beyond a single backend instance:
- The backend is stateless (JWT-based auth, no in-memory session store) except for the
  in-process rate limiter and the Google Reviews cache in
  `controllers/googleReviewController.js` -- both are per-instance. Behind a load balancer with
  multiple instances, consider moving rate limiting to a shared store (e.g. `rate-limit-redis`)
  if precise global limits matter.
- MongoDB Atlas scales independently (upgrade tier, add read replicas) without app changes.
- Cloudinary and the static frontends (Vercel/Netlify/CDN) scale automatically.
