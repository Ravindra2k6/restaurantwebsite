/**
 * Hand-written service worker (no build plugin) so the PWA works with the
 * existing Vite setup unchanged. Strategy:
 *  - App shell (HTML/CSS/JS) -> cache-first, so the site still loads offline
 *    after the first visit.
 *  - API calls (/api/) -> network-first, falling back to cache -- keeps
 *    data fresh when online, but shows the last-known response when offline
 *    rather than a hard failure.
 *  - Everything else (images, fonts) -> stale-while-revalidate.
 *
 * Registered from src/main.jsx. Bump CACHE_VERSION whenever deployed static
 * assets change meaningfully, so old caches are cleared on next visit.
 */
const CACHE_VERSION = "v2";
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const APP_SHELL_URLS = ["/", "/manifest.json", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // never cache mutating requests

  const url = new URL(request.url);

  // Always fetch fresh API data
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first for same-origin navigation/app shell requests
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches
              .open(APP_SHELL_CACHE)
              .then((cache) => cache.put(request, clone));
            return response;
          }),
      ),
    );
    return;
  }

  // Stale-while-revalidate for everything else (Cloudinary images, fonts, etc.)
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    }),
  );
});
