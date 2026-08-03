import { Link } from "react-router-dom";
import {
  FiUsers,
  FiBook,
  FiTag,
  FiMapPin,
  FiCalendar,
  FiStar,
  FiImage,
  FiPercent,
  FiMail,
  FiPlus,
} from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import dashboardService from "../../services/dashboardService";
import reservationService from "../../services/reservationService";
import reviewService from "../../services/reviewService";
import StatCard from "../../components/DashboardCards/StatCard";
import LineChart from "../../components/Charts/LineChart";
import DoughnutChart from "../../components/Charts/DoughnutChart";
import StatusBadge from "../../components/Tables/StatusBadge";
import PageLoader from "../../components/Loader/Loader";
import ErrorState from "../../components/Loader/ErrorState";
import { formatDateTime, timeAgo } from "../../utils/formatters";

const QUICK_ACTIONS = [
  { label: "Add Menu Item", path: "/menu", icon: FiBook },
  { label: "Add Branch", path: "/branches", icon: FiMapPin },
  { label: "Add Offer", path: "/offers", icon: FiPercent },
  { label: "Upload Photos", path: "/gallery", icon: FiImage },
];

const Dashboard = () => {
  const { data: summary, loading, error, refetch } = useFetch(
    () => dashboardService.getSummary(),
    []
  );
  const { data: trend } = useFetch(() => dashboardService.getVisitorTrend(14), []);
  const { data: recentReservations } = useFetch(
    () => reservationService.getAll({ limit: 5 }),
    []
  );
  const { data: recentReviews } = useFetch(
    () => reviewService.getAllAdmin({ limit: 5, status: "pending" }),
    []
  );

  if (loading) return <PageLoader label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const trendPoints = (trend || []).map((t) => ({
    label: new Date(t._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    value: t.count,
  }));

  const reservationBreakdown = summary
    ? [
        { label: "Pending", value: summary.reservations.pending },
        { label: "Other", value: summary.reservations.total - summary.reservations.pending },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Visitors (30 days)"
          value={summary.visitors.last30Days}
          icon={FiUsers}
          accent="blue"
          index={0}
        />
        <StatCard label="Menu Items" value={summary.menu.totalItems} icon={FiBook} index={1} />
        <StatCard
          label="Categories"
          value={summary.menu.totalCategories}
          icon={FiTag}
          accent="purple"
          index={2}
        />
        <StatCard label="Branches" value={summary.branches} icon={FiMapPin} accent="green" index={3} />
        <StatCard
          label="Reservations"
          value={summary.reservations.total}
          suffix={summary.reservations.pending ? ` (${summary.reservations.pending} pending)` : ""}
          icon={FiCalendar}
          accent="amber"
          index={4}
        />
        <StatCard
          label="Reviews"
          value={summary.reviews.total}
          suffix={summary.reviews.pending ? ` (${summary.reviews.pending} pending)` : ""}
          icon={FiStar}
          accent="amber"
          index={5}
        />
        <StatCard label="Gallery Images" value={summary.gallery} icon={FiImage} accent="purple" index={6} />
        <StatCard label="Active Offers" value={summary.activeOffers} icon={FiPercent} accent="green" index={7} />
        <StatCard
          label="Contact Messages"
          value={summary.contactMessages.total}
          suffix={summary.contactMessages.new ? ` (${summary.contactMessages.new} new)` : ""}
          icon={FiMail}
          accent="red"
          index={8}
        />
        <StatCard
          label="Newsletter Subscribers"
          value={summary.newsletterSubscribers}
          icon={FiUsers}
          accent="blue"
          index={9}
        />
        <StatCard label="Open Jobs" value={summary.careers.activeJobs} icon={FiBook} index={10} />
        <StatCard
          label="Job Applications"
          value={summary.careers.totalApplications}
          icon={FiUsers}
          accent="purple"
          index={11}
        />
      </div>

      {/* Quick actions */}
      <div className="admin-card p-5">
        <h2 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300"
            >
              <FiPlus size={15} /> {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="admin-card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">
            Visitor Trend (Last 14 Days)
          </h2>
          {trendPoints.length > 0 ? (
            <LineChart points={trendPoints} label="Visitors" />
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">
              Not enough visitor data yet — this fills in as the public site gets traffic.
            </p>
          )}
        </div>
        <div className="admin-card p-5">
          <h2 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">
            Reservations Snapshot
          </h2>
          {summary.reservations.total > 0 ? (
            <DoughnutChart points={reservationBreakdown} />
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">No reservations yet.</p>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Latest Reservations
            </h2>
            <Link to="/reservations" className="text-xs font-semibold text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentReservations?.length ? (
              recentReservations.map((r) => (
                <div key={r._id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{r.name}</p>
                    <p className="text-xs text-slate-400">
                      {r.partySize} guests · {formatDateTime(r.reservationDate)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">No reservations yet.</p>
            )}
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Pending Reviews
            </h2>
            <Link to="/reviews" className="text-xs font-semibold text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentReviews?.length ? (
              recentReviews.map((rev) => (
                <div key={rev._id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{rev.name}</p>
                    <p className="text-xs text-slate-400">
                      {rev.rating}★ · {timeAgo(rev.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={rev.status} />
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">No pending reviews.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
