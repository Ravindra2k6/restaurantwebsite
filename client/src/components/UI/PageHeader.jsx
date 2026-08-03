import { motion } from "framer-motion";

/**
 * Compact hero banner for every non-home page (About, Menu, Branches, etc.)
 * — keeps a consistent premium look without repeating the full-screen Hero.
 */
const PageHeader = ({ eyebrow, title, subtitle }) => (
  <section className="relative flex items-center justify-center overflow-hidden bg-charcoal-950 py-28 sm:py-32">
    <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-black" />
    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6"
    >
      {eyebrow && (
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary-400">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-4 text-white/70">{subtitle}</p>}
    </motion.div>
  </section>
);

export default PageHeader;
