"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterValues,
} from "@/features/auth/data/authSchemas";
import { useStore } from "@/lib/store";
import { LockIcon, UserIcon } from "@/components/shared/components/icons";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export function RegisterForm() {
  const { register: registerUser, toast } = useStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
    },
  });

  const submit = (values: RegisterValues) => {
    const ok = registerUser({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email ?? "",
      password: values.password,
      address: "",
      city: "Dhaka",
    });
    if (!ok) {
      setError("email", { message: "This email is already registered — try signing in." });
      return;
    }
    toast("Account created!", `Welcome to Rilito, ${values.name.split(" ")[0]}`);
    router.push("/account");
  };

  return (
    <div className="rounded-3xl bg-white p-8 ring-1 ring-ink-200/60">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink-950 text-white">
        <UserIcon className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-center text-2xl font-extrabold uppercase tracking-tight text-ink-950">
        Create Account
      </h1>
      <p className="mt-2 text-center text-sm text-ink-500">
        Faster checkout, order history and saved addresses.
      </p>

      <form onSubmit={handleSubmit(submit)} className="mt-7 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Full Name *
          </label>
          <input
            placeholder="Your name"
            className={cn(inputCls, errors.name && "border-red-400")}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Phone Number *
          </label>
          <input
            placeholder="01XXXXXXXXX"
            inputMode="tel"
            className={cn(inputCls, errors.phone && "border-red-400")}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
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
            Password *
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="password"
              placeholder="Min 6 characters"
              className={cn(inputCls, "pl-11", errors.password && "border-red-400")}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Confirm Password *
          </label>
          <input
            type="password"
            placeholder="Repeat password"
            className={cn(inputCls, errors.confirm && "border-red-400")}
            {...register("confirm")}
          />
          {errors.confirm && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.confirm.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-brand-700 hover:text-brand-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}