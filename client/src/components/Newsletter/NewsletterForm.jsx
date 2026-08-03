import { useState } from "react";
import { FiSend } from "react-icons/fi";
import newsletterService from "../../services/newsletterService";
import { useToast } from "../../context/ToastContext";

/**
 * `variant="dark"` is used inside the dark Footer background;
 * `variant="light"` (default) is used on light sections of the homepage.
 */
const NewsletterForm = ({ variant = "light" }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const res = await newsletterService.subscribe(email.trim());
      showToast(res.message || "Subscribed successfully!", "success");
      setEmail("");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const isDark = variant === "dark";

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2" noValidate>
      <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-email-${variant}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className={`w-full rounded-full px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary-500 ${
          isDark
            ? "bg-white/10 text-white placeholder:text-charcoal-400 border border-white/20"
            : "bg-white text-charcoal-900 placeholder:text-charcoal-400 border border-charcoal-200"
        }`}
      />
      <button
        type="submit"
        disabled={submitting}
        aria-label="Subscribe"
        className="flex shrink-0 items-center justify-center rounded-full bg-gold-gradient p-2.5 text-charcoal-900 shadow-gold transition-transform hover:scale-105 disabled:opacity-60"
      >
        <FiSend size={18} />
      </button>
    </form>
  );
};

export default NewsletterForm;
