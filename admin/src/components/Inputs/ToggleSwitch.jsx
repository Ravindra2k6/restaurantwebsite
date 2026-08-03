import { forwardRef } from "react";

/**
 * Styled as a toggle switch rather than a native checkbox — used for
 * boolean flags like isAvailable, isPopular, isFeatured, isActive.
 */
const ToggleSwitch = forwardRef(({ label, className = "", ...props }, ref) => (
  <label className={`flex cursor-pointer items-center gap-3 ${className}`}>
    <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span className="absolute inset-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary-500 dark:bg-slate-700" />
      <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
    </span>
    {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
  </label>
));

ToggleSwitch.displayName = "ToggleSwitch";

export default ToggleSwitch;
