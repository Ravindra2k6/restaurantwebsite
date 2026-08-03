import { Link } from "react-router-dom";
import { FiCalendar, FiStar, FiMail, FiInfo } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import reservationService from "../../services/reservationService";
import reviewService from "../../services/reviewService";
import contactService from "../../services/contactService";
import PageLoader from "../../components/Loader/Loader";
import { timeAgo } from "../../utils/formatters";

/**
 * Phase 1's backend does not persist a dedicated Notification collection,
 * so rather than fabricate one, this page assembles a live "needs your
 * attention" feed directly from the same pending-status records already
 * exposed by the Reservations, Reviews, and Contact APIs. Each item deep
 * links to where it can actually be actioned.
 */
const Notifications = () => {
  const { data: pendingReservations, loading: l1 } = useFetch(
    () => reservationService.getAll({ status: "pending", limit: 10 }),
    []
  );
  const { data: pendingReviews, loading: l2 } = useFetch(
    () => reviewService.getAllAdmin({ status: "pending", limit: 10 }),
    []
  );
  const { data: newMessages, loading: l3 } = useFetch(
    () => contactService.getAll({ status: "new", limit: 10 }),
    []
  );

  if (l1 || l2 || l3) return <PageLoader />;

  const items = [
    ...(pendingReservations || []).map((r) => ({
      id: `res-${r._id}`,
      icon: FiCalendar,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
      title: `New reservation request from ${r.name}`,
      subtitle: `${r.partySize} guests · ${r.branch?.branchName || ""}`,
      time: r.createdAt,
      link: "/reservations",
    })),
    ...(pendingReviews || []).map((r) => ({
      id: `rev-${r._id}`,
      icon: FiStar,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
      title: `New review from ${r.name} awaiting approval`,
      subtitle: `${r.rating}★ · "${r.comment.slice(0, 60)}${r.comment.length > 60 ? "..." : ""}"`,
      time: r.createdAt,
      link: "/reviews",
    })),
    ...(newMessages || []).map((m) => ({
      id: `msg-${m._id}`,
      icon: FiMail,
      color: "text-red-500 bg-red-50 dark:bg-red-500/10",
      title: `New contact message from ${m.name}`,
      subtitle: m.subject,
      time: m.createdAt,
      link: "/contact",
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="space-y-4">
      <div className="admin-card flex gap-3 p-4 text-sm text-slate-600 dark:text-slate-300">
        <FiInfo className="mt-0.5 shrink-0 text-primary-500" size={16} />
        <p>
          This feed shows everything currently pending action -- new reservations, unapproved
          reviews, and unread contact messages. Email alerts for these events can be wired up in
          the backend's contact/reservation controllers (see the <code>// TODO (production)</code>
          {" "}notes there) once an email provider like SendGrid is connected.
        </p>
      </div>

      <div className="admin-card divide-y divide-slate-100 dark:divide-slate-800">
        {items.length === 0 && (
          <p className="p-10 text-center text-sm text-slate-400">
            You're all caught up -- nothing needs attention right now.
          </p>
        )}
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.color}`}>
              <item.icon size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {item.title}
              </p>
              <p className="truncate text-xs text-slate-400">{item.subtitle}</p>
            </div>
            <span className="shrink-0 text-xs text-slate-400">{timeAgo(item.time)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
