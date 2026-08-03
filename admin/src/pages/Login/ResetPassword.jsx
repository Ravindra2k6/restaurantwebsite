import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import TextInput from "../../components/Inputs/TextInput";
import Button from "../../components/Buttons/Button";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ password }) => {
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-surface-dark">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="admin-card p-6 sm:p-8">
          <h1 className="mb-1 font-display text-xl font-bold text-slate-900 dark:text-white">
            Reset Password
          </h1>
          <p className="mb-6 text-sm text-slate-500">Choose a new password for your account.</p>

          {done ? (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">
              <FiCheckCircle size={20} /> Password updated — redirecting to login...
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <TextInput
                label="New Password"
                type="password"
                error={errors.password}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Must be at least 8 characters" },
                  pattern: { value: /\d/, message: "Must contain at least one number" },
                })}
              />
              <TextInput
                label="Confirm New Password"
                type="password"
                error={errors.confirmPassword}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                })}
              />
              <Button type="submit" loading={isSubmitting} className="w-full">
                Reset Password
              </Button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-6 block text-center text-sm font-semibold text-slate-500 hover:text-primary-600"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
