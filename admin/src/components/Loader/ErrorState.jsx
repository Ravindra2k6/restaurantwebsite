import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div role="alert" className="flex flex-col items-center justify-center gap-3 py-6 text-center">
    <FiAlertTriangle className="text-red-500" size={28} />
    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary text-xs">
        <FiRefreshCw size={14} /> Try again
      </button>
    )}
  </div>
);

export default ErrorState;
