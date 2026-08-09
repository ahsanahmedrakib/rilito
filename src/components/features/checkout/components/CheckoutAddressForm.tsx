"use client";

import { PhoneIcon } from "@/components/shared/components/icons";
import { deliveryCities } from "@/features/checkout/data/checkout";
import { cn } from "@/lib/utils";

export interface CheckoutAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  note: string;
}

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export function CheckoutAddressForm({
  form,
  onChange,
}: {
  form: CheckoutAddress;
  onChange: (key: keyof CheckoutAddress, value: string) => void;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-8">
      <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
        1 · Delivery Details
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Full Name *
          </label>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Phone Number *
          </label>
          <div className="relative">
            <PhoneIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              className={cn(inputCls, "pl-11")}
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="01XXXXXXXXX"
              inputMode="tel"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Email Address
          </label>
          <input
            className={inputCls}
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Full Address *
          </label>
          <textarea
            className={cn(inputCls, "resize-none")}
            rows={2}
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="House, road, area / colony, thana"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            City / Division *
          </label>
          <select
            className={inputCls}
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
          >
            {deliveryCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Area / Thana
          </label>
          <input
            className={inputCls}
            value={form.area}
            onChange={(e) => onChange("area", e.target.value)}
            placeholder="e.g. Dhanmondi"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Order Note (optional)
          </label>
          <textarea
            className={cn(inputCls, "resize-none")}
            rows={2}
            value={form.note}
            onChange={(e) => onChange("note", e.target.value)}
            placeholder="Anything we should know about the delivery?"
          />
        </div>
      </div>
    </section>
  );
}
