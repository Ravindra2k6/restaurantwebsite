import { FiAlertTriangle } from "react-icons/fi";
import Modal from "./Modal";
import Button from "../Buttons/Button";

/**
 * Standard "are you sure?" dialog used before every delete action across
 * the admin panel, so destructive actions are never a single accidental click.
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
        <FiAlertTriangle size={24} />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </div>
    <div className="mt-6 flex justify-center gap-3">
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
