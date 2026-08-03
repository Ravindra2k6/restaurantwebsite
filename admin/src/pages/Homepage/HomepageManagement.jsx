import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import settingsService from "../../services/settingsService";
import TextInput from "../../components/Inputs/TextInput";
import TextArea from "../../components/Inputs/TextArea";
import Button from "../../components/Buttons/Button";
import PageLoader from "../../components/Loader/Loader";

const RELATED_SECTIONS = [
  { label: "Featured Dishes & Today's Special", hint: "Toggle badges on items in", path: "/menu" },
  { label: "Chef Recommendations", hint: "Toggle the Chef Special badge in", path: "/menu" },
  { label: "Gallery Preview", hint: "Mark photos as Featured in", path: "/gallery" },
  { label: "Testimonials / Reviews", hint: "Approve & feature reviews in", path: "/reviews" },
  { label: "Latest Offers", hint: "Manage active offers in", path: "/offers" },
  { label: "FAQs", hint: "Manage questions in", path: "/faqs" },
  { label: "Branches Preview", hint: "Manage locations in", path: "/branches" },
];

const HomepageManagement = () => {
  const { data: settings, loading, refetch } = useFetch(() => settingsService.get(), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (settings) {
      reset({
        heroHeadline: settings.heroHeadline || "",
        heroVideoUrl: settings.heroVideoUrl || "",
        tagline: settings.tagline || "",
        restaurantStory: settings.restaurantStory || "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (values) => {
    try {
      await settingsService.update(values);
      toast.success("Homepage content updated!");
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="admin-card space-y-4 p-6" noValidate>
        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
          Hero Section & Story
        </h2>
        <TextInput label="Tagline" placeholder="Shown as the small eyebrow text above the hero heading" {...register("tagline")} />
        <TextInput label="Hero Headline" {...register("heroHeadline")} />
        <TextInput
          label="Hero Video URL"
          placeholder="https://... (mp4 background video)"
          {...register("heroVideoUrl")}
        />
        <TextArea label="Restaurant Story" rows={6} {...register("restaurantStory")} />

        <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
          <Button type="submit" loading={isSubmitting}>
            Save Homepage Content
          </Button>
        </div>
      </form>

      <div className="admin-card p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-slate-900 dark:text-white">
          Other Homepage Sections
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          These sections pull live from their own data, so they're managed on their dedicated
          pages rather than duplicated here -- this keeps a single source of truth.
        </p>
        <div className="space-y-2">
          {RELATED_SECTIONS.map((section) => (
            <Link
              key={section.label}
              to={section.path}
              className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 text-sm transition-colors hover:border-primary-300 dark:border-slate-800"
            >
              <span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{section.label}</span>
                <span className="text-slate-400"> - {section.hint} {section.path}</span>
              </span>
              <FiArrowRight className="text-primary-500" size={16} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepageManagement;
