import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiPlus, FiEdit2, FiTrash2, FiPlusCircle, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import menuService from "../../services/menuService";
import categoryService from "../../services/categoryService";
import DataTable from "../../components/Tables/DataTable";
import SearchBar from "../../components/Search/SearchBar";
import { FilterBar, FilterSelect } from "../../components/Filters/Filters";
import Pagination from "../../components/Pagination/Pagination";
import Button from "../../components/Buttons/Button";
import IconButton from "../../components/Buttons/IconButton";
import Modal from "../../components/Modals/Modal";
import ConfirmDialog from "../../components/Modals/ConfirmDialog";
import TextInput from "../../components/Inputs/TextInput";
import TextArea from "../../components/Inputs/TextArea";
import Select from "../../components/Inputs/Select";
import ToggleSwitch from "../../components/Inputs/ToggleSwitch";
import ImageUploader from "../../components/Inputs/ImageUploader";
import { FOOD_TYPES } from "../../utils/constants";
import { formatMenuPrice } from "../../utils/formatters";

const MenuItemForm = ({ item, categories, onSaved, onCancel }) => {
  const [images, setImages] = useState([]);
  const [pricingMode, setPricingMode] = useState(item?.variants?.length ? "variants" : "flat");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      category: item?.category?._id || item?.category || "",
      foodType: item?.foodType || "veg",
      price: item?.price || "",
      variants: item?.variants?.length ? item.variants : [{ label: "Half", price: "" }],
      isAvailable: item?.isAvailable ?? true,
      isPopular: item?.isPopular ?? false,
      isChefRecommended: item?.isChefRecommended ?? false,
      isTodaysSpecial: item?.isTodaysSpecial ?? false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("foodType", values.foodType);
      formData.append("isAvailable", values.isAvailable);
      formData.append("isPopular", values.isPopular);
      formData.append("isChefRecommended", values.isChefRecommended);
      formData.append("isTodaysSpecial", values.isTodaysSpecial);

      if (pricingMode === "flat") {
        formData.append("price", values.price);
      } else {
        formData.append(
          "variants",
          JSON.stringify(values.variants.filter((v) => v.label && v.price))
        );
      }

      images.forEach((file) => formData.append("images", file));

      if (item) {
        await menuService.update(item._id, formData);
        toast.success("Menu item updated!");
      } else {
        await menuService.create(formData);
        toast.success("Menu item created!");
      }
      onSaved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextInput
        label="Dish Name"
        error={errors.name}
        {...register("name", { required: "Name is required" })}
      />
      <TextArea label="Description" {...register("description")} />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          error={errors.category}
          options={categories?.map((c) => ({ value: c._id, label: c.name })) || []}
          {...register("category", { required: "Category is required" })}
        />
        <Select label="Food Type" options={FOOD_TYPES} {...register("foodType", { required: true })} />
      </div>

      <div>
        <label className="form-label">Pricing</label>
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => setPricingMode("flat")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              pricingMode === "flat" ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800"
            }`}
          >
            Flat Price
          </button>
          <button
            type="button"
            onClick={() => setPricingMode("variants")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              pricingMode === "variants" ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800"
            }`}
          >
            Half / Full Variants
          </button>
        </div>

        {pricingMode === "flat" ? (
          <TextInput type="number" step="0.01" placeholder="e.g. 250" {...register("price")} />
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  className="form-input"
                  placeholder="Label (e.g. Half)"
                  {...register(`variants.${index}.label`)}
                />
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="Price"
                  {...register(`variants.${index}.price`)}
                />
                <IconButton icon={FiX} label="Remove variant" variant="danger" onClick={() => remove(index)} />
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ label: "", price: "" })}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary-600"
            >
              <FiPlusCircle size={14} /> Add Variant
            </button>
          </div>
        )}
      </div>

      <ImageUploader
        label="Dish Images"
        files={images}
        onChange={setImages}
        existingImages={item?.images || []}
        hint="Up to 5 images"
      />

      <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
        <ToggleSwitch label="Available" {...register("isAvailable")} />
        <ToggleSwitch label="Popular" {...register("isPopular")} />
        <ToggleSwitch label="Chef Recommended" {...register("isChefRecommended")} />
        <ToggleSwitch label="Today's Special" {...register("isTodaysSpecial")} />
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {item ? "Save Changes" : "Create Item"}
        </Button>
      </div>
    </form>
  );
};

const MenuManagement = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);

  const { data: categories } = useFetch(() => categoryService.getAll({ limit: 100 }), []);
  const { data: items, meta, loading, error, refetch } = useFetch(
    () =>
      menuService.getAll({
        search: debouncedSearch || undefined,
        category: categoryFilter || undefined,
        foodType: foodTypeFilter || undefined,
        page,
        limit: 10,
      }),
    [debouncedSearch, categoryFilter, foodTypeFilter, page]
  );

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };
  const handleSaved = () => {
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await menuService.delete(deleteTarget._id);
      toast.success("Menu item deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await menuService.toggleAvailability(item._id, !item.isAvailable);
      toast.success(`Marked as ${!item.isAvailable ? "available" : "unavailable"}`);
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Dish",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.images?.[0]?.url ? (
            <img src={row.images[0].url} alt="" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
          )}
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
            <p className="text-xs text-slate-400">{row.category?.name}</p>
          </div>
        </div>
      ),
    },
    { key: "foodType", label: "Type", render: (row) => <span className="capitalize">{row.foodType}</span> },
    { key: "price", label: "Price", render: (row) => formatMenuPrice(row) },
    {
      key: "badges",
      label: "Badges",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.isPopular && <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-500/10">Popular</span>}
          {row.isChefRecommended && (
            <span className="badge bg-purple-50 text-purple-700 dark:bg-purple-500/10">Chef Special</span>
          )}
          {row.isTodaysSpecial && (
            <span className="badge bg-amber-50 text-amber-700 dark:bg-amber-500/10">Today</span>
          )}
        </div>
      ),
    },
    {
      key: "isAvailable",
      label: "Available",
      render: (row) => (
        <ToggleSwitch checked={row.isAvailable} onChange={() => handleToggleAvailability(row)} />
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search dishes..." className="w-64" />
          <FilterBar>
            <FilterSelect
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categories?.map((c) => ({ value: c._id, label: c.name })) || []}
              placeholder="All Categories"
            />
            <FilterSelect
              value={foodTypeFilter}
              onChange={setFoodTypeFilter}
              options={FOOD_TYPES}
              placeholder="All Types"
            />
          </FilterBar>
        </div>
        <Button icon={FiPlus} onClick={openCreate}>
          Add Menu Item
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No menu items yet."
      />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Menu Item" : "Add Menu Item"}
        size="lg"
      >
        <MenuItemForm
          item={editing}
          categories={categories}
          onSaved={handleSaved}
          onCancel={() => setModalOpen(false)}
        />
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

export default MenuManagement;
