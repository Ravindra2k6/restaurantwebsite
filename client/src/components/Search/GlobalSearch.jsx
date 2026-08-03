import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiX, FiMapPin, FiImage } from "react-icons/fi";
import useDebounce from "../../hooks/useDebounce";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import searchService from "../../services/searchService";
import { formatMenuPrice } from "../../utils/formatters";

/**
 * Site-wide search with a live autocomplete dropdown, grouped by result
 * type (menu / branches / gallery). Debounced to avoid firing a request on
 * every keystroke.
 */
const GlobalSearch = ({ onClose, variant = "light" }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 350);

  useOnClickOutside(containerRef, () => setOpen(false));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      setOpen(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchService
      .global(debouncedQuery)
      .then((res) => {
        if (!cancelled) {
          setResults(res.data);
          setOpen(true);
        }
      })
      .catch(() => {
        if (!cancelled) setResults(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const goTo = (path) => {
    navigate(path);
    setQuery("");
    setOpen(false);
    onClose?.();
  };

  const isDark = variant === "dark";

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div
        className={`flex items-center gap-2 rounded-full border px-4 py-2.5 ${
          isDark
            ? "border-white/30 bg-white/10 text-white"
            : "border-charcoal-200 bg-white text-charcoal-900"
        }`}
      >
        <FiSearch size={16} className={isDark ? "text-white/70" : "text-charcoal-400"} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setOpen(true)}
          placeholder="Search dishes, branches, photos..."
          className={`w-full bg-transparent text-sm outline-none ${
            isDark ? "placeholder:text-white/60" : "placeholder:text-charcoal-400"
          }`}
          aria-label="Global search"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
            }}
            aria-label="Clear search"
            className={isDark ? "text-white/70" : "text-charcoal-400"}
          >
            <FiX size={16} />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close search"
            className={isDark ? "text-white/70" : "text-charcoal-400"}
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl bg-white p-2 text-charcoal-900 shadow-2xl"
            role="listbox"
          >
            {loading && <p className="px-3 py-4 text-center text-sm text-charcoal-400">Searching...</p>}

            {!loading && results?.totalResults === 0 && (
              <p className="px-3 py-4 text-center text-sm text-charcoal-400">
                No results for "{debouncedQuery}"
              </p>
            )}

            {!loading && results?.menu?.length > 0 && (
              <div className="mb-2">
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-400">
                  Menu
                </p>
                {results.menu.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => goTo(`/menu?item=${item.slug}`)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-charcoal-50"
                  >
                    {item.images?.[0]?.url ? (
                      <img src={item.images[0].url} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    ) : (
                      <div className="h-9 w-9 rounded-lg bg-charcoal-100" />
                    )}
                    <span className="flex-1 truncate text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-primary-600">{formatMenuPrice(item)}</span>
                  </button>
                ))}
              </div>
            )}

            {!loading && results?.branches?.length > 0 && (
              <div className="mb-2">
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-400">
                  Branches
                </p>
                {results.branches.map((branch) => (
                  <button
                    key={branch._id}
                    onClick={() => goTo("/branches")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-charcoal-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal-100 text-charcoal-400">
                      <FiMapPin size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{branch.branchName}</p>
                      <p className="truncate text-xs text-charcoal-400">{branch.address?.city}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && results?.gallery?.length > 0 && (
              <div>
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-400">
                  Gallery
                </p>
                {results.gallery.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => goTo("/gallery")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-charcoal-50"
                  >
                    {item.image?.url ? (
                      <img src={item.image.url} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal-100 text-charcoal-400">
                        <FiImage size={15} />
                      </div>
                    )}
                    <span className="truncate text-sm font-medium">{item.title || "Photo"}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
