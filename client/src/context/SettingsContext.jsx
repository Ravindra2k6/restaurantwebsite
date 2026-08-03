import { createContext, useContext, useEffect, useState } from "react";
import settingsService from "../services/settingsService";

const SettingsContext = createContext(null);

const FALLBACK_SETTINGS = {
  siteName: "Bhojanams & Biryanis",
  tagline: "Relaxed dining serving biryanis and Andhra staples alongside thali meals",
  logo: { url: "" },
  contact: { primaryPhone: "", primaryEmail: "", whatsappNumber: "" },
  socialLinks: {},
  currency: { code: "INR", symbol: "₹" },
  seoDefaults: {},
};

/**
 * Fetches the site-wide settings singleton once on app load (homepage
 * headline, logo, social links, currency, SEO defaults) and shares it via
 * context so the Navbar, Footer, SEO component, etc. don't each re-fetch it.
 */
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    settingsService
      .get()
      .then((res) => {
        if (mounted && res?.data) setSettings(res.data);
      })
      .catch(() => {
        // Non-fatal: the app works fine with sensible fallback settings.
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>{children}</SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
};
