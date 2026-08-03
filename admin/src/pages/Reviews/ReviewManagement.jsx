import { useState } from "react";
import { FiCheck, FiX, FiStar, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import branchService from "../../services/branchService";
import reviewService from "../../services/reviewService";
import DataTable from "../../components/Tables/DataTable";
import StatusBadge from "../../components/Tables/StatusBadge";
import { FilterBar, FilterSelect } from "../../components/Filters/Filters";
import Pagination from "../../components/Pagination/Pagination";
import IconButton from "../../components/Buttons/IconButton";
import Modal from "../../components/Modals/Modal";
import ConfirmDialog from "../../components/Modals/ConfirmDialog";
import TextArea from "../../components/Inputs/TextArea";
import Button from "../../components/Buttons/Button";
import { REVIEW_STATUSES } from "../../utils/constants";
import { formatDate, truncate } from "../../utils/formatters";

const GoogleRatingCard = ({ branches }) => {
  const [branchId, setBranchId] = useState(branches?.[0]?._id || "");
  const { data, loading, error } = useFetch(
    () => (branchId ? branchService.getGoogleReviews(branchId) : Promise.resolve({ data: null })),
    [branchId]
  );

  if (!branches?.length) return null;

  return (
    <div className="admin-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900 dark:text-white">
          <FcGoogle size={20} /> Google Rating
        </h2>
        <select
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="form-input !w-auto text-sm"
        >
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.branchName}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading Google rating...</p>}
      {error && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          {error.includes("not configured")
            ? "This branch doesn't have a Google Place ID configured yet, or the server's Google Places API key isn't set."
            : error}
        </p>
      )}
      {data && (
        <div className="flex items-center gap-6">
          <div>
            <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              {data.rating || "—"}
            </p>
            <p className="text-xs text-slate-400">{data.totalReviews} Google reviews</p>
          </div>
          <div className="flex-1 space-y-2">
            {data.reviews?.slice(0, 3).map((r, i) => (
              <div key={i} className="border-l-2 border-primary-200 pl-3 text-sm">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  {r.reviewerName} · {r.rating}★
                </p>
                <p className="text-xs text-slate-400">{truncate(r.text, 100)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewManagement = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: branches } = useFetch(() => branchService.getAll(), []);
  const { data: reviews, meta, loading, error, refetch } = useFetch(
    () => reviewService.getAllAdmin({ status: statusFilter || undefined, page, limit: 10 }),
    [statusFilter, page]
  );

  const moderate = async (review, status) => {
    try {
      await reviewService.moderate(review._id, { status });
      toast.success(`Review ${status}`);
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleFeatured = async (review) => {
    try {
      await reviewService.moderate(review._id, { isFeatured: !review.isFeatured });
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const submitReply = async () => {
    setReplying(true);
    try {
      await reviewService.moderate(replyTarget._id, { adminReplyMessage: replyText });
      toast.success("Reply saved");
      setReplyTarget(null);
      setReplyText("");
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await reviewService.delete(deleteTarget._id);
      toast.success("Review deleted");
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
      label: "Reviewer",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
          <p className="text-xs text-slate-400">{formatDate(row.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) => (
        <span className="flex items-center gap-1 font-semibold text-amber-500">
          {row.rating} <FiStar size={13} className="fill-amber-500" />
        </span>
      ),
    },
    { key: "comment", label: "Review", render: (row) => <span className="text-sm">{truncate(row.comment, 80)}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "featured",
      label: "Featured",
      render: (row) => (
        <button onClick={() => toggleFeatured(row)} aria-label="Toggle featured">
          <FiStar size={16} className={row.isFeatured ? "fill-primary-500 text-primary-500" : "text-slate-300"} />
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          {row.status !== "approved" && (
            <IconButton icon={FiCheck} label="Approve" variant="primary" onClick={() => moderate(row, "approved")} />
          )}
          {row.status !== "rejected" && (
            <IconButton icon={FiX} label="Reject" onClick={() => moderate(row, "rejected")} />
          )}
          <IconButton
            icon={FiMessageSquare}
            label="Reply"
            onClick={() => {
              setReplyTarget(row);
              setReplyText(row.adminReply?.message || "");
            }}
          />
          <IconButton icon={FiTrash2} label="Delete" variant="danger" onClick={() => setDeleteTarget(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <GoogleRatingCard branches={branches} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar>
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={REVIEW_STATUSES}
            placeholder="All Statuses"
          />
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No website reviews yet."
      />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal isOpen={!!replyTarget} onClose={() => setReplyTarget(null)} title="Reply to Review" size="sm">
        <TextArea
          label="Your Reply"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4}
        />
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setReplyTarget(null)}>
            Cancel
          </Button>
          <Button onClick={submitReply} loading={replying}>
            Save Reply
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Delete this review permanently?"
      />
    </div>
  );
};

export default ReviewManagement;
