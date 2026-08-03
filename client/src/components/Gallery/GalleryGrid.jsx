import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import useFetch from "../../hooks/useFetch";
import galleryService from "../../services/galleryService";
import { CardSkeletonGrid } from "../Loading/Skeletons";
import ErrorMessage from "../Error/ErrorMessage";
import { capitalize } from "../../utils/formatters";

const CATEGORIES = ["all", "food", "ambience", "events", "staff", "awards", "other"];

const GalleryGrid = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const { data: items, loading, error, refetch } = useFetch(
    () => galleryService.getAll({ limit: 100, ...(activeCategory !== "all" && { category: activeCategory }) }),
    [activeCategory]
  );

  const slides = useMemo(
    () => (items || []).map((item) => ({ src: item.image.url, alt: item.image.alt || item.title })),
    [items]
  );

  return (
    <div>
      {/* Category filter */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-charcoal-900 text-white"
                : "bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200"
            }`}
          >
            {capitalize(cat)}
          </button>
        ))}
      </div>

      {loading && <CardSkeletonGrid count={9} columns="sm:grid-cols-3 lg:grid-cols-4" />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && items?.length === 0 && (
        <p className="text-center text-charcoal-400">No photos in this category yet.</p>
      )}

      {!loading && !error && items?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <motion.button
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-square overflow-hidden rounded-xl"
              aria-label={`View ${item.title || "gallery image"} full size`}
            >
              <img
                src={item.image.url}
                alt={item.image.alt || item.title || "Restaurant gallery photo"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {item.title && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.title}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      )}

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </div>
  );
};

export default GalleryGrid;
