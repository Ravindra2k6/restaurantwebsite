const STATUS_COLORS = {
  // Reservations
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  confirmed: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  seated: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  completed: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  "no-show": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",

  // Reviews
  approved: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  rejected: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",

  // Contact messages
  new: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  "in-progress": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  resolved: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  spam: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",

  // Applications
  received: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  reviewing: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  shortlisted: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  hired: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
};

const StatusBadge = ({ status }) => (
  <span className={`badge capitalize ${STATUS_COLORS[status] || "bg-slate-100 text-slate-600"}`}>
    {status?.replace("-", " ")}
  </span>
);

export default StatusBadge;
