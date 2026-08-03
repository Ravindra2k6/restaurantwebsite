import { motion } from "framer-motion";
import { FiCopy, FiTag, FiClock } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import offerService from "../../services/offerService";
import { CardSkeletonGrid } from "../Loading/Skeletons";
import ErrorMessage from "../Error/ErrorMessage";
import { formatDate } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";

const placeholderImage =
  "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=700&q=65";

const OffersGrid = ({ limit }) => {
  const { data: offers, loading, error, refetch } = useFetch(() => offerService.getActive(), []);
  const { showToast } = useToast();
  const visibleOffers = limit ? offers?.slice(0, limit) : offers;

  const copyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    showToast(`Coupon "${code}" copied to clipboard`, "success");
  };

  if (loading) return <CardSkeletonGrid count={6} />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!visibleOffers?.length) {
    return (
      <p className="text-center text-charcoal-400">
        No active offers right now — check back soon for festive deals and discounts!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibleOffers.map((offer, index) => (
        <motion.article
          key={offer._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: index * 0.06 }}
          className="card-premium flex flex-col"
        >
          <div className="relative h-40 overflow-hidden">
            <img
              src={offer.image?.url || placeholderImage}
              alt={offer.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {offer.isFestive && (
              <span className="badge absolute left-3 top-3 bg-primary-500 text-white">
                Festive Offer
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-lg font-bold text-charcoal-900">{offer.title}</h3>
            {offer.description && (
              <p className="mt-2 flex-1 text-sm text-charcoal-500">{offer.description}</p>
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-charcoal-400">
              <span className="flex items-center gap-1">
                <FiClock size={13} /> Valid till {formatDate(offer.validUntil)}
              </span>
              {offer.minOrderValue > 0 && <span>Min order ₹{offer.minOrderValue}</span>}
            </div>

            {offer.couponCode && (
              <button
                onClick={() => copyCoupon(offer.couponCode)}
                className="mt-4 flex items-center justify-between rounded-lg border-2 border-dashed border-primary-300 bg-primary-50 px-4 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100"
              >
                <span className="flex items-center gap-2">
                  <FiTag size={14} /> {offer.couponCode}
                </span>
                <FiCopy size={14} />
              </button>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
};

export default OffersGrid;
