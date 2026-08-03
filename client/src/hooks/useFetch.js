import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Generic fetch hook: calls `fetcher` (an async function, typically a
 * service call) whenever `deps` changes, tracking loading/error/data state.
 * Guards against setting state after unmount (e.g. fast route changes).
 *
 * Usage:
 *   const { data, loading, error } = useFetch(() => menuService.getAll({ category }), [category]);
 */
const useFetch = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcher();
      if (isMounted.current) {
        setData(response?.data ?? null);
        setMeta(response?.meta ?? null);
      }
    } catch (err) {
      if (isMounted.current) setError(err.message || "Failed to load data");
    } finally {
      if (isMounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    isMounted.current = true;
    load();
    return () => {
      isMounted.current = false;
    };
  }, [load]);

  return { data, meta, loading, error, refetch: load };
};

export default useFetch;
