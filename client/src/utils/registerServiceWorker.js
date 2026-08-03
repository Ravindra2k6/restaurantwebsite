/**
 * Registers the hand-written service worker (public/sw.js) after the page
 * has fully loaded, so it never competes with the initial page load for
 * bandwidth/CPU. No-ops safely in browsers without SW support or in dev
 * environments where it isn't desired.
 */
export const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return; // avoid caching issues while iterating locally

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.warn("Service worker registration failed:", err));
  });
};
