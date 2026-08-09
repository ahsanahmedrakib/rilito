"use client";

import {
  HeartIcon,
  StarFilledIcon,
} from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { isWishlisted, toggleWishlist, addToCart, toast } = useStore();
  const wished = isWishlisted(product.slug);
  const onSale = !!product.salePrice;
  const stars = Math.round(product.rating);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-950/10">
      <div className="relative aspect-square overflow-hidden bg-ink-100">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={priority}
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {onSale && (
            <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              -{discountPercent(product.price, product.salePrice)}%
            </span>
          )}
          {product.isNew && !onSale && (
            <span className="rounded-full bg-ink-950/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              New
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            toggleWishlist(product.slug);
            toast(
              wished ? "Removed from wishlist" : "Saved to wishlist",
              product.name,
              wished ? "info" : "success",
            );
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-700 shadow-sm backdrop-blur transition hover:scale-110 hover:text-brand-600"
        >
          <HeartIcon
            className={`h-[18px] w-[18px] ${wished ? "fill-brand-600 stroke-brand-600 text-brand-600" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={() => {
            addToCart(product, product.sizes[0], product.colors[0].name, 1);
            toast("Added to cart", product.name);
          }}
          className="absolute inset-x-3 bottom-3 hidden items-center justify-center gap-2 rounded-xl bg-ink-950/90 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-brand-600 sm:flex"
        >
          Add to Cart
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link
          href={`/product/${product.slug}`}
          className="group-hover:text-brand-700"
        >
          <h3 className="line-clamp-1 text-sm font-semibold text-ink-900">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-amber-500">
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarFilledIcon
                key={i}
                className={`h-3.5 w-3.5 ${i < stars ? "" : "text-ink-200"}`}
              />
            ))}
          </span>
          <span className="text-xs text-ink-500">({product.reviewCount})</span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-bold text-ink-950">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {onSale && (
            <span className="text-sm font-medium text-ink-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
