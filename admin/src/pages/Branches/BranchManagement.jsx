import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiPhone } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import branchService from "../../services/branchService";
import DataTable from "../../components/Tables/DataTable";
import Button from "../../components/Buttons/Button";
import IconButton from "../../components/Buttons/IconButton";
import Modal from "../../components/Modals/Modal";
import ConfirmDialog from "../../components/Modals/ConfirmDialog";
import TextInput from "../../components/Inputs/TextInput";
import ToggleSwitch from "../../components/Inputs/ToggleSwitch";
import ImageUploader from "../../components/Inputs/ImageUploader";
import { DAYS_OF_WEEK } from "../../utils/constants";

const defaultHours = DAYS_OF_WEEK.map((day) => ({ day, open: "10:00", close: "22:00", isClosed: false }));

const BranchForm = ({ branch, onSaved, onCancel }) => {
  const [images, setImages] = useState([]);
  const [banner, setBanner] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      restaurantName: branch?.restaurantName || "Bhojanams & Biryanis",
      branchName: branch?.branchName || "",
      addressLine1: branch?.address?.line1 || "",
      addressArea: branch?.address?.area || "",
      addressCity: branch?.address?.city || "",
      addressState: branch?.address?.state || "",
      addressPostalCode: branch?.address?.postalCode || "",
      phone: branch?.phoneNumbers?.[0] || "",
      email: branch?.email || "",
      managerName: branch?.managerName || "",
      googleMapsEmbedUrl: branch?.googleMapsEmbedUrl || "",
      googlePlaceId: branch?.googlePlaceId || "",
      latitude: branch?.location?.coordinates?.[1] || "",
      longitude: branch?.location?.coordinates?.[0] || "",
      facilities: branch?.facilities?.join(", ") || "",
      parkingAvailable: branch?.parkingAvailable ?? false,
      deliveryAvailable: branch?.deliveryAvailable ?? true,
      reservationAvailable: branch?.reservationAvailable ?? true,
      isActive: branch?.isActive ?? true,
      openingHours: branch?.openingHours?.length ? branch.openingHours : defaultHours,
    },
  });

  const { fields } = useFieldArray({ control, name: "openingHours" });

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("restaurantName", values.restaurantName);
      formData.append("branchName", values.branchName);
      formData.append(
        "address",
        JSON.stringify({
          line1: values.addressLine1,
          area: values.addressArea,
          city: values.addressCity,
          state: values.addressState,
          postalCode: values.addressPostalCode,
        })
      );
      formData.append("phoneNumbers", JSON.stringify([values.phone].filter(Boolean)));
      formData.append("email", values.email);
      formData.append("managerName", values.managerName);
      formData.append("googleMapsEmbedUrl", values.googleMapsEmbedUrl);
      formData.append("googlePlaceId", values.googlePlaceId);
      if (values.latitude && values.longitude) {
        formData.append(
          "location",
          JSON.stringify({ type: "Point", coordinates: [Number(values.longitude), Number(values.latitude)] })
        );
      }
      formData.append(
        "facilities",
        JSON.stringify(values.facilities.split(",").map((f) => f.trim()).filter(Boolean))
      );
      formData.append("parkingAvailable", values.parkingAvailable);
      formData.append("deliveryAvailable", values.deliveryAvailable);
      formData.append("reservationAvailable", values.reservationAvailable);
      formData.append("isActive", values.isActive);
      formData.append("openingHours", JSON.stringify(values.openingHours));

      images.forEach((file) => formData.append("images", file));
      if (banner[0]) formData.append("banner", banner[0]);

      if (branch) {
        await branchService.update(branch._id, formData);
        toast.success("Branch updated!");
      } else {
        await branchService.create(formData);
        toast.success("Branch created!");
      }
      onSaved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Restaurant Name" {...register("restaurantName", { required: true })} />
        <TextInput
          label="Branch Name"
          error={errors.branchName}
          {...register("branchName", { required: "Branch name is required" })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="Address Line"
          className="col-span-2"
          error={errors.addressLine1}
          {...register("addressLine1", { required: "Address is required" })}
        />
        <TextInput label="Area / Locality" {...register("addressArea")} />
        <TextInput label="City" error={errors.addressCity} {...register("addressCity", { required: "City is required" })} />
        <TextInput label="State" {...register("addressState")} />
        <TextInput label="Postal Code" {...register("addressPostalCode")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Phone Number" {...register("phone")} />
        <TextInput label="Email" type="email" {...register("email")} />
        <TextInput label="Manager Name" {...register("managerName")} />
        <TextInput label="Google Place ID" hint="For live Google reviews" {...register("googlePlaceId")} />
        <TextInput label="Latitude" {...register("latitude")} />
        <TextInput label="Longitude" {...register("longitude")} />
      </div>

      <TextInput label="Google Maps Embed URL" {...register("googleMapsEmbedUrl")} />
      <TextInput
        label="Facilities (comma-separated)"
        placeholder="AC, Rooftop, Live Music, Wheelchair Access"
        {...register("facilities")}
      />

      <div>
        <label className="form-label">Opening Hours</label>
        <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-2 text-sm">
              <span className="font-medium capitalize text-slate-600 dark:text-slate-300">
                {field.day}
              </span>
              <input type="time" className="form-input !py-1.5" {...register(`openingHours.${index}.open`)} />
              <input type="time" className="form-input !py-1.5" {...register(`openingHours.${index}.close`)} />
              <ToggleSwitch label="Closed" {...register(`openingHours.${index}.isClosed`)} />
            </div>
          ))}
        </div>
      </div>

      <ImageUploader
        label="Branch Images"
        files={images}
        onChange={setImages}
        existingImages={branch?.images || []}
      />
      <ImageUploader
        label="Branch Banner"
        multiple={false}
        files={banner}
        onChange={setBanner}
        existingImages={branch?.banner?.url ? [branch.banner] : []}
      />

      <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900 sm:grid-cols-4">
        <ToggleSwitch label="Parking" {...register("parkingAvailable")} />
        <ToggleSwitch label="Delivery" {...register("deliveryAvailable")} />
        <ToggleSwitch label="Reservations" {...register("reservationAvailable")} />
        <ToggleSwitch label="Active" {...register("isActive")} />
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {branch ? "Save Changes" : "Create Branch"}
        </Button>
      </div>
    </form>
  );
};

const BranchManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: branches, loading, error, refetch } = useFetch(() => branchService.getAll(), []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (branch) => {
    setEditing(branch);
    setModalOpen(true);
  };
  const handleSaved = () => {
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await branchService.delete(deleteTarget._id);
      toast.success("Branch deleted");
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
      key: "branchName",
      label: "Branch",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.images?.[0]?.url ? (
            <img src={row.images[0].url} alt="" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
              <FiMapPin size={16} />
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{row.branchName}</p>
            <p className="text-xs text-slate-400">{row.address?.city}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Contact",
      render: (row) => (
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <FiPhone size={13} /> {row.phoneNumbers?.[0] || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`badge ${
            row.isActive
              ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "flags",
      label: "Services",
      render: (row) => (
        <div className="flex flex-wrap gap-1 text-xs text-slate-500">
          {row.deliveryAvailable && <span className="badge bg-blue-50 text-blue-700 dark:bg-blue-500/10">Delivery</span>}
          {row.reservationAvailable && (
            <span className="badge bg-purple-50 text-purple-700 dark:bg-purple-500/10">Reservations</span>
          )}
        </div>
      ),
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
          Add Branch
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={branches}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No branches yet — add your first location."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Branch" : "Add Branch"}
        size="lg"
      >
        <BranchForm branch={editing} onSaved={handleSaved} onCancel={() => setModalOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${deleteTarget?.branchName}"? This cannot be undone.`}
      />
    </div>
  );
};

export default BranchManagement;
