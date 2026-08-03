import { forwardRef } from "react";

const TextArea = forwardRef(({ label, error, rows = 4, className = "", ...props }, ref) => (
  <div className={className}>
    {label && (
      <label htmlFor={props.id || props.name} className="form-label">
        {label}
      </label>
    )}
    <textarea ref={ref} id={props.id || props.name} rows={rows} className="form-input" {...props} />
    {error && <p className="form-error">{error.message}</p>}
  </div>
));

TextArea.displayName = "TextArea";

export default TextArea;
