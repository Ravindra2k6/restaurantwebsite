import { motion } from "framer-motion";

/**
 * Single KPI card for the dashboard grid (Total Menu Items, Reservations,
 * Reviews, etc.). `accent` picks the icon's color theme.
 */
const StatCard = ({ label, value, icon: Icon, accent = "primary", suffix = "", index = 0 }) => {
  const accentClasses = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="admin-card flex items-center gap-4 p-5"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accentClasses}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 font-display text-2xl font-bold text-slate-900 dark:text-white">
          {value}
          {suffix}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
