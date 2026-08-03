import { FiStar } from "react-icons/fi";

/**
 * Renders a row of filled/empty stars for a given rating out of 5.
 * Used by both website reviews and Google reviews so they render identically.
 */
const StarRating = ({ rating = 0, size = 16, showValue = false }) => {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          size={size}
          className={i < rounded ? "fill-primary-500 text-primary-500" : "text-charcoal-200"}
        />
      ))}
      {showValue && <span className="ml-1 text-sm font-semibold text-charcoal-700">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
