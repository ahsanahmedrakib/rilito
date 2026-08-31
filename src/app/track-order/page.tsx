"use client";

import {
  PackageIcon,
  SearchIcon,
  TruckIcon,
} from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const steps = [
  "Order Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function TrackOrderPage() {
  const { orders } = useStore();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<null | {
    found: boolean;
    orderId: string;
  }>(null);

  const search = () => {
    const exists = orders.find(
      (o) => o.id.toLowerCase() === query.trim().toLowerCase(),
    );
    setResult({ found: !!exists, orderId: query.trim() });
  };

  const order = result?.found
    ? orders.find((o) => o.id === result.orderId)
    : undefined;

  const activeStep = order ? steps.indexOf(order.status) : -1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ink-950 text-white">
          <TruckIcon className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-4xl">
          Track Your Order
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Enter the order ID from your confirmation SMS or email.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-md gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="e.g. RIL-ABC123"
          className="flex-1 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm uppercase outline-none focus:border-ink-950"
        />
        <button
          onClick={search}
          className="grid w-14 place-items-center rounded-xl bg-ink-950 text-white transition hover:bg-brand-600"
          aria-label="Track order"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>

      {result && !result.found && result.orderId && (
        <div className="mx-auto mt-8 max-w-md rounded-2xl bg-amber-50 p-5 text-center">
          <p className="text-sm font-semibold text-amber-800">
            We couldn&rsquo;t find order &ldquo;{result.orderId}&rdquo;.
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Double-check the ID, or call our hotline 01611-773755 for help
            tracing it.
          </p>
        </div>
      )}

      {order && (
        <div className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Order ID
              </p>
              <p className="text-lg font-black tracking-wider text-ink-950">
                {order.id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Placed
              </p>
              <p className="text-sm font-bold text-ink-900">
                {formatDate(order.date)}
              </p>
            </div>
            <div className="rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold text-brand-700">
              {order.status}
            </div>
          </div>

          <div className="mt-8 flex items-center">
            {steps.map((step, i) => {
              const reached = i <= activeStep;
              const last = i === steps.length - 1;
              return (
                <div
                  key={step}
                  className={cn("flex items-center", !last && "flex-1")}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={cn(
                        "grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold",
                        reached
                          ? "bg-brand-600 text-white"
                          : "bg-ink-100 text-ink-400",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={cn(
                        "hidden whitespace-nowrap text-[10px] font-semibold sm:block",
                        reached ? "text-ink-950" : "text-ink-400",
                      )}
                    >
                      {step}
                    </span>
                  </div>
                  {!last && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 sm:-mt-6",
                        i < activeStep ? "bg-brand-600" : "bg-ink-100",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {order.tracking?.trackingId && (
            <div className="mt-6 rounded-2xl bg-ink-950 p-5 text-white">
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Courier tracking
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold">
                  {order.tracking.courier || "Courier"} ·{" "}
                  <span className="font-mono">{order.tracking.trackingId}</span>
                </p>
              </div>
              {order.tracking.note && (
                <p className="mt-2 text-xs text-ink-300">{order.tracking.note}</p>
              )}
            </div>
          )}

          <div className="mt-8 border-t border-ink-100 pt-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink-950">
              Items
            </h3>            <ul className="mt-4 space-y-4">
              {order.items.map((item) => (
                <li key={item.key} className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={52}
                    height={52}
                    className="h-13 w-13 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-ink-900">
                      {item.name}
                    </p>
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
            <div className="mt-4 flex justify-between border-t border-ink-100 pt-4">
              <span className="text-sm text-ink-600">Total paid</span>
              <span className="text-base font-extrabold text-ink-950">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      )}

      {!result && orders.length > 0 && (
        <div className="mt-12">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-400">
            Recent orders on this device
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {orders.slice(0, 5).map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setQuery(o.id);
                  setResult({ found: true, orderId: o.id });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink-800 ring-1 ring-ink-200 transition hover:ring-brand-600"
              >
                <PackageIcon className="h-3.5 w-3.5 text-brand-600" />
                {o.id}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
