"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ORDER_STATUS_STEPS } from "@/features/order/data/status";
import { useStore } from "@/lib/store";
import { formatDate, formatPrice } from "@/lib/utils";

const statusColors: Record<string, string> = {
  "Order Placed": "bg-ink-100 text-ink-700",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped: "bg-amber-100 text-amber-800",
  "Out for Delivery": "bg-violet-100 text-violet-800",
  Delivered: "bg-emerald-100 text-emerald-800",
};

export default function OrdersContent() {
  const { orders, updateOrderStatus, toast } = useStore();
  const [filter, setFilter] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      [...orders]
        .sort((a, b) => +new Date(b.date) - +new Date(a.date))
        .filter((o) => filter === "All" || o.status === filter),
    [orders, filter]
  );

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Orders
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {["All", ...ORDER_STATUS_STEPS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              filter === s
                ? "bg-ink-950 text-white"
                : "border border-ink-200 bg-white text-ink-700 hover:border-ink-950"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white py-16 text-center text-sm text-ink-500 ring-1 ring-ink-200/60">
          No orders{filter === "All" ? " yet" : ` with status "${filter}"`}.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {filtered.map((o) => {
            const open = openId === o.id;
            return (
              <li key={o.id} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
                <button
                  onClick={() => setOpenId(open ? null : o.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
                >
                  <div>
                    <p className="font-mono text-sm font-black text-ink-950">{o.id}</p>
                    <p className="text-xs text-ink-500">
                      {o.name} · {formatDate(o.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${statusColors[o.status] ?? "bg-ink-100 text-ink-700"}`}>
                      {o.status}
                    </span>
                    <span className="text-sm font-extrabold text-ink-950">{formatPrice(o.total)}</span>
                  </div>
                </button>

                {open && (
                  <div className="mt-5 border-t border-ink-100 pt-5">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                          Items
                        </p>
                        <ul className="mt-3 space-y-3">
                          {o.items.map((i) => (
                            <li key={i.key} className="flex items-center gap-3">
                              <Image
                                src={i.image}
                                alt={i.name}
                                width={44}
                                height={44}
                                className="h-11 w-11 rounded-lg object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-ink-900">{i.name}</p>
                                <p className="text-xs text-ink-500">
                                  {i.color} · {i.size} · ×{i.qty}
                                </p>
                              </div>
                              <span className="text-sm font-bold text-ink-950">
                                {formatPrice(i.price * i.qty)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid gap-2 text-sm text-ink-700">
                        <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                          Customer & Delivery
                        </p>
                        <p>
                          <span className="font-bold">Phone:</span> {o.phone}
                        </p>
                        <p>
                          <span className="font-bold">Email:</span> {o.email || "—"}
                        </p>
                        <p>
                          <span className="font-bold">Address:</span> {o.address}, {o.area}, {o.city}
                        </p>
                        <p>
                          <span className="font-bold">Payment:</span> {o.payment}
                        </p>
                        {o.transactionId && (
                          <p>
                            <span className="font-bold">Transaction ID:</span>{" "}
                            <span className="font-mono text-xs">{o.transactionId}</span>
                          </p>
                        )}
                        <dl className="mt-2 space-y-1 border-t border-ink-100 pt-3 text-sm">
                          <div className="flex justify-between"><dt className="text-ink-500">Subtotal</dt><dd className="font-semibold">{formatPrice(o.subtotal)}</dd></div>
                          {o.discount > 0 && (
                            <div className="flex justify-between text-emerald-700"><dt>Discount</dt><dd className="font-semibold">-{formatPrice(o.discount)}</dd></div>
                          )}
                          <div className="flex justify-between"><dt className="text-ink-500">Delivery</dt><dd className="font-semibold">{formatPrice(o.shipping)}</dd></div>
                          <div className="flex justify-between"><dt className="font-bold text-ink-950">Total</dt><dd className="font-extrabold text-ink-950">{formatPrice(o.total)}</dd></div>
                        </dl>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <label className="text-xs font-bold uppercase tracking-wide text-ink-500">
                        Update status
                      </label>
                      <select
                        value={o.status}
                        onChange={(e) => {
                          updateOrderStatus(o.id, e.target.value);
                          toast("Order updated", `${o.id} → ${e.target.value}`);
                        }}
                        className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-ink-950"
                      >
                        {ORDER_STATUS_STEPS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
