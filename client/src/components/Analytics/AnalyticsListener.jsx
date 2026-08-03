import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { initGoogleAnalytics, initMetaPixel, trackPageview } from "../../utils/analytics";

/**
 * Mounted once inside <BrowserRouter> (so useLocation works) alongside the
 * route tree. Initializes analytics as soon as site settings load, then
 * fires a virtual pageview on every subsequent client-side navigation.
 * Renders nothing.
 */
const AnalyticsListener = () => {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    if (settings?.analytics?.googleAnalyticsId) {
      initGoogleAnalytics(settings.analytics.googleAnalyticsId);
    }
    if (settings?.analytics?.facebookPixelId) {
      initMetaPixel(settings.analytics.facebookPixelId);
    }
  }, [settings?.analytics?.googleAnalyticsId, settings?.analytics?.facebookPixelId]);

  useEffect(() => {
    trackPageview(location.pathname);
  }, [location.pathname]);

  return null;
};

export default AnalyticsListener;
