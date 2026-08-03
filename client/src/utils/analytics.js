/**
 * Dynamically injects Google Analytics 4 and Meta (Facebook) Pixel based on
 * IDs configured in the admin panel (Settings -> SEO -> Analytics
 * Integration), rather than hardcoding them at build time. This means a
 * restaurant owner can turn analytics on/off or change IDs without a
 * redeploy -- just update the setting and reload.
 *
 * Called once from App.jsx after site settings load. Safe to call multiple
 * times; guards against injecting duplicate script tags.
 */

let gaInitialized = false;
let pixelInitialized = false;

export const initGoogleAnalytics = (measurementId) => {
  if (!measurementId || gaInitialized || typeof window === "undefined") return;

  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId, { anonymize_ip: true });

  gaInitialized = true;
};

export const initMetaPixel = (pixelId) => {
  if (!pixelId || pixelInitialized || typeof window === "undefined") return;

  /* eslint-disable */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");

  pixelInitialized = true;
};

/**
 * Tracks a virtual pageview on route change -- call from a router-level
 * effect once analytics are initialized. GA4's gtag config call above
 * already tracks the first load; this covers subsequent SPA navigations.
 */
export const trackPageview = (path) => {
  if (window.gtag) {
    window.gtag("event", "page_view", { page_path: path });
  }
  if (window.fbq) {
    window.fbq("track", "PageView");
  }
};

/**
 * Tracks a custom event (e.g. reservation submitted, menu item viewed) in
 * both GA4 and Meta Pixel if configured.
 */
export const trackEvent = (eventName, params = {}) => {
  if (window.gtag) window.gtag("event", eventName, params);
  if (window.fbq) window.fbq("trackCustom", eventName, params);
};
