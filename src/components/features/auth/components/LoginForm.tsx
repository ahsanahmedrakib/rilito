"use client";

import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UserIcon,
} from "@/components/shared/components/icons";
import {
  loginSchema,
  type LoginValues,
} from "@/features/auth/data/authSchemas";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export function LoginForm() {
  const { login, toast } = useStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = async (values: LoginValues) => {
    const result = await login(values.email.trim(), values.password);
    if (!result.ok) {
      clearErrors();
      setError("root", {
        message: result.error || "No account matches that email and password.",
      });
      return;
    }
    toast("Welcome back!", "You're now signed in");
    router.push("/account");
  };

  return (
    <div className="rounded-3xl bg-white p-8 ring-1 ring-ink-200/60">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink-950 text-white">
        <UserIcon className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-center text-2xl font-extrabold uppercase tracking-tight text-ink-950">
        Welcome Back
      </h1>
      <p className="mt-2 text-center text-sm text-ink-500">
        Sign in to access your orders and saved addresses.
      </p>

      <form onSubmit={handleSubmit(submit)} className="mt-7 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className={cn(inputCls, errors.email && "border-red-400")}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Password
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              className={cn(
                inputCls,
                "pl-11 pr-12",
                errors.password && "border-red-400",
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-900"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p
            className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"
            role="alert"
          >
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          className="cursor-pointer w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        New to Rilito?{" "}
        <Link
          href="/register"
          className="font-bold text-brand-700 hover:text-brand-800"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
