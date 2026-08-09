"use client";

import { UserIcon } from "@/components/shared/components/icons";
import type { User } from "@/lib/types";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink-950";

export interface ProfileFormState extends Partial<User> {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export function AccountProfileForm({
  form,
  onChange,
  onSave,
}: {
  form: ProfileFormState;
  onChange: (key: keyof ProfileFormState, value: string) => void;
  onSave: () => void;
}) {
  return (
    <section className="h-fit rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
      <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-tight text-ink-950">
        <UserIcon className="h-5 w-5 text-brand-600" /> Profile
      </h2>
      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Full Name
          </label>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Phone
          </label>
          <input
            className={inputCls}
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            inputMode="tel"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Email
          </label>
          <input
            className={inputCls}
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Address
          </label>
          <input
            className={inputCls}
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Home address"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            City
          </label>
          <input
            className={inputCls}
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
          />
        </div>
        <button
          onClick={onSave}
          className="w-full rounded-xl bg-ink-950 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
}
