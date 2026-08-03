import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import branchService from "../../services/branchService";
import SectionHeading from "../UI/SectionHeading";
import BranchCard from "./BranchCard";
import { CardSkeletonGrid } from "../Loading/Skeletons";
import ErrorMessage from "../Error/ErrorMessage";

const BranchesPreview = () => {
  const { data: branches, loading, error, refetch } = useFetch(
    () => branchService.getAll({ active: true }),
    []
  );

  return (
    <section className="bg-charcoal-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Find Us"
          title={<span className="text-white">Our Branches</span>}
          subtitle="Visit us at any of our locations across the city."
        />

        <div className="mt-12">
          {loading && <CardSkeletonGrid count={3} />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && branches?.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {branches.slice(0, 3).map((branch) => (
                <BranchCard key={branch._id} branch={branch} />
              ))}
            </div>
          )}
        </div>

        {branches?.length > 3 && (
          <div className="mt-10 text-center">
            <Link
              to="/branches"
              className="inline-flex items-center gap-2 font-semibold text-primary-400 hover:text-primary-300"
            >
              View All Branches <FiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BranchesPreview;
