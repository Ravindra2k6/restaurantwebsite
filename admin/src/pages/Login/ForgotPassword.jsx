import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import TextInput from "../../components/Inputs/TextInput";
import Button from "../../components/Buttons/Button";

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      const res = await authService.forgotPassword(email);
      setSent(true);
      // The backend only returns resetToken in development mode, as a
      // convenience for local testing without a real email provider wired up.
      if (res.data?.resetToken) setDevToken(res.data.resetToken);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-surface-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="admin-card p-6 sm:p-8">
          <h1 className="mb-1 font-display text-xl font-bold text-slate-900 dark:text-white">
            Forgot Password
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Enter your email and we'll send you a link to reset your password.
          </p>

          {sent ? (
            <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">
              <FiCheckCircle className="mb-2" size={20} />
              If that email is registered, a reset link has been sent.
              {devToken && (
                <div className="mt-3 rounded-lg bg-white p-3 text-xs dark:bg-surface-dark">
                  <p className="mb-1 font-semibold text-slate-500">
                    Development mode — use this link directly:
                  </p>
                  <Link
                    to={`/reset-password/${devToken}`}
                    className="break-all text-primary-600 underline"
                  >
                    /reset-password/{devToken}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <TextInput
                label="Email Address"
                type="email"
                error={errors.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                })}
              />
              <Button type="submit" loading={isSubmitting} className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-600"
          >
            <FiArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
