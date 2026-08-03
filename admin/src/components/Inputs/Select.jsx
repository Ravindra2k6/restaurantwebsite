import { forwardRef } from "react";

/**
 * `options` accepts either an array of strings or an array of
 * `{ value, label }` objects.
 */
const Select = forwardRef(
  ({ label, error, options = [], placeholder = "Select...", className = "", ...props }, ref) => (
    <div className={className}>
      {label && (
        <label htmlFor={props.id || props.name} className="form-label">
          {label}
        </label>
      )}
      <select ref={ref} id={props.id || props.name} className="form-input" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const label = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {error && <p className="form-error">{error.message}</p>}
    </div>
  )
);

Select.displayName = "Select";

export default Select;
