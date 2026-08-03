import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import TextInput from "../../components/Inputs/TextInput";
import Button from "../../components/Buttons/Button";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "", rememberMe: true } });

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-surface-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 font-display text-xl font-bold text-white">
            B
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Admin Panel Login
          </h1>
          <p className="mt-1 text-sm text-slate-500">Bhojanams & Biryanis Restaurant Management</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="admin-card space-y-4 p-6 sm:p-8" noValidate>
          <TextInput
            label="Email Address"
            type="email"
            placeholder="you@restaurant.com"
            error={errors.email}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />

          <div className="relative">
            <TextInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              error={errors.password}
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                {...register("rememberMe")}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" loading={isSubmitting} className="w-full" icon={FiLock}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          <FiMail className="mr-1 inline" size={12} />
          Access is limited to authorized restaurant staff.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
