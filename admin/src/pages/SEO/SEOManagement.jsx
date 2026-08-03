import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import settingsService from "../../services/settingsService";
import TextInput from "../../components/Inputs/TextInput";
import TextArea from "../../components/Inputs/TextArea";
import Button from "../../components/Buttons/Button";
import PageLoader from "../../components/Loader/Loader";

const SEOManagement = () => {
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
        metaTitle: settings.seoDefaults?.metaTitle || "",
        metaDescription: settings.seoDefaults?.metaDescription || "",
        keywords: settings.seoDefaults?.keywords?.join(", ") || "",
        ogImage: settings.seoDefaults?.ogImage || "",
        googleAnalyticsId: settings.analytics?.googleAnalyticsId || "",
        facebookPixelId: settings.analytics?.facebookPixelId || "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (values) => {
    try {
      await settingsService.update({
        seoDefaults: JSON.stringify({
          metaTitle: values.metaTitle,
          metaDescription: values.metaDescription,
          keywords: values.keywords.split(",").map((k) => k.trim()).filter(Boolean),
          ogImage: values.ogImage,
        }),
        analytics: JSON.stringify({
          googleAnalyticsId: values.googleAnalyticsId,
          facebookPixelId: values.facebookPixelId,
        }),
      });
      toast.success("SEO settings updated!");
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
          Site-Wide SEO Defaults
        </h2>
        <p className="text-sm text-slate-500">
          These populate the meta tags, Open Graph, and Twitter Card data on the public site's
          Home page; every other page can still override its own title/description (already
          implemented in Phase 2 via the SEO component).
        </p>

        <TextInput label="Default Meta Title" {...register("metaTitle")} />
        <TextArea label="Default Meta Description" rows={3} {...register("metaDescription")} />
        <TextInput label="Keywords (comma-separated)" {...register("keywords")} />
        <TextInput label="Default Open Graph Image URL" {...register("ogImage")} />

        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <TextInput label="Google Analytics ID" placeholder="G-XXXXXXX" {...register("googleAnalyticsId")} />
          <TextInput label="Facebook Pixel ID" {...register("facebookPixelId")} />
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
          <Button type="submit" loading={isSubmitting}>
            Save SEO Settings
          </Button>
        </div>
      </form>

      <div className="admin-card flex gap-3 p-5 text-sm text-slate-600 dark:text-slate-300">
        <FiInfo className="mt-0.5 shrink-0 text-primary-500" size={18} />
        <p>
          <strong>Sitemap.xml and robots.txt</strong> are generated as static files at build time
          for the public site (see <code>client/public/robots.txt</code>) rather than dynamically
          from this panel -- search engines fetch them directly, so there's no runtime API for the
          admin panel to call here. If you need them regenerated with new URLs, update the
          public site's routes and rebuild/redeploy it.
        </p>
      </div>
    </div>
  );
};

export default SEOManagement;
