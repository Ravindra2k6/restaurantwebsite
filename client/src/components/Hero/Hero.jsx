import { motion } from "framer-motion";
import { FiPhoneCall, FiCalendar, FiMapPin, FiBookOpen } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { useLanguage } from "../../context/LanguageContext";
import { telLink, whatsappLink } from "../../utils/linkBuilders";
import { WHATSAPP_NUMBER } from "../../utils/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  }),
};

const Hero = () => {
  const { settings } = useSettings();
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal-950">
      {/* Video background (falls back to a gradient if no video is configured) */}
      {settings.heroVideoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={settings.heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-black" />
      )}
      <div className="absolute inset-0 bg-hero-overlay" />

      {/* Decorative floating accent */}
      <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-float" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.p
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="mb-4 inline-block rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-300"
        >
          {settings.tagline || "Premium Andhra Dining"}
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.15}
          variants={fadeUp}
          className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
        >
          {settings.heroHeadline || (
            <>
              Flavors of Andhra,
              <br />
              <span className="text-primary-400">Served with Soul</span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={0.3}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-base text-white/80 sm:text-lg"
        >
          Handcrafted biryanis, sizzling starters, and comforting thalis — a relaxed, premium
          dining experience across every branch.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.45}
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/menu" className="btn-primary">
            <FiBookOpen size={18} /> {t("hero.viewMenu")}
          </Link>
          <Link to="/reservation" className="btn-ghost-light">
            <FiCalendar size={18} /> {t("hero.reserveTable")}
          </Link>
          {settings.contact?.primaryPhone && (
            <a href={telLink(settings.contact.primaryPhone)} className="btn-ghost-light">
              <FiPhoneCall size={18} /> Call Now
            </a>
          )}
          <a
            href={whatsappLink(settings.contact?.whatsappNumber || WHATSAPP_NUMBER, "Hi! I'd like to know more about your menu.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105"
          >
            <FaWhatsapp size={18} /> {t("hero.whatsapp")}
          </a>
          <Link to="/branches" className="btn-ghost-light">
            <FiMapPin size={18} /> {t("hero.findOnMap")}
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        aria-hidden="true"
      >
        <div className="h-9 w-6 rounded-full border-2 border-white/40 p-1">
          <div className="h-2 w-2 rounded-full bg-white/70" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
