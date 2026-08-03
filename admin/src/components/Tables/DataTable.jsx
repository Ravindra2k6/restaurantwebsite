import TableSkeleton from "../Loader/TableSkeleton";
import ErrorState from "../Loader/ErrorState";

/**
 * Generic, headless-ish data table. Pass `columns` as
 * [{ key, label, render?: (row) => node, className? }] and `data` as the
 * raw array from the API — used by every management page (Menu, Branches,
 * Reviews, Reservations, etc.) so table markup is never duplicated.
 */
const DataTable = ({
  columns,
  data,
  loading,
  error,
  onRetry,
  emptyMessage = "No records found.",
  keyField = "_id",
}) => {
  if (loading) {
    return (
      <div className="admin-card overflow-hidden">
        <TableSkeleton columns={columns.length} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card p-6">
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="admin-card flex items-center justify-center p-12">
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="admin-card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
            {columns.map((col) => (
              <th key={col.key} className={`whitespace-nowrap px-4 py-3.5 font-semibold ${col.className || ""}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row[keyField]}
              className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3.5 align-middle ${col.className || ""}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
