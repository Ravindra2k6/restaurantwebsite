import SEO from "../../components/SEO/SEO";
import PageHeader from "../../components/UI/PageHeader";
import BranchCard from "../../components/BranchCard/BranchCard";
import { CardSkeletonGrid } from "../../components/Loading/Skeletons";
import ErrorMessage from "../../components/Error/ErrorMessage";
import useFetch from "../../hooks/useFetch";
import branchService from "../../services/branchService";
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from "../../utils/schemas";

const Branches = () => {
  const { data: branches, loading, error, refetch } = useFetch(
    () => branchService.getAll({ active: true }),
    []
  );

  const structuredData = [
    buildBreadcrumbSchema([
      { label: "Home", path: "/" },
      { label: "Branches", path: "/branches" },
    ]),
    ...(branches || []).map(buildLocalBusinessSchema),
  ];

  return (
    <>
      <SEO
        title="Our Branches"
        description="Find a Bhojanams & Biryanis branch near you — addresses, phone numbers, opening hours, facilities and directions."
        url="/branches"
        structuredData={structuredData}
      />
      <PageHeader
        eyebrow="Visit Us"
        title="Our Branches"
        subtitle="Every location, same commitment to great food and warm hospitality."
      />

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading && <CardSkeletonGrid count={6} />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && branches?.length === 0 && (
            <p className="text-center text-charcoal-400">
              Branch information will be available here shortly.
            </p>
          )}
          {!loading && !error && branches?.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((branch) => (
                <BranchCard key={branch._id} branch={branch} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Branches;
