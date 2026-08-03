import { motion } from "framer-motion";
import { FiStar, FiAward } from "react-icons/fi";
import { formatMenuPrice } from "../../utils/formatters";

const FOOD_TYPE_DOT = {
  veg: "bg-green-600 border-green-600",
  "non-veg": "bg-red-600 border-red-600",
  egg: "bg-amber-500 border-amber-500",
};

/**
 * Used on the Home page (Featured Dishes / Today's Special) and the full
 * Menu page grid. Keeping one component avoids duplicating card markup.
 */
const MenuItemCard = ({ item }) => {
  const placeholderImage =
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=60";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="card-premium group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.images?.[0]?.url || placeholderImage}
          alt={item.images?.[0]?.alt || item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.isPopular && (
            <span className="badge bg-primary-500 text-white">
              <FiStar size={12} /> Popular
            </span>
          )}
          {item.isChefRecommended && (
            <span className="badge bg-charcoal-900 text-white">
              <FiAward size={12} /> Chef Special
            </span>
          )}
        </div>
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-charcoal-900">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-charcoal-900">{item.name}</h3>
          <span
            className={`mt-1.5 inline-block h-3 w-3 shrink-0 rounded-sm border-2 ${
              FOOD_TYPE_DOT[item.foodType] || "border-charcoal-400"
            }`}
            title={item.foodType}
            aria-label={item.foodType}
          />
        </div>
        {item.description && (
          <p className="mb-3 line-clamp-2 text-sm text-charcoal-500">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-primary-600">
            {formatMenuPrice(item)}
          </span>
          {item.category?.name && (
            <span className="text-xs text-charcoal-400">{item.category.name}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default MenuItemCard;
