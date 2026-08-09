"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { PhoneIcon } from "@/components/shared/components/icons";
import type { CheckoutAddress } from "@/features/checkout/data/checkoutSchemas";
import { deliveryCities } from "@/features/checkout/data/checkout";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export function CheckoutAddressForm({
  register,
  errors,
}: {
  register: UseFormRegister<CheckoutAddress>;
  errors: FieldErrors<CheckoutAddress>;
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
            className={cn(inputCls, errors.name && "border-red-400")}
            placeholder="Your full name"
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
          <div className="relative">
            <PhoneIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              className={cn(inputCls, "pl-11", errors.phone && "border-red-400")}
              placeholder="01XXXXXXXXX"
              inputMode="tel"
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Email Address
          </label>
          <input
            className={cn(inputCls, errors.email && "border-red-400")}
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Full Address *
          </label>
          <textarea
            className={cn(inputCls, "resize-none", errors.address && "border-red-400")}
            rows={2}
            placeholder="House, road, area / colony, thana"
            {...register("address")}
          />
          {errors.address && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.address.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            City / Division *
          </label>
          <select className={cn(inputCls, errors.city && "border-red-400")} {...register("city")}>
            {deliveryCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.city.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Area / Thana
          </label>
          <input
            className={inputCls}
            placeholder="e.g. Dhanmondi"
            {...register("area")}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Order Note (optional)
          </label>
          <textarea
            className={cn(inputCls, "resize-none")}
            rows={2}
            placeholder="Anything we should know about the delivery?"
            {...register("note")}
          />
        </div>
      </div>
    </section>
  );
}