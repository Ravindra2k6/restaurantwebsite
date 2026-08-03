import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import offerService from "../../services/offerService";
import DataTable from "../../components/Tables/DataTable";
import Button from "../../components/Buttons/Button";
import IconButton from "../../components/Buttons/IconButton";
import Modal from "../../components/Modals/Modal";
import ConfirmDialog from "../../components/Modals/ConfirmDialog";
import TextInput from "../../components/Inputs/TextInput";
import TextArea from "../../components/Inputs/TextArea";
import Select from "../../components/Inputs/Select";
import ToggleSwitch from "../../components/Inputs/ToggleSwitch";
import ImageUploader from "../../components/Inputs/ImageUploader";
import { DISCOUNT_TYPES } from "../../utils/constants";
import { formatDate, formatCurrency } from "../../utils/formatters";

const toDateInputValue = (date) => (date ? new Date(date).toISOString().split("T")[0] : "");

const OfferForm = ({ offer, onSaved, onCancel }) => {
  const [image, setImage] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: offer?.title || "",
      description: offer?.description || "",
      discountType: offer?.discountType || "percentage",
      discountValue: offer?.discountValue || "",
      couponCode: offer?.couponCode || "",
      minOrderValue: offer?.minOrderValue || 0,
      validUntil: toDateInputValue(offer?.validUntil) || "",
      isFestive: offer?.isFestive ?? false,
      isBirthdayOffer: offer?.isBirthdayOffer ?? false,
      isActive: offer?.isActive ?? true,
    },
  });

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => formData.append(key, val));
      if (image[0]) formData.append("image", image[0]);

      if (offer) {
        await offerService.update(offer._id, formData);
        toast.success("Offer updated!");
      } else {
        await offerService.create(formData);
        toast.success("Offer created!");
      }
      onSaved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextInput label="Offer Title" error={errors.title} {...register("title", { required: "Title is required" })} />
      <TextArea label="Description" {...register("description")} />

      <div className="grid grid-cols-2 gap-4">
        <Select label="Discount Type" options={DISCOUNT_TYPES} {...register("discountType")} />
        <TextInput label="Discount Value" type="number" {...register("discountValue")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Coupon Code (optional)" {...register("couponCode")} />
        <TextInput label="Minimum Order Value" type="number" {...register("minOrderValue")} />
      </div>

      <TextInput
        label="Valid Until"
        type="date"
        error={errors.validUntil}
        {...register("validUntil", { required: "Expiry date is required" })}
      />

      <ImageUploader
        label="Offer Image"
        multiple={false}
        files={image}
        onChange={setImage}
        existingImages={offer?.image?.url ? [offer.image] : []}
      />

      <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
        <ToggleSwitch label="Festive Offer" {...register("isFestive")} />
        <ToggleSwitch label="Birthday Offer" {...register("isBirthdayOffer")} />
        <ToggleSwitch label="Active" {...register("isActive")} />
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {offer ? "Save Changes" : "Create Offer"}
        </Button>
      </div>
    </form>
  );
};

const OfferManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: offers, loading, error, refetch } = useFetch(() => offerService.getAllAdmin(), []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (offer) => {
    setEditing(offer);
    setModalOpen(true);
  };
  const handleSaved = () => {
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await offerService.delete(deleteTarget._id);
      toast.success("Offer deleted");
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
      label: "Offer",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image?.url ? (
            <img src={row.image.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
          )}
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{row.title}</p>
            {row.couponCode && <p className="text-xs font-mono text-primary-600">{row.couponCode}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "discount",
      label: "Discount",
      render: (row) =>
        row.discountType === "percentage"
          ? `${row.discountValue}%`
          : row.discountType === "flat"
          ? formatCurrency(row.discountValue)
          : row.discountType,
    },
    { key: "validUntil", label: "Expires", render: (row) => formatDate(row.validUntil) },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const expired = new Date(row.validUntil) < new Date();
        const label = !row.isActive ? "Inactive" : expired ? "Expired" : "Active";
        const cls = label === "Active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500";
        return <span className={`badge ${cls}`}>{label}</span>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
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
          Add Offer
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={offers}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No offers yet."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Offer" : "Add Offer"}
      >
        <OfferForm offer={editing} onSaved={handleSaved} onCancel={() => setModalOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default OfferManagement;
