import useFetch from "../../hooks/useFetch";
import menuService from "../../services/menuService";
import SectionHeading from "../UI/SectionHeading";
import MenuItemCard from "../UI/MenuItemCard";
import { CardSkeletonGrid } from "../Loading/Skeletons";
import ErrorMessage from "../Error/ErrorMessage";

const TodaysSpecial = () => {
  const { data: specials, loading, error, refetch } = useFetch(
    () => menuService.getAll({ todaysSpecial: true, limit: 3 }),
    []
  );

  // If nothing is marked as today's special yet, this section quietly
  // doesn't render rather than showing an empty block on a live site.
  if (!loading && !error && specials?.length === 0) return null;

  return (
    <section className="bg-charcoal-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Fresh Today"
          title={<span className="text-white">Today's Special</span>}
          subtitle="A rotating selection our chefs are especially proud of today."
        />
        <div className="mt-12">
          {loading && <CardSkeletonGrid count={3} columns="sm:grid-cols-2 lg:grid-cols-3" />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && specials?.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {specials.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TodaysSpecial;
