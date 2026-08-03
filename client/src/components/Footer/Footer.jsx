import { NavLink } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { useSettings } from "../../context/SettingsContext";
import { useLanguage } from "../../context/LanguageContext";
import { FOOTER_LINKS } from "../../utils/constants";
import { telLink } from "../../utils/linkBuilders";
import useFetch from "../../hooks/useFetch";
import branchService from "../../services/branchService";
import NewsletterForm from "../Newsletter/NewsletterForm";

const SOCIAL_ICON_MAP = {
  facebook: FiFacebook,
  instagram: FiInstagram,
  twitter: FiTwitter,
  youtube: FiYoutube,
};

const Footer = () => {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const { data: branches } = useFetch(() => branchService.getAll({ active: true }), []);
  const year = new Date().getFullYear();

  const socialEntries = Object.entries(settings.socialLinks || {}).filter(
    ([key, value]) => value && SOCIAL_ICON_MAP[key]
  );

  return (
    <footer className="bg-charcoal-950 text-charcoal-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & about */}
          <div>
            <h3 className="font-display text-2xl font-bold text-white">
              {settings.siteName || "Bhojanams & Biryanis"}
            </h3>
            <p className="mt-3 text-sm text-charcoal-400">{settings.tagline}</p>
            {socialEntries.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socialEntries.map(([key, url]) => {
                  const Icon = SOCIAL_ICON_MAP[key];
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary-500"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="text-sm text-charcoal-400 transition-colors hover:text-primary-400"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.ourBranches")}
            </h4>
            <ul className="space-y-3">
              {branches?.slice(0, 4).map((branch) => (
                <li key={branch._id} className="flex items-start gap-2 text-sm text-charcoal-400">
                  <FiMapPin className="mt-0.5 shrink-0 text-primary-400" size={14} />
                  <span>
                    {branch.branchName}, {branch.address?.city}
                  </span>
                </li>
              ))}
              {!branches?.length && (
                <li className="text-sm text-charcoal-500">Branch info loading…</li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.stayUpdated")}
            </h4>
            <p className="mb-4 text-sm text-charcoal-400">
              Subscribe for offers, new menu launches, and event news.
            </p>
            <NewsletterForm variant="dark" />
            <div className="mt-5 space-y-2 text-sm text-charcoal-400">
              {settings.contact?.primaryPhone && (
                <a
                  href={telLink(settings.contact.primaryPhone)}
                  className="flex items-center gap-2 hover:text-primary-400"
                >
                  <FiPhone size={14} /> {settings.contact.primaryPhone}
                </a>
              )}
              {settings.contact?.primaryEmail && (
                <a
                  href={`mailto:${settings.contact.primaryEmail}`}
                  className="flex items-center gap-2 hover:text-primary-400"
                >
                  <FiMail size={14} /> {settings.contact.primaryEmail}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-charcoal-500">
            &copy; {year} {settings.siteName || "Bhojanams & Biryanis"}. {t("footer.allRightsReserved")}
          </p>
          <div className="flex gap-4 text-xs text-charcoal-500">
            <NavLink to="/privacy" className="hover:text-primary-400">
              Privacy Policy
            </NavLink>
            <NavLink to="/terms" className="hover:text-primary-400">
              Terms & Conditions
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
