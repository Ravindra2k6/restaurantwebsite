import { useRef, useState } from "react";
import { FiGlobe, FiChevronDown } from "react-icons/fi";
import { useLanguage, SUPPORTED_LANGUAGES } from "../../context/LanguageContext";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const LanguageSwitcher = ({ variant = "light" }) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  const isDark = variant === "dark";
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Change language"
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
          isDark ? "text-white/90 hover:bg-white/10" : "text-charcoal-600 hover:bg-charcoal-50"
        }`}
      >
        <FiGlobe size={14} />
        {current?.label}
        <FiChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-32 overflow-hidden rounded-xl bg-white py-1 shadow-xl">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-charcoal-50 ${
                lang.code === language ? "font-bold text-primary-600" : "text-charcoal-700"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
