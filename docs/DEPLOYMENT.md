# Deployment Guide

This guide walks through deploying all three apps to production: MongoDB Atlas, Cloudinary,
the backend API, the customer website, and the admin panel, followed by custom domain + HTTPS
setup and a final go-live checklist.

---

## 1. Database -- MongoDB Atlas

1. Create a free/shared cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Database Access -> add a user with a strong password (read/write on this project).
3. Network Access -> add your deployment platform's IP range, or `0.0.0.0/0` if your host uses
   dynamic egress IPs (Render, Vercel serverless, etc. commonly do) -- if you allow all IPs,
   rely on the database user's password as the real security boundary.
4. Get the connection string (Connect -> Drivers) and set it as `MONGO_URI` in the backend's
   production environment variables. Include the database name in the path, e.g.
   `mongodb+srv://user:pass@cluster0.mongodb.net/restaurant_website`.
5. Run the seeder once against production if you want the sample content, or skip it and let
   the admin panel populate real content from day one:
   ```bash
   MONGO_URI="<production-uri>" npm run seed
   ```

---

## 2. Image Storage -- Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the Dashboard, copy your Cloud Name, API Key, and API Secret into the backend's
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. No bucket/folder setup needed -- the app creates folders automatically
   (`restaurant-website/menu`, `/branches`, `/gallery`, etc.) on first upload.
4. Recommended: in Cloudinary's Settings -> Security, restrict allowed upload formats to
   match what the app already validates (jpg/jpeg/png/webp for images, pdf/doc/docx for
   resumes) as defense-in-depth beyond the app's own file filters.

---

## 3. Backend API

The backend is a standard Node/Express app -- deployable to Render, Railway, Fly.io, a VPS, or
any Node host.

### Environment variables (production)
Set every variable from `server/.env.example`, with these production-specific notes:
- `NODE_ENV=production`
- `CLIENT_URL` -- your customer site's production URL (e.g. `https://bhojanamsbiryanis.com`)
- `ADMIN_URL` -- your admin panel's production URL (e.g. `https://admin.bhojanamsbiryanis.com`)
- `API_PUBLIC_URL` -- your backend's own public URL (used to build unsubscribe links, etc.)
- `JWT_SECRET` / `JWT_REFRESH_SECRET` -- generate fresh, unique values for production:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- `SMTP_*` -- a real provider (SendGrid, Mailgun, Amazon SES, Postmark). Without these, the app
  still runs fine but emails only get logged, not sent.
- `GOOGLE_PLACES_API_KEY` -- required only if you want live Google Reviews on the Reviews page.

### Example: Render
1. New -> Web Service -> connect your repo, root directory `server/`.
2. Build command: `npm install`. Start command: `npm start`.
3. Add all environment variables in the Render dashboard.
4. Render provisions HTTPS automatically on its `*.onrender.com` domain; add a custom domain
   under Settings -> Custom Domain once ready (see Section 6).

### Example: a plain VPS (Ubuntu)
```bash
git clone <your-repo> && cd restaurant-website/server
npm install --production
cp .env.example .env   # fill in production values
npm install -g pm2
pm2 start server.js --name restaurant-api
pm2 save
pm2 startup            # follow the printed instructions to survive reboots
```
Put Nginx in front as a reverse proxy (see Section 6 for the HTTPS config) forwarding to
`localhost:5000`.

### Production build checklist for the backend
- [ ] `NODE_ENV=production`
- [ ] All secrets are freshly generated, not copied from `.env.example`
- [ ] `helmet`, rate limiting, and CORS are already wired in `app.js` -- just confirm
      `CLIENT_URL`/`ADMIN_URL` match your real domains exactly (including `https://`)
- [ ] MongoDB Atlas network access allows your host's IPs
- [ ] Cloudinary credentials are the production account's, not a personal test account
- [ ] `npm run seed` has been run once, OR you're comfortable starting with an empty database
      and populating everything through the admin panel

---

## 4. Customer Website & Admin Panel (static builds)

Both `client/` and `admin/` are Vite apps that build to static files -- deployable to Vercel,
Netlify, Cloudflare Pages, or any static host / CDN.

### Build
```bash
cd client && npm install && npm run build   # outputs client/dist
cd ../admin && npm install && npm run build # outputs admin/dist
```

### Environment variables (production)
Both apps need `VITE_API_BASE_URL` pointing at your deployed backend, e.g.
`https://api.bhojanamsbiryanis.com/api/v1`. Set this in your hosting platform's build-time
environment variables (Vite bakes `VITE_*` vars in at build time, not runtime).

### Example: Vercel (repeat for both `client/` and `admin/` as separate projects)
1. New Project -> import your repo -> set **Root Directory** to `client` (or `admin`).
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Add `VITE_API_BASE_URL` (and `VITE_SITE_URL`, `VITE_WHATSAPP_NUMBER` for `client`) under
   Environment Variables.
