"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductForm } from "@/features/admin/components/ProductForm";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

function AdminProductsManager() {
  const { products, saveProduct, deleteProduct, toast } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState("");

  const mode = params.get("new") ? "new" : params.get("edit");
  const editing = mode === "edit" ? products.find((p) => p.id === params.get("edit")) : undefined;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      `${p.name} ${p.category} ${p.id}`.toLowerCase().includes(q)
    );
  }, [products, query]);

  const clearParams = () => router.replace("/admin/products");

  if (mode) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
          {editing ? "Edit Product" : "Add Product"}
        </h1>
        <div className="mt-6">
          <ProductForm
            product={editing}
            products={products}
            onCancel={clearParams}
            onSubmit={(product) => {
              saveProduct(product);
              toast(editing ? "Product updated" : "Product added", product.name);
              clearParams();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
          Products
        </h1>
        <Link
          href="/admin/products?new=1"
          className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          + Add Product
        </Link>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products by name, category or ID..."
        className="mt-6 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink-950"
      />

      <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/60">
        <div className="hidden grid-cols-[48px_1fr_120px_110px_90px_70px_140px] gap-4 border-b border-ink-100 px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-ink-500 md:grid">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Sale</span>
          <span>Actions</span>
        </div>
        {filtered.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-ink-500">
            No products match — try a different search.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {filtered.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-2 items-center gap-3 px-5 py-3 md:grid-cols-[48px_1fr_120px_110px_90px_70px_140px]"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-950">{p.name}</p>
                  <p className="truncate font-mono text-[11px] text-ink-400">{p.id}</p>
                </div>
                <span className="text-xs font-semibold text-ink-600 capitalize">
                  {p.category}
                </span>
                <span className="text-sm font-bold text-ink-950">{formatPrice(p.price)}</span>
                <span
                  className={`text-sm font-bold ${p.stock <= 10 ? "text-red-600" : "text-emerald-700"}`}
                >
                  {p.stock}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-center text-[10px] font-bold ${
                    p.salePrice
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-ink-100 text-ink-400"
                  }`}
                >
                  {p.salePrice ? `On sale` : "Regular"}
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products?edit=${p.id}`}
                    className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-800 transition hover:border-ink-950"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"?`)) {
                        deleteProduct(p.id);
                        toast("Product deleted", p.name, "info");
                      }
                    }}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={null}>
      <AdminProductsManager />
    </Suspense>
  );
}