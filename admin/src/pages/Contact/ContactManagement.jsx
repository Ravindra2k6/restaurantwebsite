import { useState } from "react";
import { FiMail, FiTrash2, FiDownload, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import contactService from "../../services/contactService";
import DataTable from "../../components/Tables/DataTable";
import StatusBadge from "../../components/Tables/StatusBadge";
import { FilterBar, FilterSelect } from "../../components/Filters/Filters";
import Pagination from "../../components/Pagination/Pagination";
import IconButton from "../../components/Buttons/IconButton";
import Button from "../../components/Buttons/Button";
import Modal from "../../components/Modals/Modal";
import ConfirmDialog from "../../components/Modals/ConfirmDialog";
import Select from "../../components/Inputs/Select";
import { CONTACT_STATUSES } from "../../utils/constants";
import { formatDateTime, truncate } from "../../utils/formatters";
import { exportToCSV } from "../../utils/exportUtils";

const ContactManagement = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: messages, meta, loading, error, refetch } = useFetch(
    () => contactService.getAll({ status: statusFilter || undefined, page, limit: 10 }),
    [statusFilter, page]
  );

  const updateStatus = async (id, status) => {
    try {
      await contactService.updateStatus(id, status);
      toast.success("Status updated");
      refetch();
      if (viewing?._id === id) setViewing((prev) => ({ ...prev, status }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await contactService.delete(deleteTarget._id);
      toast.success("Message deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    if (!messages?.length) {
      toast.error("No messages to export");
      return;
    }
    exportToCSV(
      messages,
      [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "subject", label: "Subject" },
        { key: "message", label: "Message" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Received At" },
      ],
      "contact-messages"
    );
  };

  const columns = [
    {
      key: "name",
      label: "From",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
          <p className="text-xs text-slate-400">{row.email}</p>
        </div>
      ),
    },
    { key: "subject", label: "Subject", render: (row) => truncate(row.subject, 40) },
    { key: "message", label: "Message", render: (row) => truncate(row.message, 50) },
    { key: "createdAt", label: "Received", render: (row) => formatDateTime(row.createdAt) },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <IconButton icon={FiEye} label="View" onClick={() => setViewing(row)} />
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
            options={CONTACT_STATUSES}
            placeholder="All Statuses"
          />
        </FilterBar>
        <Button variant="secondary" icon={FiDownload} onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={messages}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No contact messages yet."
      />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Message Details">
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400">Name</p>
                <p className="text-slate-800 dark:text-slate-100">{viewing.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Email</p>
                <p className="text-slate-800 dark:text-slate-100">{viewing.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Phone</p>
                <p className="text-slate-800 dark:text-slate-100">{viewing.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Received</p>
                <p className="text-slate-800 dark:text-slate-100">{formatDateTime(viewing.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-400">Subject</p>
              <p className="text-slate-800 dark:text-slate-100">{viewing.subject}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-400">Message</p>
              <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {viewing.message}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Select
                value={viewing.status}
                onChange={(e) => updateStatus(viewing._id, e.target.value)}
                options={CONTACT_STATUSES}
                placeholder={null}
                className="!w-40"
              />
              <a href={`mailto:${viewing.email}`} className="btn-primary">
                <FiMail size={16} /> Reply via Email
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Delete this message permanently?"
      />
    </div>
  );
};

export default ContactManagement;
