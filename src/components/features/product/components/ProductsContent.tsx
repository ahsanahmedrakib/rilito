"use client";

import { Suspense, useMemo } from "react";
import { Breadcrumbs } from "@/components/shared/components/Breadcrumbs";
import { ProductsSkeleton } from "@/components/shared/components/ProductsSkeleton";
import { FadeIn } from "@/components/shared/components/FadeIn";
import {
  ChevronLeft,
  ChevronRight,
  FilterIcon,
} from "@/components/shared/components/icons";
import { PriceRangeFilter } from "@/features/product/components/PriceRangeFilter";
import { ProductCard } from "@/features/product/components/ProductCard";
import { SortSelect } from "@/features/product/components/SortSelect";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PER_PAGE = 12;

function getSort(sort: string) {
  switch (sort) {
    case "best-selling":
      return (a: Product, b: Product) =>
        Number(b.isBestSeller) - Number(a.isBestSeller) || b.rating - a.rating;
    case "new":
      return (a: Product, b: Product) =>
        Number(b.isNew) - Number(a.isNew) || b.rating - a.rating;
    case "price-asc":
      return (a: Product, b: Product) =>
        (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
    case "price-desc":
      return (a: Product, b: Product) =>
        (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
    case "rating":
      return (a: Product, b: Product) => b.rating - a.rating;
    default:
      return () => 0;
  }
}

function ProductsBrowser() {
  const { products, categories, ready } = useStore();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const q = searchParams.get("q") ?? "";
  const min = Number(searchParams.get("min")) || 0;
  const max = Number(searchParams.get("max")) || 5000;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const results = useMemo(() => {
    const list = products.filter((p) => {
      if (category && p.category !== category) return false;
      const price = p.salePrice ?? p.price;
      if (price < min || price > max) return false;
      if (q) {
        const hay = `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
        if (!q.split(/\s+/).every((t) => hay.includes((t || "").toLowerCase())))
          return false;
      }
      return true;
    });
    return [...list].sort(getSort(sort));
  }, [products, category, min, max, q, sort]);

  if (!ready) return <ProductsSkeleton />;

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const activeCategory = category
    ? categories.find((c) => c.slug === category)
    : undefined;
  const hasFilters = Boolean(category || q || min > 0 || max < 5000);

  const buildHref = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const all: Record<string, string> = {
      ...(category ? { category } : {}),
      ...(sort !== "featured" ? { sort } : {}),
      ...(q ? { q } : {}),
      ...(min > 0 ? { min: String(min) } : {}),
      ...(max < 5000 ? { max: String(max) } : {}),
    };
    Object.entries(patch).forEach(([k, v]) => {
      if (!v) delete all[k];
      else all[k] = v;
    });
    Object.entries(all).forEach(([k, v]) => params.set(k, v));
    return `/products?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: activeCategory?.name ?? "All Products", href: undefined },
        ]}
      />

      <FadeIn>
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-4xl">
            {activeCategory?.name ?? (q ? `Results for "${q}"` : "All Products")}
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            {total} {total === 1 ? "product" : "products"}
            {activeCategory ? ` in ${activeCategory.name}` : " in our collection"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <Link
              href="/products"
              className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 transition hover:border-brand-600 hover:text-brand-700"
            >
              Clear all
            </Link>
          )}
          <SortSelect value={sort} />
        </div>
      </div>
      </FadeIn>

      <FadeIn delay={100}>
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit lg:pb-8">
          <Suspense fallback={null}>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/60 lg:p-6">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-950">
                <FilterIcon className="h-4 w-4 text-brand-600" /> Categories
              </h2>
              <ul className="mt-4 space-y-1">
                <li>
                  <Link
                    href="/products"
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition",
                      !category ? "bg-ink-950 text-white" : "text-ink-700 hover:bg-ink-100"
                    )}
                  >
                    All Products
                    <span className="text-xs opacity-70">{products.length}</span>
                  </Link>
                </li>
                {categories.map((c) => {
                  const count = products.filter((p) => p.category === c.slug).length;
                  const active = category === c.slug;
                  return (
                    <li key={c.slug}>
                      <Link
                        href={active ? "/products" : buildHref({ category: c.slug })}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition",
                          active ? "bg-ink-950 text-white" : "text-ink-700 hover:bg-ink-100"
                        )}
                      >
                        {c.name}
                        <span className="text-xs opacity-70">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 border-t border-ink-100 pt-5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-950">
                  Price Range
                </h3>
                <div className="mt-4">
                  <PriceRangeFilter min={min} max={max === 5000 ? 5000 : max} />
                </div>
              </div>
            </div>
          </Suspense>
        </aside>

        <div>
          {pageItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-24 text-center ring-1 ring-ink-200/60">
              <p className="text-lg font-bold text-ink-950">No products found</p>
              <p className="max-w-sm text-sm text-ink-500">
                Try adjusting your filters or clearing the search — there&rsquo;s plenty
                more to explore.
              </p>
              <Link
                href="/products"
                className="mt-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Reset Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2">
              {current > 1 && (
                <Link
                  href={buildHref({ page: String(current - 1) })}
                  className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-900 transition hover:border-ink-950"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              )}
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                if (n === 1 || n === totalPages || Math.abs(n - current) <= 1) {
                  return (
                    <Link
                      key={n}
                      href={buildHref({ page: String(n) })}
                      className={cn(
                        "grid h-10 min-w-10 place-items-center rounded-full px-2 text-sm font-semibold transition",
                        n === current
                          ? "bg-brand-600 text-white"
                          : "border border-ink-200 bg-white text-ink-900 hover:border-ink-950"
                      )}
                    >
                      {n}
                    </Link>
                  );
                }
                if (n === 2 || n === totalPages - 1) {
                  return (
                    <span key={n} className="px-1 text-ink-400">
                      …
                    </span>
                  );
                }
                return null;
              })}
              {current < totalPages && (
                <Link
                  href={buildHref({ page: String(current + 1) })}
                  className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-900 transition hover:border-ink-950"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
      </FadeIn>
    </div>
  );
}

export default function ProductsContent() {
  return (
    <Suspense fallback={null}>
      <ProductsBrowser />
    </Suspense>
  );
}
