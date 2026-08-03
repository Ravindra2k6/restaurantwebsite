/**
 * Simple centered spinner — used for full-page or section-level loading
 * states where a skeleton isn't a good fit (e.g. form submission).
 */
const Spinner = ({ size = 40, fullScreen = false }) => {
  const spinner = (
    <div
      className="animate-spin rounded-full border-4 border-charcoal-100 border-t-primary-500"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );

  if (!fullScreen) return spinner;

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">{spinner}</div>
  );
};

export default Spinner;
