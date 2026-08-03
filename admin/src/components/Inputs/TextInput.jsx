import { forwardRef } from "react";

/**
 * Forwards its ref so it works directly with react-hook-form's `register()`:
 *   <TextInput label="Name" {...register("name")} error={errors.name} />
 */
const TextInput = forwardRef(({ label, error, hint, className = "", ...props }, ref) => (
  <div className={className}>
    {label && (
      <label htmlFor={props.id || props.name} className="form-label">
        {label}
      </label>
    )}
    <input ref={ref} id={props.id || props.name} className="form-input" {...props} />
    {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    {error && <p className="form-error">{error.message}</p>}
  </div>
));

TextInput.displayName = "TextInput";

export default TextInput;
