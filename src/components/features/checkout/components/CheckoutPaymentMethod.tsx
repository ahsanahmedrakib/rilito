"use client";

import { CashIcon, LockIcon } from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import { cn, formatPrice } from "@/lib/utils";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import Image from "next/image";
import { paymentMethods, type PaymentMethodId } from "../data/checkout";
import type { CheckoutAddress } from "../data/checkoutSchemas";

export function CheckoutPaymentMethod({
  payment,
  total,
  phone,
  onSelect,
  register,
  errors,
}: {
  payment: PaymentMethodId;
  total: number;
  phone: string;
  onSelect: (id: PaymentMethodId) => void;
  register: UseFormRegister<CheckoutAddress>;
  errors: FieldErrors<CheckoutAddress>;
}) {
  const { settings } = useStore();

  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-8">
      <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
        2 · Payment Method
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {paymentMethods.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={cn(
              "rounded-2xl border-2 p-4 text-left transition",
              payment === m.id
                ? "border-brand-600 bg-brand-50"
                : "border-ink-200 hover:border-ink-400",
            )}
          >
            <div className="flex items-center gap-2">
              <CashIcon className="h-5 w-5 text-brand-600" />
              <p className="text-sm font-bold text-ink-950">{m.title}</p>
            </div>
            <p className="mt-1 text-xs text-ink-500">{m.description}</p>
          </button>
        ))}
      </div>

      {payment === "qr" && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
          <p className="font-bold">
            Send <span className="uppercase">{formatPrice(total)}</span> to{" "}
            <span className="font-bold">
              {settings.paymentNumber || "our payment number"}
            </span>
            .
          </p>
          <p className="mt-1">{settings.paymentNote}</p>
          {settings.qrImage && (
            <div className="mt-3 inline-block rounded-2xl border border-amber-200 bg-white p-3">
              <Image
                src={settings.qrImage}
                alt="Payment QR code"
                className="rounded-lg object-contain"
                height={1000}
                width={1000}
              />
            </div>
          )}

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-amber-900">
              Transaction ID *
            </label>
            <input
              className={cn(
                "w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm font-semibold text-ink-900 outline-none transition placeholder:font-normal placeholder:text-ink-400 focus:border-amber-500",
                errors.transactionId && "border-red-400",
              )}
              placeholder="e.g. trx9W2kLmN"
              {...register("transactionId")}
            />
            {errors.transactionId && (
              <p
                className="mt-1 text-xs font-semibold text-red-600"
                role="alert"
              >
                {errors.transactionId.message}
              </p>
            )}
            <p className="mt-1.5 text-amber-700">
              Enter the transaction/reference ID from your payment app — your
              order is confirmed once it&apos;s verified.
            </p>
          </div>

          <p className="mt-2">
            Your order will be confirmed once payment is verified — our team
            will call you on{" "}
            <span className="font-bold">{phone || "your number"}</span>.
          </p>
        </div>
      )}

      <p className="mt-4 flex items-center gap-2 text-xs text-ink-500">
        <LockIcon className="h-4 w-4 text-emerald-600" />
        Your information is encrypted and never shared.
      </p>
    </section>
  );
}
