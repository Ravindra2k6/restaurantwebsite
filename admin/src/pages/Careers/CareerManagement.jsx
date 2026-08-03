import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import careerService from "../../services/careerService";
import branchService from "../../services/branchService";
import DataTable from "../../components/Tables/DataTable";
import StatusBadge from "../../components/Tables/StatusBadge";
import Button from "../../components/Buttons/Button";
import IconButton from "../../components/Buttons/IconButton";
import Modal from "../../components/Modals/Modal";
import ConfirmDialog from "../../components/Modals/ConfirmDialog";
import TextInput from "../../components/Inputs/TextInput";
import TextArea from "../../components/Inputs/TextArea";
import Select from "../../components/Inputs/Select";
import ToggleSwitch from "../../components/Inputs/ToggleSwitch";
import { APPLICATION_STATUSES } from "../../utils/constants";
import { capitalize } from "../../utils/formatters";

const DEPARTMENTS = ["kitchen", "service", "management", "delivery", "marketing", "other"];
const EMPLOYMENT_TYPES = ["full-time", "part-time", "internship", "contract"];

const JobForm = ({ job, branches, onSaved, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: job?.title || "",
      department: job?.department || "kitchen",
      branch: job?.branch?._id || job?.branch || "",
      employmentType: job?.employmentType || "full-time",
      description: job?.description || "",
      isActive: job?.isActive ?? true,
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = { ...values };
      if (!payload.branch) delete payload.branch;

      if (job) {
        await careerService.updateJob(job._id, payload);
        toast.success("Job updated!");
      } else {
        await careerService.createJob(payload);
        toast.success("Job created!");
      }
      onSaved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextInput
        label="Job Title"
        error={errors.title}
        {...register("title", { required: "Title is required" })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Department" options={DEPARTMENTS} {...register("department")} />
        <Select label="Employment Type" options={EMPLOYMENT_TYPES} {...register("employmentType")} />
      </div>
      <Select
        label="Branch (optional)"
        options={branches?.map((b) => ({ value: b._id, label: b.branchName })) || []}
        {...register("branch")}
      />
      <TextArea
        label="Job Description"
        rows={4}
        error={errors.description}
        {...register("description", { required: "Description is required" })}
      />
      <ToggleSwitch label="Actively Accepting Applications" {...register("isActive")} />
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {job ? "Save Changes" : "Create Job"}
        </Button>
      </div>
    </form>
  );
};

const ApplicationsPanel = ({ job }) => {
  const { data: applications, loading, refetch } = useFetch(
    () => careerService.getApplications(job._id),
    [job._id]
  );

  const updateStatus = async (id, status) => {
    try {
      await careerService.updateApplicationStatus(id, status);
      toast.success("Application status updated");
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <p className="py-6 text-center text-sm text-slate-400">Loading applications...</p>;
  if (!applications?.length)
    return <p className="py-6 text-center text-sm text-slate-400">No applications yet for this role.</p>;

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div key={app._id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{app.name}</p>
              <p className="text-xs text-slate-400">
                {app.email} · {app.phone}
              </p>
            </div>
            <StatusBadge status={app.status} />
          </div>
          {app.coverNote && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{app.coverNote}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !py-1.5 !px-3 text-xs"
            >
              <FiDownload size={13} /> View Resume
            </a>
            <select
              value={app.status}
              onChange={(e) => updateStatus(app._id, e.target.value)}
              className="form-input !w-auto !py-1.5 text-xs"
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {capitalize(s)}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

const CareerManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewingApplications, setViewingApplications] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: branches } = useFetch(() => branchService.getAll(), []);
  const { data: jobs, loading, error, refetch } = useFetch(() => careerService.getAllJobsAdmin(), []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (job) => {
    setEditing(job);
    setModalOpen(true);
  };
  const handleSaved = () => {
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await careerService.deleteJob(deleteTarget._id);
      toast.success("Job deleted");
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
      key: "title",
      label: "Job Title",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.title}</p>
          <p className="text-xs capitalize text-slate-400">
            {row.department} · {row.employmentType?.replace("-", " ")}
          </p>
        </div>
      ),
    },
    { key: "branch", label: "Branch", render: (row) => row.branch?.branchName || "All Branches" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className={`badge ${row.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
          {row.isActive ? "Open" : "Closed"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <IconButton icon={FiUsers} label="View Applications" onClick={() => setViewingApplications(row)} />
          <IconButton icon={FiEdit2} label="Edit" onClick={() => openEdit(row)} />
          <IconButton icon={FiTrash2} label="Delete" variant="danger" onClick={() => setDeleteTarget(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button icon={FiPlus} onClick={openCreate}>
          Add Job Listing
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={jobs}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No job listings yet."
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Job" : "Add Job Listing"}>
        <JobForm job={editing} branches={branches} onSaved={handleSaved} onCancel={() => setModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!viewingApplications}
        onClose={() => setViewingApplications(null)}
        title={`Applications: ${viewingApplications?.title || ""}`}
        size="lg"
      >
        {viewingApplications && <ApplicationsPanel job={viewingApplications} />}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${deleteTarget?.title}" and all its applications? This cannot be undone.`}
      />
    </div>
  );
};

export default CareerManagement;
