"use client";

import Link from "next/link";
import { OrderCard } from "./OrderCard";
import type { Order } from "@/lib/types";

export function AccountOrderHistory({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="mt-6 rounded-2xl bg-ink-50 py-10 text-center">
        <p className="text-sm font-semibold text-ink-700">No orders yet</p>
        <p className="mt-1 text-xs text-ink-500">
          Your placed orders will appear here with live tracking.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-full bg-brand-600 px-6 py-2.5 text-xs font-bold uppercase text-white transition hover:bg-brand-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-5 space-y-4">
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </ul>
  );
}