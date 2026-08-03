/**
 * Horizontal wrapper for a row of table filters (status, category, food
 * type, etc.) sitting alongside the SearchBar in a table toolbar.
 */
export const FilterBar = ({ children }) => (
  <div className="flex flex-wrap items-center gap-3">{children}</div>
);

/**
 * A single filter dropdown. Kept intentionally simpler than the shared
 * <Select> (no react-hook-form wiring needed) since filters are controlled
 * directly by page-level useState rather than a form.
 */
export const FilterSelect = ({ value, onChange, options, placeholder = "All", className = "" }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`form-input !w-auto ${className}`}
  >
    <option value="">{placeholder}</option>
    {options.map((opt) => {
      const val = typeof opt === "string" ? opt : opt.value;
      const label = typeof opt === "string" ? opt : opt.label;
      return (
        <option key={val} value={val}>
          {label}
        </option>
      );
    })}
  </select>
);
