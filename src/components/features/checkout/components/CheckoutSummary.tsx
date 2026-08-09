"use client";

import { useState } from "react";
import Image from "next/image";
import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function CheckoutSummary({
  items,
  subtotal,
  discount,
  shipping,
  total,
  onApplyPromo,
  placing,
  onPlaceOrder,
}: {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  onApplyPromo: (code: string) => void;
  placing: boolean;
  onPlaceOrder: () => void;
}) {
  const [promo, setPromo] = useState("");

  return (
    <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 lg:sticky lg:top-24">
      <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
        Your Order
      </h2>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-3">
            <Image
              src={item.image}
              alt={item.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-semibold text-ink-900">{item.name}</p>
              <p className="text-xs text-ink-500">
                {item.color} · {item.size} · ×{item.qty}
              </p>
            </div>
            <span className="text-sm font-bold text-ink-950">
              {formatPrice(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex gap-2">
        <input
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          placeholder="Coupon (RILITO10)"
          className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm outline-none focus:border-ink-950"
        />
        <button
          onClick={() => onApplyPromo(promo)}
          className="rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
        >
          Apply
        </button>
      </div>

      <dl className="mt-5 space-y-3 border-t border-ink-100 pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-600">Subtotal</dt>
          <dd className="font-semibold">{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <dt>Discount</dt>
            <dd className="font-semibold">-{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-ink-600">Delivery</dt>
          <dd className="font-semibold">
            {shipping === 0 ? <span className="text-emerald-700">FREE</span> : formatPrice(shipping)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-ink-100 pt-4 text-base">
          <dt className="font-bold text-ink-950">Total</dt>
          <dd className="font-extrabold text-ink-950">{formatPrice(total)}</dd>
        </div>
      </dl>

      <button
        onClick={onPlaceOrder}
        disabled={placing}
        className="mt-5 w-full rounded-xl bg-brand-600 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {placing ? "Placing order..." : `Place Order · ${formatPrice(total)}`}
      </button>
      <p className="mt-3 text-center text-xs text-ink-500">
        Total includes VAT. Exchange within 7 days.
      </p>
    </aside>
  );
}