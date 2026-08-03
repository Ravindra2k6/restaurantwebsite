import { useState } from "react";
import { FiStar, FiCheckCircle } from "react-icons/fi";
import reviewService from "../../services/reviewService";
import { useToast } from "../../context/ToastContext";

const inputClass =
  "w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 text-sm text-charcoal-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30";
const labelClass = "mb-1.5 block text-sm font-semibold text-charcoal-700";

const WriteReviewForm = ({ onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      showToast("Please select a star rating", "error");
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.submit({ ...form, rating });
      setSubmitted(true);
      setForm({ name: "", email: "", title: "", comment: "" });
      setRating(0);
      onSubmitted?.();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
        <FiCheckCircle className="mx-auto mb-3 text-green-500" size={44} />
        <h3 className="font-display text-lg font-bold text-charcoal-900">Thank You!</h3>
        <p className="mt-2 text-sm text-charcoal-500">
          Your review has been submitted and will appear here once approved by our team.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-secondary mt-5 text-sm">
          Write Another Review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-xl sm:p-8" noValidate>
      <h3 className="mb-5 font-display text-xl font-bold text-charcoal-900">Write a Review</h3>

      <div>
        <label className={labelClass}>Your Rating *</label>
        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <FiStar
                size={28}
                className={
                  star <= (hoverRating || rating)
                    ? "fill-primary-500 text-primary-500"
                    : "text-charcoal-200"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="review-name" className={labelClass}>
            Name *
          </label>
          <input
            id="review-name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="review-email" className={labelClass}>
            Email (optional)
          </label>
          <input
            id="review-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="review-title" className={labelClass}>
          Review Title (optional)
        </label>
        <input
          id="review-title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className={inputClass}
          placeholder="Sum up your experience"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="review-comment" className={labelClass}>
          Your Review *
        </label>
        <textarea
          id="review-comment"
          name="comment"
          rows={4}
          required
          value={form.comment}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default WriteReviewForm;
