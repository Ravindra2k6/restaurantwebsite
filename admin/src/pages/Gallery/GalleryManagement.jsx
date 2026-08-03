import { useState } from "react";
import { FiUploadCloud, FiTrash2, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import galleryService from "../../services/galleryService";
import branchService from "../../services/branchService";
import { FilterBar, FilterSelect } from "../../components/Filters/Filters";
import Button from "../../components/Buttons/Button";
import Modal from "../../components/Modals/Modal";
import ConfirmDialog from "../../components/Modals/ConfirmDialog";
import TextInput from "../../components/Inputs/TextInput";
import Select from "../../components/Inputs/Select";
import ImageUploader from "../../components/Inputs/ImageUploader";
import { CardSkeletonGrid } from "../../components/Loader/TableSkeleton";
import ErrorState from "../../components/Loader/ErrorState";
import { GALLERY_CATEGORIES } from "../../utils/constants";

const UploadForm = ({ branches, onSaved, onCancel }) => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("food");
  const [branch, setBranch] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) {
      toast.error("Select at least one image");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      if (branch) formData.append("branch", branch);
      files.forEach((file) => formData.append("images", file));

      await galleryService.upload(formData);
      toast.success("Images uploaded!");
      onSaved();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4" noValidate>
      <TextInput label="Title / Caption (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          options={GALLERY_CATEGORIES}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Select
          label="Branch (optional)"
          options={branches?.map((b) => ({ value: b._id, label: b.branchName })) || []}
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        />
      </div>
      <ImageUploader label="Images" files={files} onChange={setFiles} hint="Select multiple images at once" />
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={uploading} icon={FiUploadCloud}>
          Upload
        </Button>
      </div>
    </form>
  );
};

const GalleryManagement = () => {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: branches } = useFetch(() => branchService.getAll(), []);
  const { data: items, loading, error, refetch } = useFetch(
    () => galleryService.getAll({ category: categoryFilter || undefined, limit: 60 }),
    [categoryFilter]
  );

  const handleSaved = () => {
    setModalOpen(false);
    refetch();
  };

  const toggleFeatured = async (item) => {
    try {
      await galleryService.update(item._id, { isFeatured: !item.isFeatured });
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await galleryService.delete(deleteTarget._id);
      toast.success("Image deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar>
          <FilterSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={GALLERY_CATEGORIES}
            placeholder="All Categories"
          />
        </FilterBar>
        <Button icon={FiUploadCloud} onClick={() => setModalOpen(true)}>
          Upload Images
        </Button>
      </div>

      {loading && <CardSkeletonGrid />}
      {error && (
        <div className="admin-card p-6">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      )}
      {!loading && !error && items?.length === 0 && (
        <div className="admin-card flex items-center justify-center p-12">
          <p className="text-sm text-slate-400">No images yet — upload your first batch.</p>
        </div>
      )}

      {!loading && !error && items?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item._id} className="group relative aspect-square overflow-hidden rounded-xl">
              <img src={item.image?.url} alt={item.title || ""} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => toggleFeatured(item)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      item.isFeatured ? "bg-primary-500 text-white" : "bg-white/80 text-slate-600"
                    }`}
                    aria-label="Toggle featured"
                  >
                    <FiStar size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-red-600"
                    aria-label="Delete image"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
                <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium capitalize text-white">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Upload Images">
        <UploadForm branches={branches} onSaved={handleSaved} onCancel={() => setModalOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Delete this image? This cannot be undone."
      />
    </div>
  );
};

export default GalleryManagement;
