/**
 * Professional shimmer-style skeleton loaders. Used everywhere data is
 * fetched (menu grid, gallery, branches, reviews) so the layout doesn't
 * jump once real content arrives.
 */

const shimmer = "animate-pulse bg-charcoal-100";

export const CardSkeleton = () => (
  <div className="card-premium">
    <div className={`h-48 w-full ${shimmer}`} />
    <div className="p-4 space-y-3">
      <div className={`h-4 w-3/4 rounded ${shimmer}`} />
      <div className={`h-3 w-1/2 rounded ${shimmer}`} />
      <div className={`h-3 w-1/4 rounded ${shimmer}`} />
    </div>
  </div>
);

export const CardSkeletonGrid = ({ count = 6, columns = "sm:grid-cols-2 lg:grid-cols-3" }) => (
  <div className={`grid grid-cols-1 ${columns} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const TextLineSkeleton = ({ width = "w-full" }) => (
  <div className={`h-4 rounded ${shimmer} ${width}`} />
);

export const AvatarSkeleton = () => <div className={`h-12 w-12 rounded-full ${shimmer}`} />;
