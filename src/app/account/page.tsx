"use client";

import { AccountOrderHistory } from "@/components/features/account/components/AccountOrderHistory";
import {
  AccountProfileForm,
  type ProfileFormState,
} from "@/components/features/account/components/AccountProfileForm";
import { LogoutIcon, PackageIcon } from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const initialForm: ProfileFormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "Dhaka",
};

export default function AccountPage() {
  const { ready, user, logout, updateProfile, orders, toast } = useStore();
  const router = useRouter();
  const [form, setForm] = useState<ProfileFormState>(initialForm);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (user) setForm({ ...initialForm, ...user });
  }, [user]);

  if (!ready || !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-sm text-ink-500">
        Loading your account...
      </div>
    );
  }

  const save = () => {
    updateProfile(form);
    toast("Profile updated", "Your details have been saved");
  };

  const set = (key: keyof ProfileFormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
            My Account
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Welcome back,{" "}
            <span className="font-bold text-ink-900">{user.name}</span>
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            toast("Signed out", "See you soon!", "info");
            router.push("/");
          }}
          className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 transition hover:border-ink-950"
        >
          <LogoutIcon className="h-4 w-4" /> Sign Out
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <AccountProfileForm form={form} onChange={set} onSave={save} />
        <section className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
          <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-tight text-ink-950">
            <PackageIcon className="h-5 w-5 text-brand-600" /> Order History
          </h2>
          <AccountOrderHistory orders={orders} />
        </section>
      </div>
    </div>
  );
}
