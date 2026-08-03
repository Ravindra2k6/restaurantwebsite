import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import categoryService from "../../services/categoryService";
import DataTable from "../../components/Tables/DataTable";
import SearchBar from "../../components/Search/SearchBar";
import Pagination from "../../components/Pagination/Pagination";
import Button from "../../components/Buttons/Button";
import IconButton from "../../components/Buttons/IconButton";
import Modal from "../../components/Modals/Modal";
import ConfirmDialog from "../../components/Modals/ConfirmDialog";
import TextInput from "../../components/Inputs/TextInput";
import TextArea from "../../components/Inputs/TextArea";
import Select from "../../components/Inputs/Select";
import ImageUploader from "../../components/Inputs/ImageUploader";
import { CATEGORY_TYPES } from "../../utils/constants";

const CategoryForm = ({ category, onSaved, onCancel }) => {
  const [imageFile, setImageFile] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      type: category?.type || "mixed",
      displayOrder: category?.displayOrder ?? 0,
    },
  });

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => formData.append(key, val));
      if (imageFile[0]) formData.append("image", imageFile[0]);

      if (category) {
        await categoryService.update(category._id, formData);
        toast.success("Category updated!");
      } else {
        await categoryService.create(formData);
        toast.success("Category created!");
      }
      onSaved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextInput
        label="Category Name"
        error={errors.name}
        {...register("name", { required: "Name is required" })}
      />
      <TextArea label="Description" {...register("description")} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Type" options={CATEGORY_TYPES} {...register("type")} />
        <TextInput label="Display Order" type="number" {...register("displayOrder")} />
      </div>
      <ImageUploader
        label="Category Image"
        multiple={false}
        files={imageFile}
        onChange={setImageFile}
        existingImages={category?.image?.url ? [category.image] : []}
      />
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {category ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  );
};

const CategoryManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);

  const { data: categories, meta, loading, error, refetch } = useFetch(
    () => categoryService.getAll({ search: debouncedSearch || undefined, page, limit: 10 }),
    [debouncedSearch, page]
  );

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (category) => {
    setEditing(category);
    setModalOpen(true);
  };

  const handleSaved = () => {
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await categoryService.delete(deleteTarget._id);
      toast.success("Category deleted");
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
      label: "Category",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image?.url ? (
            <img src={row.image.url} alt="" className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800" />
          )}
          <span className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</span>
        </div>
      ),
    },
    { key: "type", label: "Type", render: (row) => <span className="capitalize">{row.type}</span> },
    { key: "displayOrder", label: "Order" },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <IconButton icon={FiEdit2} label="Edit" onClick={() => openEdit(row)} />
          <IconButton
            icon={FiTrash2}
            label="Delete"
            variant="danger"
            onClick={() => setDeleteTarget(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." className="w-72" />
        <Button icon={FiPlus} onClick={openCreate}>
          Add Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No categories yet — create your first one."
      />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Category" : "Add Category"}
      >
        <CategoryForm category={editing} onSaved={handleSaved} onCancel={() => setModalOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
};

export default CategoryManagement;
