import useFetch from "../../hooks/useFetch";
import menuService from "../../services/menuService";
import SectionHeading from "../UI/SectionHeading";
import MenuItemCard from "../UI/MenuItemCard";
import { CardSkeletonGrid } from "../Loading/Skeletons";
import ErrorMessage from "../Error/ErrorMessage";

const ChefSpecial = () => {
  const { data: items, loading, error, refetch } = useFetch(
    () => menuService.getAll({ chefRecommended: true, limit: 3 }),
    []
  );

  if (!loading && !error && items?.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Chef's Table"
          title="Chef Recommendations"
          subtitle="Signature dishes our head chef personally recommends for the full experience."
        />
        <div className="mt-12">
          {loading && <CardSkeletonGrid count={3} />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && items?.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChefSpecial;
