import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import MenuItemCard from "../../components/UI/MenuItemCard";
import { CardSkeletonGrid } from "../../components/Loading/Skeletons";
import ErrorMessage from "../../components/Error/ErrorMessage";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import menuService from "../../services/menuService";
import categoryService from "../../services/categoryService";
import { FOOD_TYPE_FILTERS } from "../../utils/constants";
import { buildBreadcrumbSchema } from "../../utils/schemas";

const Menu = () => {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [foodType, setFoodType] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const { data: categories } = useFetch(() => categoryService.getAll({ limit: 50 }), []);

  const {
    data: items,
    meta,
    loading,
    error,
    refetch,
  } = useFetch(
    () =>
      menuService.getAll({
        search: debouncedSearch || undefined,
        category: categoryId || undefined,
        foodType: foodType || undefined,
        page,
        limit: 12,
      }),
    [debouncedSearch, categoryId, foodType, page]
  );

  const resetFilters = () => {
    setSearch("");
    setCategoryId("");
    setFoodType("");
    setPage(1);
  };

  return (
    <>
      <SEO
        title="Menu"
        description="Explore the full menu at Bhojanams & Biryanis — biryanis, starters, Chinese, curries, breads, desserts and more."
        url="/menu"
        structuredData={buildBreadcrumbSchema([
          { label: "Home", path: "/" },
          { label: "Menu", path: "/menu" },
        ])}
      />
      <PageHeader
        eyebrow="Explore"
        title="Our Menu"
        subtitle="From sizzling starters to slow-cooked biryanis — find your next favorite dish."
      />

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search + filters */}
          <div className="mb-10 space-y-4">
            <div className="relative mx-auto max-w-xl">
              <FiSearch
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400"
                size={18}
              />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search dishes (e.g. biryani, paneer, prawns)..."
                className="w-full rounded-full border border-charcoal-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                aria-label="Search menu"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {FOOD_TYPE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => {
                    setFoodType(f.value);
                    setPage(1);
                  }}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    foodType === f.value
                      ? "bg-charcoal-900 text-white"
                      : "bg-white text-charcoal-600 border border-charcoal-200 hover:border-charcoal-400"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => {
                  setCategoryId("");
                  setPage(1);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  categoryId === ""
                    ? "bg-primary-500 text-white"
                    : "bg-white text-charcoal-500 border border-charcoal-200 hover:border-primary-400"
                }`}
              >
                All Categories
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setCategoryId(cat._id);
                    setPage(1);
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    categoryId === cat._id
                      ? "bg-primary-500 text-white"
                      : "bg-white text-charcoal-500 border border-charcoal-200 hover:border-primary-400"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading && <CardSkeletonGrid count={9} columns="sm:grid-cols-2 lg:grid-cols-3" />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && items?.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-charcoal-400">No dishes match your filters.</p>
              <button onClick={resetFilters} className="btn-secondary mt-4 text-sm">
                Clear Filters
              </button>
            </div>
          )}
          {!loading && !error && items?.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <MenuItemCard key={item._id} item={item} />
                ))}
              </div>

              {meta?.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-charcoal-500">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Menu;
