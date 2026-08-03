const TableSkeleton = ({ rows = 6, columns = 5 }) => (
  <div className="w-full animate-pulse">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 border-b border-slate-100 px-4 py-4 dark:border-slate-800">
        {Array.from({ length: columns }).map((_, c) => (
          <div key={c} className="h-4 flex-1 rounded bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeletonGrid = ({ count = 10 }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="aspect-square animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
    ))}
  </div>
);

export default TableSkeleton;
