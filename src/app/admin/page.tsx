"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  CashIcon,
  PackageIcon,
  TagIcon,
  TruckIcon,
} from "@/components/shared/components/icons";

const statusColors: Record<string, string> = {
  "Order Placed": "bg-ink-100 text-ink-700",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped: "bg-amber-100 text-amber-800",
  "Out for Delivery": "bg-violet-100 text-violet-800",
  Delivered: "bg-emerald-100 text-emerald-800",
};

export default function AdminDashboardPage() {
  const { orders, products, coupons } = useStore();

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 10);
  const activeCoupons = coupons.filter((c) => c.active).length;
  const recentOrders = orders.slice(0, 6);

  const stats = [
    { label: "Total Orders", value: String(orders.length), icon: PackageIcon },
    {
      label: "Revenue",
      value: formatPrice(revenue),
      icon: CashIcon,
    },
    { label: "Products", value: String(products.length), icon: TagIcon },
    { label: "Active Coupons", value: String(activeCoupons), icon: TruckIcon },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Dashboard
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink-950 text-brand-500">
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-black text-ink-950">{s.value}</p>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-ink-500">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800"
            >
              All Orders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-ink-50 py-10 text-center text-sm text-ink-500">
              No orders yet — they'll appear here once customers check out.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ink-100">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-black text-ink-950">{o.id}</p>
                    <p className="truncate text-xs text-ink-500">
                      {o.name} · {o.items.length} item{o.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${statusColors[o.status] ?? "bg-ink-100 text-ink-700"}`}
                    >
                      {o.status}
                    </span>
                    <span className="text-sm font-extrabold text-ink-950">
                      {formatPrice(o.total)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
            Stock Alerts
          </h2>
          {lowStock.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-emerald-50 py-10 text-center text-sm font-semibold text-emerald-700">
              All products well stocked.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-semibold text-ink-900">{p.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${p.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}
                  >
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/products"
            className="mt-5 block text-center text-sm font-bold text-brand-700 hover:text-brand-800"
          >
            Manage Products →
          </Link>
        </section>
      </div>
    </div>
  );
}