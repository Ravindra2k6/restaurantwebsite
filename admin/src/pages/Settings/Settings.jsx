import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import settingsService from "../../services/settingsService";
import TextInput from "../../components/Inputs/TextInput";
import ImageUploader from "../../components/Inputs/ImageUploader";
import ToggleSwitch from "../../components/Inputs/ToggleSwitch";
import Button from "../../components/Buttons/Button";
import PageLoader from "../../components/Loader/Loader";

const Settings = () => {
  const { data: settings, loading, refetch } = useFetch(() => settingsService.get(), []);
  const [logo, setLogo] = useState([]);
  const [favicon, setFavicon] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (settings) {
      reset({
        siteName: settings.siteName || "",
        primaryPhone: settings.contact?.primaryPhone || "",
        primaryEmail: settings.contact?.primaryEmail || "",
        whatsappNumber: settings.contact?.whatsappNumber || "",
        facebook: settings.socialLinks?.facebook || "",
        instagram: settings.socialLinks?.instagram || "",
        twitter: settings.socialLinks?.twitter || "",
        youtube: settings.socialLinks?.youtube || "",
        whatsappLink: settings.socialLinks?.whatsapp || "",
        currencyCode: settings.currency?.code || "INR",
        currencySymbol: settings.currency?.symbol || "₹",
        writeReviewUrl: settings.googleBusiness?.writeReviewUrl || "",
        googlePlaceId: settings.googleBusiness?.placeId || "",
        festiveThemeActive: settings.theme?.festiveThemeActive ?? false,
        festiveThemeName: settings.theme?.festiveThemeName || "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("siteName", values.siteName);
      formData.append(
        "contact",
        JSON.stringify({
          primaryPhone: values.primaryPhone,
          primaryEmail: values.primaryEmail,
          whatsappNumber: values.whatsappNumber,
        })
      );
      formData.append(
        "socialLinks",
        JSON.stringify({
          facebook: values.facebook,
          instagram: values.instagram,
          twitter: values.twitter,
          youtube: values.youtube,
          whatsapp: values.whatsappLink,
        })
      );
      formData.append(
        "currency",
        JSON.stringify({ code: values.currencyCode, symbol: values.currencySymbol })
      );
      formData.append(
        "googleBusiness",
        JSON.stringify({ placeId: values.googlePlaceId, writeReviewUrl: values.writeReviewUrl })
      );
      formData.append(
        "theme",
        JSON.stringify({
          festiveThemeActive: values.festiveThemeActive,
          festiveThemeName: values.festiveThemeName,
        })
      );
      if (logo[0]) formData.append("logo", logo[0]);
      if (favicon[0]) formData.append("favicon", favicon[0]);

      await settingsService.update(formData);
      toast.success("Settings updated!");
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="admin-card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Restaurant Information
          </h2>
          <TextInput label="Site / Restaurant Name" {...register("siteName")} />
          <div className="grid grid-cols-2 gap-4">
            <ImageUploader label="Logo" multiple={false} files={logo} onChange={setLogo} existingImages={settings?.logo?.url ? [settings.logo] : []} />
            <ImageUploader label="Favicon" multiple={false} files={favicon} onChange={setFavicon} existingImages={settings?.favicon?.url ? [settings.favicon] : []} />
          </div>
        </div>

        <div className="admin-card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Contact Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Primary Phone" {...register("primaryPhone")} />
            <TextInput label="Primary Email" type="email" {...register("primaryEmail")} />
            <TextInput label="WhatsApp Number" hint="Digits only, with country code" {...register("whatsappNumber")} />
          </div>
        </div>

        <div className="admin-card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Social Media Links
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Facebook URL" {...register("facebook")} />
            <TextInput label="Instagram URL" {...register("instagram")} />
            <TextInput label="Twitter / X URL" {...register("twitter")} />
            <TextInput label="YouTube URL" {...register("youtube")} />
          </div>
        </div>

        <div className="admin-card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Google Business Profile
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Default Google Place ID" {...register("googlePlaceId")} />
            <TextInput label="Write a Review URL" {...register("writeReviewUrl")} />
          </div>
          <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            <FiInfo className="mt-0.5 shrink-0" size={14} />
            Per-branch Google Place IDs (used for live reviews on each branch page) are set
            individually on the Branches page -- this is just a site-wide fallback.
          </div>
        </div>

        <div className="admin-card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Currency & Theme
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Currency Code" {...register("currencyCode")} />
            <TextInput label="Currency Symbol" {...register("currencySymbol")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ToggleSwitch label="Festive Theme Active" {...register("festiveThemeActive")} />
            <TextInput label="Festive Theme Name" placeholder="e.g. Diwali, New Year" {...register("festiveThemeName")} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
