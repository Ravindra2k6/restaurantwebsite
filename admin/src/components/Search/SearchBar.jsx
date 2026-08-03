import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({ value, onChange, placeholder = "Search...", className = "" }) => (
  <div className={`relative ${className}`}>
    <FiSearch
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      size={16}
    />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-input w-full pl-9 pr-8"
      aria-label={placeholder}
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        aria-label="Clear search"
      >
        <FiX size={16} />
      </button>
    )}
  </div>
);

export default SearchBar;
