import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import menuService from "../../services/menuService";
import SectionHeading from "../UI/SectionHeading";
import MenuItemCard from "../UI/MenuItemCard";
import { CardSkeletonGrid } from "../Loading/Skeletons";
import ErrorMessage from "../Error/ErrorMessage";

const FeaturedDishes = () => {
  const { data: dishes, loading, error, refetch } = useFetch(
    () => menuService.getAll({ popular: true, limit: 6 }),
    []
  );

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Fan Favorites"
          title="Featured Dishes"
          subtitle="The dishes our guests keep coming back for — hand-picked from every category on our menu."
        />

        <div className="mt-12">
          {loading && <CardSkeletonGrid count={6} />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && dishes?.length === 0 && (
            <p className="text-center text-charcoal-400">
              Featured dishes will appear here once they're added in the admin panel.
            </p>
          )}
          {!loading && !error && dishes?.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700"
          >
            View Full Menu <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDishes;
