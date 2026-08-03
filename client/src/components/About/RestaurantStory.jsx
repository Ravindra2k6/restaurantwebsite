import { motion } from "framer-motion";
import { useSettings } from "../../context/SettingsContext";

const RestaurantStory = () => {
  const { settings } = useSettings();

  const storyImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=70";

  return (
    <section className="overflow-hidden bg-cream py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-3xl shadow-xl">
            <img
              src={storyImage}
              alt="Inside our restaurant kitchen"
              loading="lazy"
              className="h-[420px] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-gold-gradient px-8 py-6 text-center shadow-gold sm:block">
            <p className="font-display text-3xl font-bold text-charcoal-900">15+</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-800">
              Years of Flavor
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-primary-600">
            Our Story
          </span>
          <h2 className="section-heading">A Table Built on Tradition</h2>
          <p className="mt-5 text-charcoal-600 leading-relaxed">
            {settings.restaurantStory ||
              `${settings.siteName || "Bhojanams & Biryanis"} began with a simple idea: bring the
              soulful, slow-cooked flavors of Andhra kitchens to a relaxed, welcoming table.
              Every biryani is layered by hand, every curry simmered the traditional way, and
              every thali plated with the kind of care you'd expect from a home kitchen —
              just with room for everyone you love.`}
          </p>
          <p className="mt-4 text-charcoal-600 leading-relaxed">
            Today, that same philosophy carries across every branch — consistent quality,
            genuine hospitality, and a menu that never stops honoring where it came from.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default RestaurantStory;
