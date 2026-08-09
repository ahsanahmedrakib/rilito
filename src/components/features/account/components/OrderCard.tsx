"use client";

import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

export function OrderCard({ order }: { order: Order }) {
  return (
    <li className="rounded-2xl border border-ink-100 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-sm font-black tracking-wider text-ink-950">{order.id}</p>
          <p className="text-xs text-ink-500">{formatDate(order.date)}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase text-amber-800">
          {order.status}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {order.items.slice(0, 3).map((i) => (
          <span
            key={i.key}
            className="rounded-lg bg-ink-100 px-2 py-1 text-[11px] font-medium text-ink-700"
          >
            {i.name} ×{i.qty}
          </span>
        ))}
        {order.items.length > 3 && (
          <span className="rounded-lg bg-ink-100 px-2 py-1 text-[11px] font-medium text-ink-500">
            +{order.items.length - 3} more
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-extrabold text-ink-950">{formatPrice(order.total)}</span>
        <Link
          href={`/order/${order.id}`}
          className="text-xs font-bold text-brand-700 underline-offset-2 hover:underline"
        >
          View details →
        </Link>
      </div>
    </li>
  );
}