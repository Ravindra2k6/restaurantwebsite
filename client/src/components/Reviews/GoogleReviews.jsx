import { FiExternalLink } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import useFetch from "../../hooks/useFetch";
import branchService from "../../services/branchService";
import StarRating from "../UI/StarRating";
import ErrorMessage from "../Error/ErrorMessage";
import Spinner from "../Loading/Spinner";

/**
 * Displays live Google rating + recent reviews for a selected branch.
 * The backend fetches these from the official Places API on demand and
 * never stores them — this component simply renders whatever it gets back.
 */
const GoogleReviews = ({ branchId }) => {
  const { data, loading, error } = useFetch(
    () => (branchId ? branchService.getGoogleReviews(branchId) : Promise.resolve({ data: null })),
    [branchId]
  );

  if (!branchId) {
    return <p className="text-center text-charcoal-400">Select a branch to see its Google reviews.</p>;
  }

  if (loading) return <Spinner fullScreen />;

  if (error) {
    return (
      <ErrorMessage message="Google reviews aren't available for this branch right now." />
    );
  }

  if (!data) return null;

  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-md sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <FcGoogle size={32} />
          <div>
            <p className="font-display text-2xl font-bold text-charcoal-900">
              {data.rating?.toFixed(1) || "N/A"}{" "}
              <span className="text-sm font-normal text-charcoal-400">/ 5</span>
            </p>
            <StarRating rating={data.rating || 0} />
            <p className="mt-1 text-xs text-charcoal-400">{data.totalReviews} Google reviews</p>
          </div>
        </div>
        {data.writeReviewUrl && (
          <a
            href={data.writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !py-2 !px-5 text-sm"
          >
            Write a Google Review <FiExternalLink size={14} />
          </a>
        )}
      </div>

      {data.reviews?.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {data.reviews.map((review, index) => (
            <div key={index} className="card-premium p-5">
              <div className="flex items-center gap-3">
                {review.reviewerPhoto ? (
                  <img
                    src={review.reviewerPhoto}
                    alt={review.reviewerName}
                    className="h-10 w-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-100 text-sm font-semibold text-charcoal-500">
                    {review.reviewerName?.[0] || "G"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-charcoal-900">{review.reviewerName}</p>
                  <p className="text-xs text-charcoal-400">{review.relativeTime}</p>
                </div>
              </div>
              <StarRating rating={review.rating} size={14} />
              {review.text && <p className="mt-2 text-sm text-charcoal-600 line-clamp-4">{review.text}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleReviews;
