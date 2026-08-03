import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import reviewService from "../../services/reviewService";
import SectionHeading from "../UI/SectionHeading";
import StarRating from "../UI/StarRating";
import ErrorMessage from "../Error/ErrorMessage";
import { CardSkeletonGrid } from "../Loading/Skeletons";

const Testimonials = () => {
  const { data: reviews, meta, loading, error, refetch } = useFetch(
    () => reviewService.getApproved({ limit: 6 }),
    []
  );

  if (!loading && !error && reviews?.length === 0) return null;

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Guest Love"
          title="What Our Customers Say"
          subtitle={
            meta?.averageRating
              ? `Rated ${meta.averageRating} / 5 from ${meta.totalApproved} website reviews`
              : undefined
          }
        />

        <div className="mt-12">
          {loading && <CardSkeletonGrid count={3} />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && reviews?.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, index) => (
                <motion.blockquote
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="card-premium p-6"
                >
                  <StarRating rating={review.rating} />
                  <p className="mt-4 text-sm text-charcoal-600 line-clamp-4">"{review.comment}"</p>
                  <footer className="mt-5 flex items-center gap-3">
                    {review.avatar?.url ? (
                      <img
                        src={review.avatar.url}
                        alt={review.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        <FiUser size={18} />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">{review.name}</p>
                      <p className="text-xs text-charcoal-400">Verified Guest</p>
                    </div>
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
