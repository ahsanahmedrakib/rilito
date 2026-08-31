"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function AdminDeletedDataPage() {
  const {
    deletedProducts,
    restoreProduct,
    permanentlyDeleteProduct,
    toast,
  } = useStore();
  const [query, setQuery] = useState("");

  const filtered = deletedProducts.filter((p) =>
    `${p.name} ${p.id} ${p.sku}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
          Deleted data
        </h1>
        <Link
          href="/admin/products?new=1"
          className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          + Add Product
        </Link>
      </div>
      <p className="mt-2 text-sm text-ink-500">
        Products deleted from the Products page land here. Restore them to bring
        them back to the store, or permanently delete them.
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search deleted products..."
        className="mt-6 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink-950"
      />

      {filtered.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-white py-16 text-center text-sm text-ink-500 ring-1 ring-ink-200/60">
          No deleted products. Deleted items will appear here for recovery.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 ring-1 ring-ink-200/60"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-12 w-12 rounded-xl object-cover opacity-60"
                />
                <div>
                  <p className="text-sm font-bold text-ink-950">{p.name}</p>
                  <p className="text-xs text-ink-500">
                    <span className="font-mono">{p.sku}</span> ·{" "}
                    {formatPrice(p.price)} · {p.category}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    restoreProduct(p.id);
                    toast("Product restored", p.name);
                  }}
                  className="rounded-full border border-emerald-300 px-3.5 py-1.5 text-xs font-bold text-emerald-700 transition hover:border-emerald-600 hover:bg-emerald-50"
                >
                  Restore
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Permanently delete "${p.name}"? This cannot be undone.`
                      )
                    ) {
                      permanentlyDeleteProduct(p.id);
                      toast("Product permanently deleted", p.name, "info");
                    }
                  }}
                  className="rounded-full border border-red-300 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                >
                  Permanent Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
