import { createContext, useContext, useState, useEffect } from "react";
import translations from "../i18n/translations";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
];

const LanguageContext = createContext(null);

const getInitialLanguage = () => {
  const stored = localStorage.getItem("site-language");
  if (stored && translations[stored]) return stored;
  const browserLang = navigator.language?.slice(0, 2);
  return translations[browserLang] ? browserLang : "en";
};

/**
 * Provides a t(path) translation function (dot-notation key lookup, e.g.
 * t("nav.home")) plus the current language and a setter. Falls back to
 * English for any key missing in the active language, and to the raw key
 * itself if it's missing everywhere -- so a missing translation never
 * renders blank.
 */
export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem("site-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (code) => {
    if (translations[code]) setLanguageState(code);
  };

  const t = (path) => {
    const keys = path.split(".");
    const lookup = (dict) => keys.reduce((acc, key) => acc?.[key], dict);
    return lookup(translations[language]) ?? lookup(translations.en) ?? path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
