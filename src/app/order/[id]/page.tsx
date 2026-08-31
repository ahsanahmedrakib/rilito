"use client";

import {
  CheckCircleIcon,
  PackageIcon,
  TruckIcon,
  UserIcon,
} from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import type { Order } from "@/lib/types";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const steps = [
  "Order Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrder(orders.find((o) => o.id === id) ?? null);
    setReady(true);
  }, [orders, id]);

  if (!ready) return null;

  if (!order) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-ink-100">
          <PackageIcon className="h-10 w-10 text-ink-400" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold uppercase tracking-tight text-ink-950">
          Order not found
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          We couldn't find order{" "}
          <span className="font-mono font-bold">{id}</span>. It may have been
          placed from another device.
        </p>
        <Link
          href="/track-order"
          className="mt-7 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold uppercase text-white transition hover:bg-brand-700"
        >
          Track an Order
        </Link>
      </div>
    );
  }

  const activeStep = steps.indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-6 text-center ring-1 ring-ink-200/60 md:p-10">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircleIcon className="h-11 w-11" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
          Thank you, {order.name.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Your order has been placed successfully. A confirmation will be sent
          to your phone.
        </p>
        <div className="mt-5 inline-flex flex-col items-center gap-1 rounded-2xl bg-ink-950 px-6 py-4 text-white">
          <span className="text-xs uppercase tracking-widest text-ink-400">
            Order ID
          </span>
          <span className="text-xl font-black tracking-wider">{order.id}</span>
          <span className="text-xs text-ink-400">{formatDate(order.date)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-8">
        <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
          Order Status
        </h2>
        <div className="mt-6 flex items-center">
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
        <p className="mt-4 text-xs text-ink-500">
          Current status:{" "}
          <span className="font-bold text-brand-700">{order.status}</span>.
          {order.tracking?.trackingId
            ? ` Courier: ${order.tracking.courier || "—"} · Tracking ID: ${order.tracking.trackingId}.`
            : " We're preparing your parcel — you'll get an SMS with the courier tracking ID once it ships."}
        </p>
        {order.tracking?.note && (
          <p className="mt-2 rounded-xl bg-ink-50 px-4 py-3 text-xs text-ink-600">
            {order.tracking.note}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
          <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-ink-950">
            <TruckIcon className="h-4 w-4 text-brand-600" /> Delivery Details
          </h3>
          <div className="mt-4 space-y-2 text-sm">
            <p className="font-bold text-ink-900">{order.name}</p>
            <p className="text-ink-600">{order.phone}</p>
            {order.email && <p className="text-ink-600">{order.email}</p>}
            <p className="text-ink-600">{order.address}</p>
            <p className="text-ink-600">
              {order.area ? `${order.area}, ` : ""}
              {order.city}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
          <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-ink-950">
            <UserIcon className="h-4 w-4 text-brand-600" /> Payment
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-600">Method</span>
              <span className="font-bold uppercase text-ink-950">
                {order.payment}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-600">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-600">Delivery</span>
              <span>
                {order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-ink-100 pt-3">
              <span className="font-bold text-ink-950">Total</span>
              <span className="font-extrabold text-ink-950">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink-950">
          Items ({order.items.length})
        </h3>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => (
            <li key={item.key} className="flex items-center gap-3">
              <Image
                src={item.image}
                alt={item.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-cover"
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
      </div>

      <div className="mt-8 flex flex-col gap-3 text-center sm:flex-row sm:justify-center">
        <Link
          href="/track-order"
          className="rounded-full bg-ink-950 px-7 py-3 text-sm font-bold uppercase text-white transition hover:bg-ink-800"
        >
          Track Again
        </Link>
        <Link
          href="/products"
          className="rounded-full border border-ink-200 px-7 py-3 text-sm font-bold uppercase text-ink-900 transition hover:border-ink-950"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
