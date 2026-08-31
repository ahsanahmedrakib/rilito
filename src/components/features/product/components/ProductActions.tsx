"use client";

import {
  HeartIcon,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  RefreshIcon,
  TruckIcon,
} from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn, discountPercent, formatPrice, sizeStockMap } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SizeGuideLink } from "./SizeGuideModal";

export function ProductActions({ product }: { product: Product }) {
  const { addToCart, isWishlisted, toggleWishlist, toast } = useStore();
  const router = useRouter();
  const stockBySize = sizeStockMap(product);
  const defaultSize =
    product.sizes.find((s) => (stockBySize[s] ?? 0) > 0) ??
    product.sizes[0];
  const [size, setSize] = useState(defaultSize);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);

  const wished = isWishlisted(product.slug);
  const onSale = !!product.salePrice;
  const price = product.salePrice ?? product.price;
  const lowStock = product.stock <= 20 && product.stock > 0;
  const outOfStock = product.stock <= 0 || (size ? (stockBySize[size] ?? 0) <= 0 : false);
  const sizeAvailable = size ? (stockBySize[size] ?? 0) > 0 : false;
  const maxQty = Math.max(1, stockBySize[size] ?? product.stock);

  const handleAdd = () => {
    addToCart(product, size, color, qty);
    toast("Added to cart", `${product.name} · ${color} · ${size}`);
  };

  const handleBuy = () => {
    addToCart(product, size, color, qty);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-1">
          <span className="text-3xl font-black text-ink-950 md:text-4xl">
            {formatPrice(price)}
          </span>
          {onSale && (
            <>
              <span className="text-lg font-medium text-ink-400 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">
                -{discountPercent(product.price, product.salePrice)}%
              </span>
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-ink-500">
          Inclusive of all taxes · Delivery calculated at checkout
        </p>
      </div>

      {product.colors.length > 1 && (
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-ink-950">
            Color:{" "}
            <span className="font-medium normal-case text-ink-600">
              {color}
            </span>
          </p>
          <div className="mt-2.5 flex gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                aria-label={`Select color ${c.name}`}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition",
                  color === c.name
                    ? "border-brand-600 ring-2 ring-brand-600/20"
                    : "border-ink-200 hover:border-ink-400",
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-ink-950">
          Size
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {product.sizes.map((s) => {
            const noStock = (stockBySize[s] ?? 0) <= 0;
            return (
              <button
                key={s}
                onClick={() => setSize(s)}
                disabled={noStock}
                className={cn(
                  "min-w-[52px] rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                  noStock && "cursor-not-allowed border-ink-100 text-ink-300 line-through",
                  !noStock && size === s
                    ? "border-ink-950 bg-ink-950 text-white"
                    : !noStock && "border-ink-200 bg-white text-ink-800 hover:border-ink-950",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        <SizeGuideLink product={product} /> 
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-xl border border-ink-200">
          <button
            onClick={() => setQty((v) => Math.max(1, v - 1))}
            disabled={outOfStock}
            className="grid h-12 w-12 place-items-center text-ink-700 hover:text-ink-950 disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-base font-bold">{qty}</span>
          <button
            onClick={() => setQty((v) => Math.min(maxQty, v + 1))}
            disabled={outOfStock}
            className="grid h-12 w-12 place-items-center text-ink-700 hover:text-ink-950 disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleBuy}
          disabled={outOfStock}
          className="flex-1 rounded-xl bg-brand-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-500"
        >
          Buy Now
        </button>
        <button
          onClick={() => {
            toggleWishlist(product.slug);
            toast(
              wished ? "Removed from wishlist" : "Saved to wishlist",
              product.name,
              wished ? "info" : "success",
            );
          }}
          aria-label="Toggle wishlist"
          className={cn(
            "grid h-12 w-12 place-items-center rounded-xl border transition",
            wished
              ? "border-brand-600 text-brand-600"
              : "border-ink-200 text-ink-800 hover:border-brand-600 hover:text-brand-600",
          )}
        >
          <HeartIcon
            className={cn(
              "h-5 w-5",
              wished && "fill-brand-600 stroke-brand-600",
            )}
          />
        </button>
      </div>

      {outOfStock ? (
        <button
          disabled
          className="w-full cursor-not-allowed rounded-xl bg-ink-200 py-4 text-sm font-bold uppercase tracking-wide text-ink-500"
        >
          Unavailable
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full rounded-xl bg-ink-950 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-ink-800"
        >
          Add to Cart
        </button>
      )}

      {outOfStock ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {sizeAvailable ? "Out of stock" : `Size ${size} is out of stock — please pick another size.`}
        </p>
      ) : (
        lowStock && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Only {stockBySize[size] ?? product.stock} left in size {size} — order soon
          </p>
        )
      )}

      <div className="space-y-3 rounded-2xl bg-ink-50 p-4 text-sm">
        <p className="flex items-center gap-3">
          <TruckIcon className="h-5 w-5 shrink-0 text-brand-600" />
          <span className="text-ink-700">
            Free delivery on orders over ৳2,000 · Estimated 1–3 days inside
            Dhaka
          </span>
        </p>
        <p className="flex items-center gap-3">
          <PackageIcon className="h-5 w-5 shrink-0 text-brand-600" />
          <span className="text-ink-700">
            Cash on Delivery available — inspect before you pay
          </span>
        </p>
        <p className="flex items-center gap-3">
          <RefreshIcon className="h-5 w-5 shrink-0 text-brand-600" />
          <span className="text-ink-700">
            7-day easy exchange on all unworn, tagged items
          </span>
        </p>
      </div>
    </div>
  );
}
