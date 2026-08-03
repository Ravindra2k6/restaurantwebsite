import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

/**
 * Shown whenever a service call fails. Gives the user a plain-language
 * message and, if a retry handler is provided, a button to try again —
 * rather than leaving them looking at a blank section.
 */
const ErrorMessage = ({ message = "Something went wrong.", onRetry }) => (
  <div
    role="alert"
    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center"
  >
    <FiAlertTriangle className="text-red-500" size={32} />
    <p className="text-charcoal-700 font-medium">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-1 inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-charcoal-700"
      >
        <FiRefreshCw size={16} /> Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
