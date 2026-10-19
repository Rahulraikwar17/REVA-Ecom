import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import useAuth from "../../hook/useAuth";
import AuthInput from "../components/AuthInput";

import {
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";

const delay = (ms) => ({ animationDelay: `${ms}ms` });

const RegisterPage = () => {
  const { registerUser, isRegistering, registerError } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    registerUser({ ...data, email: data.email.trim().toLowerCase() });
  };

  return (
    <div>
      <div className="auth-rise mb-9" style={delay(0)}>
        <h1 className="text-4xl font-extrabold tracking-tight text-black">
          Create account
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          It takes less than a minute to get started.
        </p>
      </div>

      {registerError && (
        <div
          role="alert"
          className="auth-shake mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>
            {registerError?.response?.data?.message ||
              registerError?.message ||
              "Registration failed. Please try again."}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="auth-rise" style={delay(100)}>
          <AuthInput
            label="Name"
            icon={User}
            placeholder="Your full name"
            error={errors.name}
            {...register("name", { required: "Name is required" })}
          />
        </div>

        <div className="auth-rise" style={delay(170)}>
          <AuthInput
            label="Email"
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            error={errors.email}
            {...register("email", { required: "Email is required" })}
          />
        </div>

        <div className="auth-rise" style={delay(240)}>
          <AuthInput
            label="Password"
            icon={Lock}
            type="password"
            placeholder="Create a password"
            error={errors.password}
            {...register("password", { required: "Password is required" })}
          />
        </div>

        <div className="auth-rise" style={delay(310)}>
          <AuthInput
            label="Confirm password"
            icon={Lock}
            type="password"
            placeholder="Enter the password again"
            error={errors.confirmPassword}
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
        </div>

        <div className="auth-rise pt-1" style={delay(380)}>
          <button
            type="submit"
            disabled={isRegistering}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition duration-200 hover:bg-[#0047AB] hover:shadow-[#0047AB]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRegistering ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create account
              </>
            )}
          </button>
        </div>
      </form>

      <p
        className="auth-rise mt-8 text-center text-sm text-neutral-500"
        style={delay(450)}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#0047AB] underline-offset-4 transition hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;