import { useState } from "react";
import { FiDownload, FiFileText, FiInfo } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import reservationService from "../../services/reservationService";
import newsletterService from "../../services/newsletterService";
import contactService from "../../services/contactService";
import DataTable from "../../components/Tables/DataTable";
import StatusBadge from "../../components/Tables/StatusBadge";
import Button from "../../components/Buttons/Button";
import { exportToCSV, exportToExcel, exportToPDF } from "../../utils/exportUtils";
import { formatDateTime } from "../../utils/formatters";

const TABS = [
  { id: "reservations", label: "Reservation Report" },
  { id: "customers", label: "Customer Report" },
  { id: "revenue", label: "Revenue Report" },
];

const Reports = () => {
  const [tab, setTab] = useState("reservations");

  const { data: reservations, loading: resLoading } = useFetch(
    () => reservationService.getAll({ limit: 500 }),
    []
  );
  const { data: subscribers, loading: subLoading } = useFetch(
    () => newsletterService.getAll({ limit: 500 }),
    []
  );
  const { data: contacts, loading: contactLoading } = useFetch(
    () => contactService.getAll({ limit: 500 }),
    []
  );

  const reservationColumns = [
    { key: "name", label: "Guest" },
    { key: "phone", label: "Phone" },
    { key: "branch", label: "Branch", render: (r) => r.branch?.branchName },
    { key: "partySize", label: "Guests" },
    { key: "reservationDate", label: "Date", render: (r) => formatDateTime(r.reservationDate) },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  const customerColumns = [
    { key: "email", label: "Email" },
    { key: "subscribed", label: "Newsletter", render: (r) => (r.isSubscribed ? "Subscribed" : "Unsubscribed") },
    { key: "createdAt", label: "Since", render: (r) => formatDateTime(r.createdAt) },
  ];

  const contactColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", label: "Received", render: (r) => formatDateTime(r.createdAt) },
  ];

  const handleExport = (format) => {
    if (tab === "reservations") {
      const cols = [
        { key: "name", label: "Guest" },
        { key: "phone", label: "Phone" },
        { key: "partySize", label: "Guests" },
        { key: "reservationDate", label: "Date" },
        { key: "reservationTime", label: "Time" },
        { key: "status", label: "Status" },
      ];
      if (format === "csv") exportToCSV(reservations || [], cols, "reservation-report");
      if (format === "excel") exportToExcel(reservations || [], cols, "reservation-report");
    }
    if (tab === "customers") {
      const cols = [
        { key: "email", label: "Email" },
        { key: "isSubscribed", label: "Subscribed" },
        { key: "createdAt", label: "Since" },
      ];
      if (format === "csv") exportToCSV(subscribers || [], cols, "customer-report");
      if (format === "excel") exportToExcel(subscribers || [], cols, "customer-report");
    }
    if (format === "pdf") exportToPDF();
  };

  return (
    <div className="space-y-4 print:space-y-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.id ? "bg-white shadow-sm dark:bg-surface-dark" : "text-slate-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab !== "revenue" && (
          <div className="flex gap-2">
            <Button variant="secondary" icon={FiDownload} onClick={() => handleExport("csv")}>
              CSV
            </Button>
            <Button variant="secondary" icon={FiDownload} onClick={() => handleExport("excel")}>
              Excel
            </Button>
            <Button variant="secondary" icon={FiFileText} onClick={() => handleExport("pdf")}>
              PDF
            </Button>
          </div>
        )}
      </div>

      {tab === "reservations" && (
        <DataTable
          columns={reservationColumns}
          data={reservations}
          loading={resLoading}
          emptyMessage="No reservations to report."
        />
      )}

      {tab === "customers" && (
        <div className="space-y-4">
          <DataTable
            columns={customerColumns}
            data={subscribers}
            loading={subLoading}
            emptyMessage="No newsletter subscribers yet."
          />
          <div className="admin-card overflow-hidden">
            <h3 className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:text-slate-200">
              Contact Inquiries
            </h3>
            <DataTable
              columns={contactColumns}
              data={contacts}
              loading={contactLoading}
              emptyMessage="No contact messages yet."
            />
          </div>
        </div>
      )}

      {tab === "revenue" && (
        <div className="admin-card flex gap-3 p-6 text-sm text-slate-600 dark:text-slate-300">
          <FiInfo className="mt-0.5 shrink-0 text-primary-500" size={18} />
          <p>
            Revenue reporting requires an order/payment system, which is outside Phase 1's scope
            (the backend currently tracks reservations and menu content, not transactions). The
            data model is structured so a future Orders/Payments module can plug in here without
            restructuring anything already built -- this tab is a placeholder for that.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
