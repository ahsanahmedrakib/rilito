"use client";

import { cn } from "@/lib/utils";
import { deliveryMethods, type DeliveryMethodId } from "../data/checkout";

export function CheckoutDeliveryMethod({
  delivery,
  freeDelivery,
  onSelect,
}: {
  delivery: DeliveryMethodId;
  freeDelivery: boolean;
  onSelect: (id: DeliveryMethodId) => void;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-8">
      <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
        2 · Delivery Method
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {deliveryMethods.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={cn(
              "rounded-2xl border-2 p-4 text-left transition",
              delivery === m.id
                ? "border-brand-600 bg-brand-50"
                : "border-ink-200 hover:border-ink-400",
            )}
          >
            <p className="text-sm font-bold text-ink-950">{m.title}</p>
            <p className="mt-1 text-xs text-ink-500">
              {m.description(freeDelivery)}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
