import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import useAuth from "../../hook/useAuth";
import AuthInput from "../components/AuthInput";

import { AlertCircle, Loader2, Lock, LogIn, Mail } from "lucide-react";

const delay = (ms) => ({ animationDelay: `${ms}ms` });

const LoginPage = () => {
  const { loginUser, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    loginUser(data);
  };

  return (
    <div>
      <div className="auth-rise mb-9" style={delay(0)}>
        <h1 className="text-4xl font-extrabold tracking-tight text-black">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Log in to your account to continue.
        </p>
      </div>

      {loginError && (
        <div
          role="alert"
          className="auth-shake mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>
            {loginError?.response?.data?.message ||
              loginError?.message ||
              "Login failed. Check your email and password."}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="auth-rise" style={delay(100)}>
          <AuthInput
            label="Email"
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            error={errors.email}
            {...register("email", { required: "Email is required" })}
          />
        </div>

        <div className="auth-rise" style={delay(180)}>
          <AuthInput
            label="Password"
            icon={Lock}
            type="password"
            placeholder="Enter your password"
            error={errors.password}
            {...register("password", { required: "Password is required" })}
          />
        </div>

        <div className="auth-rise pt-1" style={delay(260)}>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition duration-200 hover:bg-[#0047AB] hover:shadow-[#0047AB]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Log in
              </>
            )}
          </button>
        </div>
      </form>

      <p
        className="auth-rise mt-8 text-center text-sm text-neutral-500"
        style={delay(340)}
      >
        New to REVA?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#0047AB] underline-offset-4 transition hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;