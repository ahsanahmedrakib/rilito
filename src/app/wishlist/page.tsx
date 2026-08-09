"use client";

import { ArrowRight, HeartIcon } from "@/components/shared/components/icons";
import { ProductCard } from "@/features/product/components/ProductCard";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, toast, products } = useStore();
  const items = products.filter((p) => wishlist.includes(p.slug));

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-brand-100 text-brand-600">
          <HeartIcon className="h-11 w-11" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold uppercase tracking-tight text-ink-950">
          No favourites yet
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Tap the heart on any product to save it here for later.
        </p>
        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          Explore Products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
            Your Wishlist
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {items.length} saved {items.length === 1 ? "style" : "styles"}
          </p>
        </div>
        <button
          onClick={() => {
            wishlist.forEach((s) => toggleWishlist(s));
            toast("Wishlist cleared", "All items were removed", "info");
          }}
          className="text-sm font-semibold text-ink-500 transition hover:text-brand-600"
        >
          Clear all
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
