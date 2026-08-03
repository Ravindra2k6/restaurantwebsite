/**
 * Small inline spinner — used inside buttons, table loading rows, etc.
 */
export const Spinner = ({ size = 20, className = "" }) => (
  <div
    className={`animate-spin rounded-full border-2 border-slate-200 border-t-primary-500 dark:border-slate-700 ${className}`}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  />
);

/**
 * Full-page loader shown while the auth session is being restored on app
 * boot, or while a page-level fetch is in flight.
 */
const PageLoader = ({ label = "Loading..." }) => (
  <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3">
    <Spinner size={36} />
    <p className="text-sm text-slate-400">{label}</p>
  </div>
);

export default PageLoader;
