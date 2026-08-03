import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import faqService from "../../services/faqService";
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

const FAQ_CATEGORIES = ["general", "reservation", "delivery", "menu", "careers", "payments", "other"];

const FAQForm = ({ faq, onSaved, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      question: faq?.question || "",
      answer: faq?.answer || "",
      category: faq?.category || "general",
      displayOrder: faq?.displayOrder ?? 0,
    },
  });

  const onSubmit = async (values) => {
    try {
      if (faq) {
        await faqService.update(faq._id, values);
        toast.success("FAQ updated!");
      } else {
        await faqService.create(values);
        toast.success("FAQ created!");
      }
      onSaved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextInput
        label="Question"
        error={errors.question}
        {...register("question", { required: "Question is required" })}
      />
      <TextArea
        label="Answer"
        rows={4}
        error={errors.answer}
        {...register("answer", { required: "Answer is required" })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" options={FAQ_CATEGORIES} {...register("category")} />
        <TextInput label="Display Order" type="number" {...register("displayOrder")} />
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {faq ? "Save Changes" : "Create FAQ"}
        </Button>
      </div>
    </form>
  );
};

const FAQManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);
  const { data: faqs, meta, loading, error, refetch } = useFetch(
    () => faqService.getAll({ search: debouncedSearch || undefined, page, limit: 10 }),
    [debouncedSearch, page]
  );

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (faq) => {
    setEditing(faq);
    setModalOpen(true);
  };
  const handleSaved = () => {
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await faqService.delete(deleteTarget._id);
      toast.success("FAQ deleted");
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
      key: "question",
      label: "Question",
      render: (row) => <span className="font-semibold text-slate-800 dark:text-slate-100">{row.question}</span>,
    },
    { key: "category", label: "Category", render: (row) => <span className="capitalize">{row.category}</span> },
    { key: "displayOrder", label: "Order" },
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
        <SearchBar value={search} onChange={setSearch} placeholder="Search FAQs..." className="w-72" />
        <Button icon={FiPlus} onClick={openCreate}>
          Add FAQ
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={faqs}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No FAQs yet."
      />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit FAQ" : "Add FAQ"}>
        <FAQForm faq={editing} onSaved={handleSaved} onCancel={() => setModalOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Delete this FAQ permanently?"
      />
    </div>
  );
};

export default FAQManagement;