4. Deploy. Vercel provisions HTTPS automatically; add your custom domain under Settings ->
   Domains.

### Client-side routing
Both apps use React Router in browser (history) mode, so your host needs a rewrite rule
sending all paths to `index.html`:
- **Vercel**: add a `vercel.json` with a catch-all rewrite, or rely on its Vite preset which
  handles this automatically.
- **Netlify**: add `client/public/_redirects` (and `admin/public/_redirects`) containing:
  ```
  /*  /index.html  200
  ```
- **Nginx** (VPS): `try_files $uri $uri/ /index.html;` inside the `location /` block.

---

## 5. Google Business Profile & Analytics setup

- **Google Places API**: enable the "Places API (New)" in Google Cloud Console, generate an
  API key restricted to that API, and set it as `GOOGLE_PLACES_API_KEY` on the backend. In the
  admin panel, add each branch's Google Place ID (Branches -> Edit -> Google Place ID field).
- **Google Analytics 4**: create a GA4 property, copy the Measurement ID (`G-XXXXXXX`), and
  paste it into the admin panel under SEO -> Analytics Integration -- no redeploy needed, it
  loads dynamically on the customer site.
- **Meta Pixel**: same pattern, via Meta Events Manager -> paste the Pixel ID in the same
  settings screen.
- **Google Search Console**: after going live, verify ownership (HTML tag or DNS method) and
  submit your sitemap at `https://your-domain.com/sitemap.xml` — see Section 7 for wiring the
  backend's dynamic sitemap route behind that path.
- **Bing Webmaster Tools**: same sitemap URL works; Bing also supports importing directly from
  Google Search Console.

---

## 6. Custom Domain & HTTPS

Typical DNS layout for this system:
| Subdomain | Points to |
|---|---|
| `bhojanamsbiryanis.com` (or `www.`) | Customer website (`client/`) |
| `admin.bhojanamsbiryanis.com` | Admin panel (`admin/`) |
| `api.bhojanamsbiryanis.com` | Backend (`server/`) |

- **Managed hosts (Vercel/Netlify/Render)**: add the domain in their dashboard; they issue and
  renew Let's Encrypt SSL certificates automatically. Just point a CNAME (or A record, per
  their instructions) at the value they give you.
- **Self-managed VPS with Nginx + Certbot**:
  ```bash
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d api.bhojanamsbiryanis.com
  ```
  Certbot auto-configures the HTTPS server block and sets up auto-renewal via a systemd timer
  or cron job -- verify with `sudo certbot renew --dry-run`.

After DNS + HTTPS are live, update `CLIENT_URL`, `ADMIN_URL`, and `API_PUBLIC_URL` on the
backend, and `VITE_API_BASE_URL`/`VITE_SITE_URL` on both frontends, to the real HTTPS domains,
then redeploy all three.

---

## 7. Sitemap & robots.txt in production

The backend generates a live sitemap at `GET /api/v1/sitemap.xml`. Two ways to expose it at
the conventional `https://your-domain.com/sitemap.xml` path:

- **Reverse proxy rewrite** (recommended): in Nginx/Vercel/Netlify config for the customer
  site, rewrite `/sitemap.xml` -> `https://api.your-domain.com/api/v1/sitemap.xml`.
- **Or** link to the API URL directly from `client/public/robots.txt`:
  ```
  Sitemap: https://api.your-domain.com/api/v1/sitemap.xml
  ```
  (simpler, works immediately, just not at the exact conventional path).

`client/public/robots.txt` already ships with a `Sitemap:` line -- update it to your real
domain before going live.

---

## 8. Final Deployment Checklist

- [ ] MongoDB Atlas cluster created, network access configured, connection string set
- [ ] Cloudinary production credentials set
- [ ] Backend deployed, `/api/v1/health` returns 200
- [ ] Fresh JWT secrets generated for production (not reused from local `.env`)
- [ ] `CLIENT_URL` and `ADMIN_URL` on the backend match real deployed domains exactly
- [ ] Customer website deployed, loads real data from the production API
- [ ] Admin panel deployed, superadmin login works, all modules load
- [ ] Custom domains attached with HTTPS active on all three deployments
- [ ] `robots.txt` and sitemap point to the real production domain
- [ ] Google Search Console + Bing Webmaster Tools verified, sitemap submitted
- [ ] GA4 and/or Meta Pixel IDs added via the admin panel (if using analytics)
- [ ] SMTP credentials set, a real reservation/contact test triggers a real email
- [ ] Google Places API key set (if using live Google Reviews), branch Place IDs added
- [ ] Seed data removed/replaced with real menu, branch, and content data
- [ ] Default superadmin password changed from whatever was in `.env.example`
- [ ] A full walkthrough of [`TESTING.md`](./TESTING.md) completed against production URLs
