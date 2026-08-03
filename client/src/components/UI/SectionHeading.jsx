import { motion } from "framer-motion";

/**
 * Consistent "eyebrow + heading + subheading" pattern used at the top of
 * nearly every page section, with a gentle fade-up animation on scroll.
 */
const SectionHeading = ({ eyebrow, title, subtitle, align = "center" }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6 }}
    className={align === "center" ? "text-center" : "text-left"}
  >
    {eyebrow && (
      <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-primary-600">
        {eyebrow}
      </span>
    )}
    <h2 className="section-heading">{title}</h2>
    {subtitle && (
      <p className={`section-subheading ${align === "center" ? "mx-auto" : ""}`}>{subtitle}</p>
    )}
  </motion.div>
);

export default SectionHeading;
