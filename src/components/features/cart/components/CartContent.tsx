"use client";

import {
  ArrowRight,
  CartIcon,
  CashIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/shared/components/icons";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from "@/features/cart/data/shipping";
import { CartSkeleton } from "@/components/shared/components/CartSkeleton";
import { useStore } from "@/lib/store";
import { discountForCoupon } from "@/lib/coupons";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function CartContent() {
  const { cart, updateQty, removeFromCart, cartSubtotal, cartCount, coupons, toast, ready } =
    useStore();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping =
    cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0
      ? 0
      : SHIPPING_FEE;
  const total = cartSubtotal - discount + shipping;

  const applyPromo = () => {
    const value = discountForCoupon(coupons, promo, cartSubtotal);
    if (value > 0) {
      setDiscount(value);
      toast("Coupon applied", `${promo.trim().toUpperCase()} — ${formatPrice(value)} off`);
    } else {
      toast("Invalid coupon", "Try a different code", "info");
    }
  };

  if (!ready) {
    return <CartSkeleton />;
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-ink-100 text-ink-400">
          <CartIcon className="h-11 w-11" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold uppercase tracking-tight text-ink-950">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Bring yourself over to the shop — your future favourites are waiting.
        </p>
        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          Start Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Shopping Cart{" "}
        <span className="text-base font-semibold normal-case text-ink-500">
          ({cartCount} {cartCount === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.key}
              className="flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-200/60 sm:flex-row sm:items-center"
            >
              <Link href={`/product/${item.slug}`} className="shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-xl object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="line-clamp-1 text-sm font-bold text-ink-950 hover:text-brand-700"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-ink-500">
                      {item.color} · Size {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="shrink-0 rounded-full p-2 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-ink-200">
                    <button
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      className="grid h-8 w-8 place-items-center text-ink-600 hover:text-ink-950"
                      aria-label="Decrease"
                    >
                      <MinusIcon className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="grid h-8 w-8 place-items-center text-ink-600 hover:text-ink-950"
                      aria-label="Increase"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-base font-extrabold text-ink-950">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 lg:sticky lg:top-24">
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
            Order Summary
          </h2>

          <div className="mt-4 flex gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm outline-none focus:border-ink-950"
            />
            <button
              onClick={applyPromo}
              className="rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              Apply
            </button>
          </div>

          <dl className="mt-5 space-y-3 border-t border-ink-100 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-600">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(cartSubtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <dt>Discount {promo.trim() && `(${promo.trim().toUpperCase()})`}</dt>
                <dd className="font-semibold">-{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-600">Delivery</dt>
              <dd className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-emerald-700">FREE</span>
                ) : (
                  formatPrice(shipping)
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-ink-100 pt-4 text-base">
              <dt className="font-bold text-ink-950">Total</dt>
              <dd className="font-extrabold text-ink-950">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>

          {shipping > 0 && (
            <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
              Add {formatPrice(FREE_SHIPPING_THRESHOLD - cartSubtotal)} more to
              unlock FREE delivery.
            </p>
          )}

          <Link
            href="/checkout"
            className="mt-5 block w-full rounded-xl bg-brand-600 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 block w-full rounded-xl border border-ink-200 py-3 text-center text-sm font-semibold text-ink-900 transition hover:border-ink-400"
          >
            Continue Shopping
          </Link>

          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-ink-500">
            <CashIcon className="h-4 w-4 text-emerald-600" />
            Cash on delivery available at checkout
          </p>
        </aside>
      </div>
    </div>
  );
}

export default CartContent;
