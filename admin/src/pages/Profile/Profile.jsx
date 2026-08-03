import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import authService from "../../services/authService";
import TextInput from "../../components/Inputs/TextInput";
import Button from "../../components/Buttons/Button";

const Profile = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const passwordForm = useForm();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await userService.updateMyAvatar(formData);
      setUser(res.data);
      toast.success("Avatar updated!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onChangePassword = async (values) => {
    try {
      await authService.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password updated successfully!");
      passwordForm.reset();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="admin-card p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-slate-900 dark:text-white">
          My Profile
        </h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white shadow-md hover:bg-primary-600"
              aria-label="Change avatar"
            >
              <FiCamera size={13} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="badge mt-1 bg-primary-50 capitalize text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <div className="admin-card p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-slate-900 dark:text-white">
          Change Password
        </h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4" noValidate>
          <TextInput
            label="Current Password"
            type="password"
            error={passwordForm.formState.errors.currentPassword}
            {...passwordForm.register("currentPassword", { required: "Current password is required" })}
          />
          <TextInput
            label="New Password"
            type="password"
            error={passwordForm.formState.errors.newPassword}
            {...passwordForm.register("newPassword", {
              required: "New password is required",
              minLength: { value: 8, message: "Must be at least 8 characters" },
              pattern: { value: /\d/, message: "Must contain at least one number" },
            })}
          />
          <Button type="submit" loading={passwordForm.formState.isSubmitting}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
