"use client";

import { Suspense, useMemo } from "react";
import { ArrowRight, SearchIcon } from "@/components/shared/components/icons";
import { ProductCard } from "@/features/product/components/ProductCard";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SearchResults() {
  const { products } = useStore();
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const results = useMemo(() => {
    if (!q) return [];
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter((p) => {
      const hay = `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [products, q]);

  if (!q) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-100 text-ink-400">
          <SearchIcon className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold uppercase tracking-tight text-ink-950">
          Search Rilito
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Tip the search icon in the header, or browse the full collection below.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          Browse All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Results for &ldquo;{q}&rdquo;
      </h1>
      <p className="mt-1.5 text-sm text-ink-500">
        {results.length} {results.length === 1 ? "product" : "products"} found
      </p>

      {results.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl bg-white py-24 text-center ring-1 ring-ink-200/60">
          <p className="text-lg font-bold text-ink-950">
            Nothing matched your search
          </p>
          <p className="max-w-sm text-sm text-ink-500">
            Try a broader term like &ldquo;tee&rdquo;, &ldquo;jeans&rdquo; or
            &ldquo;panjabi&rdquo;, or browse the whole collection.
          </p>
          <Link
            href="/products"
            className="mt-5 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            View All Products
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={`/products?q=${encodeURIComponent(q)}`}
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600"
            >
              Open Full Results <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export default function SearchContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
