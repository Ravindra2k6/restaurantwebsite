import { useState } from "react";
import { FiShield } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import auditLogService from "../../services/auditLogService";
import DataTable from "../../components/Tables/DataTable";
import { FilterBar, FilterSelect } from "../../components/Filters/Filters";
import Pagination from "../../components/Pagination/Pagination";
import { formatDateTime } from "../../utils/formatters";

const ACTIONS = ["create", "update", "delete", "login", "login_failed", "logout", "moderate", "status_change"];

const ACTION_COLORS = {
  create: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  update: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  delete: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  login: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  login_failed: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  logout: "bg-slate-100 text-slate-500 dark:bg-slate-800",
  moderate: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  status_change: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

/**
 * Real audit trail, powered by the backend's AuditLog model -- every entry
 * here reflects an actual mutating action taken by an admin/staff account
 * (see logActivity() calls across the backend controllers). This replaced
 * the Phase 3 placeholder that derived a best-effort view from unrelated
 * records, now that true activity logging exists.
 */
const AuditLogs = () => {
  const [entityType, setEntityType] = useState("");
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);

  const { data: entityTypes } = useFetch(() => auditLogService.getEntityTypes(), []);
  const { data: logs, meta, loading, error, refetch } = useFetch(
    () =>
      auditLogService.getAll({
        entityType: entityType || undefined,
        action: action || undefined,
        page,
        limit: 25,
      }),
    [entityType, action, page]
  );

  const columns = [
    {
      key: "actor",
      label: "Staff Member",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
            {row.actorName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{row.actorName}</p>
            <p className="text-xs capitalize text-slate-400">{row.actorRole}</p>
          </div>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <span className={`badge capitalize ${ACTION_COLORS[row.action] || "bg-slate-100 text-slate-500"}`}>
          {row.action.replace("_", " ")}
        </span>
      ),
    },
    { key: "entityType", label: "Entity", render: (row) => row.entityType },
    { key: "description", label: "Description" },
    { key: "createdAt", label: "When", render: (row) => formatDateTime(row.createdAt) },
  ];

  return (
    <div className="space-y-4">
      <div className="admin-card flex items-start gap-3 p-4 text-sm text-slate-600 dark:text-slate-300">
        <FiShield className="mt-0.5 shrink-0 text-primary-500" size={18} />
        <p>
          A real-time record of every create, update, delete, and status-change action taken
          across the admin panel, plus login activity. Visible to superadmin and admin roles only.
        </p>
      </div>

      <FilterBar>
        <FilterSelect
          value={entityType}
          onChange={(v) => {
            setEntityType(v);
            setPage(1);
          }}
          options={entityTypes || []}
          placeholder="All Entities"
        />
        <FilterSelect
          value={action}
          onChange={(v) => {
            setAction(v);
            setPage(1);
          }}
          options={ACTIONS.map((a) => ({ value: a, label: a.replace("_", " ") }))}
          placeholder="All Actions"
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No activity recorded yet."
      />
      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
};

export default AuditLogs;
