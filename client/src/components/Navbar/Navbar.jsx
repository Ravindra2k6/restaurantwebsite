import { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiPhoneCall, FiSearch } from "react-icons/fi";
import useScrolled from "../../hooks/useScrolled";
import { useSettings } from "../../context/SettingsContext";
import { useLanguage } from "../../context/LanguageContext";
import { NAV_LINKS } from "../../utils/constants";
import { telLink } from "../../utils/linkBuilders";
import LanguageSwitcher from "../UI/LanguageSwitcher";
import GlobalSearch from "../Search/GlobalSearch";

// Maps each nav path to its translation key, so labels switch language
// without changing the routing config in utils/constants.js.
const NAV_TRANSLATION_KEYS = {
  "/": "nav.home",
  "/about": "nav.about",
  "/menu": "nav.menu",
  "/branches": "nav.branches",
  "/gallery": "nav.gallery",
  "/offers": "nav.offers",
  "/reviews": "nav.reviews",
  "/reservation": "nav.reservation",
  "/contact": "nav.contact",
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrolled = useScrolled(40);
  const { settings } = useSettings();
  const { t } = useLanguage();

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2" onClick={closeMenu}>
          {settings.logo?.url ? (
            <img src={settings.logo.url} alt={settings.siteName} className="h-10 w-auto" />
          ) : (
            <span
              className={`font-display text-2xl font-bold tracking-tight ${
                scrolled || isOpen ? "text-charcoal-900" : "text-white"
              }`}
            >
              {settings.siteName || "Bhojanams & Biryanis"}
            </span>
          )}
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-primary-500/10 text-primary-600"
                      : scrolled
                      ? "text-charcoal-700 hover:text-primary-600"
                      : "text-white/90 hover:text-white"
                  }`
                }
              >
                {t(NAV_TRANSLATION_KEYS[link.path]) || link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label={t("common.search")}
            className={`rounded-full p-2 transition-colors ${
              scrolled ? "text-charcoal-700 hover:bg-charcoal-50" : "text-white/90 hover:bg-white/10"
            }`}
          >
            <FiSearch size={18} />
          </button>
          <LanguageSwitcher variant={scrolled ? "light" : "dark"} />
          <a
            href={telLink(settings.contact?.primaryPhone || "")}
            className="btn-primary !py-2 !px-5 text-sm"
          >
            <FiPhoneCall size={16} /> {t("nav.callNow")}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden rounded-full p-2 ${
            scrolled || isOpen ? "text-charcoal-900" : "text-white"
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </nav>

      {/* Animated mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-white/95 backdrop-blur-md lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 pb-6 pt-2">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-base font-medium ${
                        isActive
                          ? "bg-primary-500/10 text-primary-600"
                          : "text-charcoal-700 hover:bg-charcoal-50"
                      }`
                    }
                  >
                    {t(NAV_TRANSLATION_KEYS[link.path]) || link.label}
                  </NavLink>
                </li>
              ))}
              <li className="flex items-center justify-between px-2 pt-1">
                <LanguageSwitcher variant="light" />
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    closeMenu();
                  }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-charcoal-600 hover:bg-charcoal-50"
                >
                  <FiSearch size={14} /> {t("common.search")}
                </button>
              </li>
              <li className="pt-2">
                <a
                  href={telLink(settings.contact?.primaryPhone || "")}
                  className="btn-primary w-full text-sm"
                >
                  <FiPhoneCall size={16} /> {t("nav.callNow")}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
              <GlobalSearch onClose={() => setSearchOpen(false)} variant="light" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
