"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CouponForm } from "@/features/admin/components/CouponForm";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function AdminCouponsManager() {
  const { coupons, saveCoupon, deleteCoupon, toast } = useStore();
  const router = useRouter();
  const params = useSearchParams();

  const code = params.get("edit");
  const editing = code ? coupons.find((c) => c.code.toUpperCase() === code.toUpperCase()) : undefined;
  const editingOriginal = editing ? { ...editing } : undefined;

  const clearParams = () => router.replace("/admin/coupons");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
          Coupons
        </h1>
        <Link
          href="/admin/coupons?new=1"
          className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          + New Coupon
        </Link>
      </div>

      {params.get("new") || editing ? (
        <div className="mt-6">
          <CouponForm
            coupon={params.get("new") ? undefined : editingOriginal}
            onCancel={clearParams}
            onSubmit={(coupon) => {
              saveCoupon(coupon);
              toast(params.get("new") ? "Coupon created" : "Coupon updated", coupon.code);
              clearParams();
            }}
          />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {coupons.length === 0 ? (
            <p className="rounded-2xl bg-white py-14 text-center text-sm text-ink-500 ring-1 ring-ink-200/60">
              No coupons yet — create one to start discounting.
            </p>
          ) : (
            coupons.map((c) => (
              <li
                key={c.code}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 ring-1 ring-ink-200/60"
              >
                <div>
                  <p className="flex items-center gap-2 font-mono text-sm font-black text-ink-950">
                    {c.code}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                        c.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-ink-100 text-ink-500"
                      )}
                    >
                      {c.active ? "Active" : "Paused"}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {c.type === "percent" ? `${c.value}% off` : `Flat ৳${c.value} off`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      saveCoupon({ ...c, active: !c.active });
                      toast(c.active ? "Coupon paused" : "Coupon activated", c.code);
                    }}
                    className="rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-bold text-ink-800 transition hover:border-ink-950"
                  >
                    {c.active ? "Pause" : "Activate"}
                  </button>
                  <Link
                    href={`/admin/coupons?edit=${c.code}`}
                    className="rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-bold text-ink-800 transition hover:border-ink-950"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Delete coupon ${c.code}?`)) {
                        deleteCoupon(c.code);
                        toast("Coupon deleted", c.code, "info");
                      }
                    }}
                    className="rounded-full border border-red-200 px-3.5 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default function CouponsContent() {
  return (
    <Suspense fallback={null}>
      <AdminCouponsManager />
    </Suspense>
  );
}
