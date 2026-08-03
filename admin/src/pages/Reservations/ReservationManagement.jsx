import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { FiCheck, FiX, FiTrash2, FiCalendar, FiList, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import reservationService from "../../services/reservationService";
import branchService from "../../services/branchService";
import DataTable from "../../components/Tables/DataTable";
import StatusBadge from "../../components/Tables/StatusBadge";
import { FilterBar, FilterSelect } from "../../components/Filters/Filters";
import Pagination from "../../components/Pagination/Pagination";
import IconButton from "../../components/Buttons/IconButton";
import ConfirmDialog from "../../components/Modals/ConfirmDialog";
import Modal from "../../components/Modals/Modal";
import { RESERVATION_STATUSES } from "../../utils/constants";
import { formatDate, formatTime24to12 } from "../../utils/formatters";

const ReservationManagement = () => {
  const [view, setView] = useState("table");
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [page, setPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: branches } = useFetch(() => branchService.getAll(), []);
  const { data: reservations, meta, loading, error, refetch } = useFetch(
    () =>
      reservationService.getAll({
        status: statusFilter || undefined,
        branch: branchFilter || undefined,
        page,
        limit: 10,
      }),
    [statusFilter, branchFilter, page]
  );

  // For the calendar view we fetch a larger unpaginated batch for the month.
  const { data: monthReservations } = useFetch(
    () =>
      reservationService.getAll({
        branch: branchFilter || undefined,
        limit: 500,
      }),
    [branchFilter, currentMonth]
  );

  const updateStatus = async (reservation, status) => {
    try {
      await reservationService.update(reservation._id, { status });
      toast.success(`Reservation ${status}`);
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await reservationService.delete(deleteTarget._id);
      toast.success("Reservation deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const reservationsByDay = (day) =>
    (monthReservations || []).filter((r) => isSameDay(new Date(r.reservationDate), day));

  const columns = [
    {
      key: "name",
      label: "Guest",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
          <p className="text-xs text-slate-400">{row.phone}</p>
        </div>
      ),
    },
    { key: "branch", label: "Branch", render: (row) => row.branch?.branchName || "-" },
    {
      key: "when",
      label: "Date & Time",
      render: (row) => (
        <span>
          {formatDate(row.reservationDate)} · {formatTime24to12(row.reservationTime)}
        </span>
      ),
    },
    { key: "partySize", label: "Guests", render: (row) => `${row.partySize} pax` },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          {row.status === "pending" && (
            <IconButton icon={FiCheck} label="Confirm" variant="primary" onClick={() => updateStatus(row, "confirmed")} />
          )}
          {["pending", "confirmed"].includes(row.status) && (
            <IconButton icon={FiX} label="Cancel" onClick={() => updateStatus(row, "cancelled")} />
          )}
          {row.status === "confirmed" && (
            <IconButton icon={FiCheck} label="Mark Completed" variant="primary" onClick={() => updateStatus(row, "completed")} />
          )}
          <IconButton icon={FiTrash2} label="Delete" variant="danger" onClick={() => setDeleteTarget(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar>
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={RESERVATION_STATUSES}
            placeholder="All Statuses"
          />
          <FilterSelect
            value={branchFilter}
            onChange={setBranchFilter}
            options={branches?.map((b) => ({ value: b._id, label: b.branchName })) || []}
            placeholder="All Branches"
          />
        </FilterBar>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
              view === "table" ? "bg-white shadow-sm dark:bg-surface-dark" : "text-slate-500"
            }`}
          >
            <FiList size={13} /> Table
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
              view === "calendar" ? "bg-white shadow-sm dark:bg-surface-dark" : "text-slate-500"
            }`}
          >
            <FiCalendar size={13} /> Calendar
          </button>
        </div>
      </div>

      {view === "table" ? (
        <>
          <DataTable
            columns={columns}
            data={reservations}
            loading={loading}
            error={error}
            onRetry={refetch}
            emptyMessage="No reservations found."
          />
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      ) : (
        <div className="admin-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => setCurrentMonth((m) => subMonths(m, 1))} className="btn-icon">
              <FiChevronLeft size={18} />
            </button>
            <h3 className="font-display font-bold text-slate-900 dark:text-white">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <button onClick={() => setCurrentMonth((m) => addMonths(m, 1))} className="btn-icon">
              <FiChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayReservations = reservationsByDay(day);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => dayReservations.length && setSelectedDay(day)}
                  className={`flex h-20 flex-col items-start gap-1 rounded-lg border p-1.5 text-left transition-colors ${
                    isSameMonth(day, currentMonth)
                      ? "border-slate-100 dark:border-slate-800"
                      : "border-transparent text-slate-300"
                  } ${dayReservations.length ? "hover:border-primary-300" : ""}`}
                >
                  <span className="text-xs font-semibold">{format(day, "d")}</span>
                  {dayReservations.length > 0 && (
                    <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
                      {dayReservations.length} booking{dayReservations.length > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        title={selectedDay ? `Reservations on ${format(selectedDay, "d MMM yyyy")}` : ""}
      >
        <div className="space-y-3">
          {selectedDay &&
            reservationsByDay(selectedDay).map((r) => (
              <div key={r._id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{r.name}</p>
                  <p className="text-xs text-slate-400">
                    {formatTime24to12(r.reservationTime)} · {r.partySize} pax · {r.branch?.branchName}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Delete this reservation permanently?"
      />
    </div>
  );
};

export default ReservationManagement;
