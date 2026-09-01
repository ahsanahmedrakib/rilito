"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  adminLoginSchema,
  type AdminLoginValues,
} from "@/features/admin/data/adminSchemas";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, LogoMark, LockIcon, MailIcon } from "@/components/shared/components/icons";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white pl-11 pr-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export function AdminLoginForm({
  onLogin,
}: {
  onLogin: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error: string | null }>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: yupResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = async (values: AdminLoginValues) => {
    const result = await onLogin(values.email, values.password);
    if (!result.ok) {
      clearErrors();
      setError("root", {
        message: result.error || "Invalid admin credentials.",
      });
      return false;
    }
    return true;
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 ring-1 ring-ink-200/60">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink-950 text-white">
        <LogoMark className="h-8 w-8 text-brand-500" />
      </div>
      <h1 className="mt-5 text-center text-2xl font-extrabold uppercase tracking-tight text-ink-950">
        Admin Panel
      </h1>
      <p className="mt-2 text-center text-sm text-ink-500">
        Sign in to manage products, orders and coupons.
      </p>

      <form onSubmit={handleSubmit(submit)} className="mt-7 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Email
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input type="email" placeholder="admin@rilito.com" className={inputCls} {...register("email")} />
          </div>
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
              placeholder="Admin password"
              className={cn(inputCls, "pr-12")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-900"
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-700" role="alert">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl cursor-pointer bg-ink-950 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}