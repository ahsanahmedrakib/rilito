"use client";

import { LockIcon, UserIcon } from "@/components/shared/components/icons";
import {
  isValidPhone,
  MIN_PASSWORD_LENGTH,
  validateName,
} from "@/features/auth/data/validation";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export function RegisterForm() {
  const { register, toast } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateName(form.name))
      return toast("Missing name", "Please enter your name", "info");
    if (!isValidPhone(form.phone))
      return toast(
        "Check phone",
        "Enter an 11-digit number starting with 01",
        "info",
      );
    if (form.password.length < MIN_PASSWORD_LENGTH)
      return toast(
        "Weak password",
        "Password must be at least 6 characters",
        "info",
      );
    if (form.password !== form.confirm)
      return toast(
        "Passwords don't match",
        "Please re-enter your password",
        "info",
      );

    const ok = register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      address: "",
      city: "Dhaka",
    });
    if (!ok)
      return toast(
        "Email already registered",
        "Try signing in instead",
        "info",
      );

    toast("Account created!", `Welcome to Rilito, ${form.name.split(" ")[0]}`);
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

      <form onSubmit={submit} className="mt-7 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Full Name *
          </label>
          <input
            value={form.name}
            onChange={set("name")}
            placeholder="Your name"
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Phone Number *
          </label>
          <input
            value={form.phone}
            onChange={set("phone")}
            placeholder="01XXXXXXXXX"
            inputMode="tel"
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Password *
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="Min 6 characters"
              className={`${inputCls} pl-11`}
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Confirm Password *
          </label>
          <input
            type="password"
            value={form.confirm}
            onChange={set("confirm")}
            placeholder="Repeat password"
            className={inputCls}
            required
          />
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
        <Link
          href="/login"
          className="font-bold text-brand-700 hover:text-brand-800"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
