import { Spinner } from "../Loader/Loader";

const VARIANT_CLASSES = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
};

/**
 * Standard button used across every form and toolbar in the admin panel.
 * Handles a loading state (disables + shows spinner) so every async action
 * gets consistent feedback without repeating the logic per page.
 */
const Button = ({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  icon: Icon,
  className = "",
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`${VARIANT_CLASSES[variant]} ${className}`}
    {...props}
  >
    {loading ? <Spinner size={16} /> : Icon && <Icon size={16} />}
    {children}
  </button>
);

export default Button;
