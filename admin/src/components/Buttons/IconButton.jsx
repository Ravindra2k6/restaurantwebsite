/**
 * Compact icon-only button for table row actions. Always requires a
 * `label` even though it's visually hidden, so screen readers announce
 * what the button does (accessibility requirement).
 */
const IconButton = ({ icon: Icon, label, variant = "default", onClick, ...props }) => {
  const variantClass =
    variant === "danger"
      ? "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
      : variant === "primary"
      ? "hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10"
      : "hover:bg-slate-100 dark:hover:bg-slate-800";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors dark:text-slate-400 ${variantClass}`}
      {...props}
    >
      <Icon size={16} />
    </button>
  );
};

export default IconButton;
