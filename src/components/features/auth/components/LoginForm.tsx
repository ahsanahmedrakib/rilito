"use client";

import { LockIcon, UserIcon } from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export function LoginForm() {
  const { login, toast } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email.trim(), password);
    if (ok) {
      toast("Welcome back!", "You're now signed in");
      router.push("/account");
    } else {
      toast("Login failed", "Check your email and password", "info");
    }
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

      <form onSubmit={submit} className="mt-7 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Password
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className={`${inputCls} pl-11`}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
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
