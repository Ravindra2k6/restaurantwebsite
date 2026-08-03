import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus, FiEdit2, FiTrash2, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import userService from "../../services/userService";
import authService from "../../services/authService";
import branchService from "../../services/branchService";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/Tables/DataTable";
import SearchBar from "../../components/Search/SearchBar";
import { FilterBar, FilterSelect } from "../../components/Filters/Filters";
import Pagination from "../../components/Pagination/Pagination";
import Button from "../../components/Buttons/Button";
import IconButton from "../../components/Buttons/IconButton";
import Modal from "../../components/Modals/Modal";
import ConfirmDialog from "../../components/Modals/ConfirmDialog";
import TextInput from "../../components/Inputs/TextInput";
import Select from "../../components/Inputs/Select";
import ToggleSwitch from "../../components/Inputs/ToggleSwitch";
import { ROLES } from "../../utils/constants";
import { formatDate } from "../../utils/formatters";

const CreateStaffForm = ({ onSaved, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: "staff" } });

  const onSubmit = async (values) => {
    try {
      await authService.register(values);
      toast.success("Staff account created!");
      onSaved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextInput label="Full Name" error={errors.name} {...register("name", { required: "Name is required" })} />
      <TextInput
        label="Email"
        type="email"
        error={errors.email}
        {...register("email", { required: "Email is required" })}
      />
      <TextInput
        label="Temporary Password"
        type="password"
        hint="At least 8 characters, including a number"
        error={errors.password}
        {...register("password", { required: "Password is required", minLength: 8 })}
      />
      <Select label="Role" options={ROLES} {...register("role")} />
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Create Account
        </Button>
      </div>
    </form>
  );
};

const EditStaffForm = ({ staffMember, branches, onSaved, onCancel }) => {
  const { user: currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: staffMember.name,
      role: staffMember.role,
      branch: staffMember.branch?._id || staffMember.branch || "",
      isActive: staffMember.isActive,
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = { ...values };
      if (!payload.branch) delete payload.branch;
      await userService.update(staffMember._id, payload);
      toast.success("Staff account updated!");
      onSaved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextInput label="Full Name" {...register("name", { required: true })} />
      <Select
        label="Role"
        options={ROLES.filter((r) => r !== "superadmin" || currentUser.role === "superadmin")}
        {...register("role")}
      />
      <Select
        label="Assigned Branch (optional)"
        options={branches?.map((b) => ({ value: b._id, label: b.branchName })) || []}
        {...register("branch")}
      />
      <ToggleSwitch label="Account Active" {...register("isActive")} />
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);
  const { data: branches } = useFetch(() => branchService.getAll(), []);
  const { data: staff, meta, loading, error, refetch } = useFetch(
    () =>
      userService.getAll({
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
        page,
        limit: 10,
      }),
    [debouncedSearch, roleFilter, page]
  );

  const handleSaved = () => {
    setCreateOpen(false);
    setEditing(null);
    refetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userService.delete(deleteTarget._id);
      toast.success("Account deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Staff Member",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.avatar?.url ? (
            <img src={row.avatar.url} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
              {row.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <span className="badge flex w-fit items-center gap-1 bg-primary-50 capitalize text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
          <FiShield size={11} /> {row.role}
        </span>
      ),
    },
    { key: "branch", label: "Branch", render: (row) => row.branch?.branchName || "All Branches" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className={`badge ${row.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
          {row.isActive ? "Active" : "Deactivated"}
        </span>
      ),
    },
    { key: "lastLogin", label: "Last Login", render: (row) => (row.lastLogin ? formatDate(row.lastLogin) : "Never") },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <IconButton icon={FiEdit2} label="Edit" onClick={() => setEditing(row)} />
          {row._id !== currentUser.id && currentUser.role === "superadmin" && (
            <IconButton icon={FiTrash2} label="Delete" variant="danger" onClick={() => setDeleteTarget(row)} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search staff..." className="w-64" />
          <FilterBar>
            <FilterSelect value={roleFilter} onChange={setRoleFilter} options={ROLES} placeholder="All Roles" />
          </FilterBar>
        </div>
        <Button icon={FiPlus} onClick={() => setCreateOpen(true)}>
          Add Staff Account
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={staff}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No staff accounts found."
      />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Staff Account">
        <CreateStaffForm onSaved={handleSaved} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Staff Account">
        {editing && (
          <EditStaffForm
            staffMember={editing}
            branches={branches}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete the account for "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
};

export default UserManagement;
