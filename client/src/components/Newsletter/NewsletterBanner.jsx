import { motion } from "framer-motion";
import NewsletterForm from "./NewsletterForm";

const NewsletterBanner = () => (
  <section className="relative overflow-hidden bg-gold-gradient py-16">
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-3xl font-bold text-charcoal-900 sm:text-4xl">
          Never Miss an Offer
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-charcoal-800/80">
          Subscribe for exclusive discounts, new menu launches, and festive specials — straight
          to your inbox.
        </p>
        <div className="mt-6 flex justify-center">
          <NewsletterForm variant="light" />
        </div>
      </motion.div>
    </div>
  </section>
);

export default NewsletterBanner;
