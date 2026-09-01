"use client";

import { CashIcon, LockIcon } from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import { cn, formatPrice } from "@/lib/utils";
import { paymentMethods, type PaymentMethodId } from "../data/checkout";

export function CheckoutPaymentMethod({
  payment,
  total,
  phone,
  onSelect,
}: {
  payment: PaymentMethodId;
  total: number;
  phone: string;
  onSelect: (id: PaymentMethodId) => void;
}) {
  const { settings } = useStore();

  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-8">
      <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
        3 · Payment Method
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
              <img
                src={settings.qrImage}
                alt="Payment QR code"
                className="h-40 w-40 rounded-lg object-contain"
              />
            </div>
          )}
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

