import { FiUser } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import reviewService from "../../services/reviewService";
import StarRating from "../UI/StarRating";
import { CardSkeletonGrid } from "../Loading/Skeletons";
import ErrorMessage from "../Error/ErrorMessage";
import { formatDate } from "../../utils/formatters";

const WebsiteReviews = () => {
  const { data: reviews, meta, loading, error, refetch } = useFetch(
    () => reviewService.getApproved({ limit: 20 }),
    []
  );

  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-md sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-2xl font-bold text-charcoal-900">
            {meta?.averageRating || "N/A"} <span className="text-sm font-normal text-charcoal-400">/ 5</span>
          </p>
          <StarRating rating={meta?.averageRating || 0} />
          <p className="mt-1 text-xs text-charcoal-400">{meta?.totalApproved || 0} website reviews</p>
        </div>
      </div>

      {loading && <CardSkeletonGrid count={4} columns="sm:grid-cols-2" />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && reviews?.length === 0 && (
        <p className="text-center text-charcoal-400">Be the first to leave a review!</p>
      )}

      {!loading && !error && reviews?.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {reviews.map((review) => (
            <div key={review._id} className="card-premium p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                    <p className="text-xs text-charcoal-400">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={14} />
              </div>
              {review.title && <p className="mt-3 font-semibold text-charcoal-800">{review.title}</p>}
              <p className="mt-1 text-sm text-charcoal-600">{review.comment}</p>
              {review.adminReply?.message && (
                <div className="mt-3 rounded-lg bg-charcoal-50 p-3 text-xs text-charcoal-500">
                  <span className="font-semibold text-charcoal-700">Response from the team: </span>
                  {review.adminReply.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebsiteReviews;
