import { useMemo } from "react";
import { FiInfo } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import dashboardService from "../../services/dashboardService";
import reservationService from "../../services/reservationService";
import reviewService from "../../services/reviewService";
import menuService from "../../services/menuService";
import LineChart from "../../components/Charts/LineChart";
import BarChart from "../../components/Charts/BarChart";
import DoughnutChart from "../../components/Charts/DoughnutChart";
import PageLoader from "../../components/Loader/Loader";

const Analytics = () => {
  const { data: trend, loading: trendLoading } = useFetch(() => dashboardService.getVisitorTrend(30), []);
  const { data: reservations, loading: resLoading } = useFetch(
    () => reservationService.getAll({ limit: 500 }),
    []
  );
  const { data: reviews, loading: reviewLoading } = useFetch(
    () => reviewService.getAllAdmin({ limit: 500 }),
    []
  );
  const { data: popularItems, loading: menuLoading } = useFetch(
    () => menuService.getAll({ popular: true, limit: 8 }),
    []
  );

  const trendPoints = useMemo(
    () =>
      (trend || []).map((t) => ({
        label: new Date(t._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        value: t.count,
      })),
    [trend]
  );

  const reservationsByStatus = useMemo(() => {
    if (!reservations) return [];
    const counts = {};
    reservations.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [reservations]);

  const reservationsByBranch = useMemo(() => {
    if (!reservations) return [];
    const counts = {};
    reservations.forEach((r) => {
      const name = r.branch?.branchName || "Unknown";
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [reservations]);

  const reviewsByRating = useMemo(() => {
    if (!reviews) return [];
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label: `${label}★`, value }));
  }, [reviews]);

  const popularItemPoints = useMemo(
    () => (popularItems || []).map((item) => ({ label: item.name, value: 1 })),
    [popularItems]
  );

  const isLoading = trendLoading || resLoading || reviewLoading || menuLoading;
  if (isLoading) return <PageLoader label="Crunching analytics..." />;

  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <h2 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">
          Website Visitors (Last 30 Days)
        </h2>
        {trendPoints.length > 0 ? (
          <LineChart points={trendPoints} label="Visitors" />
        ) : (
          <p className="py-16 text-center text-sm text-slate-400">Not enough visitor data yet.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <h2 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">
            Reservations by Status
          </h2>
          {reservationsByStatus.length ? (
            <DoughnutChart points={reservationsByStatus} />
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">No reservations yet.</p>
          )}
        </div>
        <div className="admin-card p-5">
          <h2 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">
            Reservations by Branch
          </h2>
          {reservationsByBranch.length ? (
            <BarChart points={reservationsByBranch} label="Reservations" horizontal />
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">No reservations yet.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <h2 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">
            Review Rating Distribution
          </h2>
          {reviewsByRating.some((r) => r.value > 0) ? (
            <BarChart points={reviewsByRating} label="Reviews" />
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">No reviews yet.</p>
          )}
        </div>
        <div className="admin-card p-5">
          <h2 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">
            Popular Menu Items
          </h2>
          {popularItemPoints.length ? (
            <BarChart points={popularItemPoints} label="Marked Popular" horizontal />
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">
              No items marked "Popular" yet -- do this from the Menu page.
            </p>
          )}
        </div>
      </div>

      <div className="admin-card flex gap-3 p-5 text-sm text-slate-600 dark:text-slate-300">
        <FiInfo className="mt-0.5 shrink-0 text-primary-500" size={18} />
        <p>
          <strong>Most Viewed Pages</strong> isn't broken out here yet -- the backend's Visit
          model does record the page path per visit, but there's no aggregation endpoint exposing
          a per-path breakdown yet (only total + daily trend). Add a `/dashboard/top-pages` route
          to the backend to light this up, or connect Google Analytics using the ID field on the
          SEO page in the meantime -- the public site is already wired to read it once configured.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
