import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import galleryService from "../../services/galleryService";
import SectionHeading from "../UI/SectionHeading";
import ErrorMessage from "../Error/ErrorMessage";

const GalleryPreview = () => {
  const { data: items, loading, error, refetch } = useFetch(
    () => galleryService.getAll({ featured: true, limit: 6 }),
    []
  );

  if (!loading && !error && items?.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="A Glimpse Inside" title="Gallery" />

        <div className="mt-12">
          {error && <ErrorMessage message={error} onRetry={refetch} />}
          {!error && items?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="aspect-square overflow-hidden rounded-xl"
                >
                  <img
                    src={item.image.url}
                    alt={item.image.alt || item.title || "Restaurant gallery photo"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700"
          >
            View Full Gallery <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
