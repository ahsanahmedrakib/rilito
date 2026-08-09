"use client";

import {
  CartIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/shared/components/icons";
import { FREE_SHIPPING_THRESHOLD } from "@/features/cart/data/shipping";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQty,
    removeFromCart,
    cartSubtotal,
    cartCount,
  } = useStore();

  if (!cartOpen) return null;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progress = Math.min(
    100,
    (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />
      <aside className="animate-fade-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <CartIcon className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-bold text-ink-950">
              Cart <span className="text-ink-400">({cartCount} items)</span>
            </h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition hover:bg-ink-100 hover:text-ink-950"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-ink-100 text-ink-400">
              <CartIcon className="h-9 w-9" />
            </div>
            <div>
              <p className="text-lg font-semibold text-ink-950">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Looks like you haven't added anything yet.
              </p>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-ink-100 px-5 py-3">
              {remaining > 0 ? (
                <p className="text-xs text-ink-600">
                  Add{" "}
                  <span className="font-bold text-brand-700">
                    {formatPrice(remaining)}
                  </span>{" "}
                  more for <span className="font-bold">FREE delivery</span>
                </p>
              ) : (
                <p className="text-xs font-semibold text-emerald-700">
                  You've unlocked FREE delivery
                </p>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {cart.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-3 rounded-2xl bg-ink-50/70 p-3"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={() => setCartOpen(false)}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="line-clamp-1 text-sm font-semibold text-ink-950 hover:text-brand-700"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        aria-label="Remove item"
                        className="shrink-0 text-ink-400 transition hover:text-brand-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {item.color} · Size {item.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-ink-200">
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="grid h-7 w-7 place-items-center text-ink-600 hover:text-ink-950"
                          aria-label="Decrease"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="grid h-7 w-7 place-items-center text-ink-600 hover:text-ink-950"
                          aria-label="Increase"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-ink-950">
                        {formatPrice(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="space-y-3 border-t border-ink-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600">Subtotal</span>
                <span className="text-xl font-extrabold text-ink-950">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
              <p className="text-xs text-ink-500">
                Delivery fee calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="block w-full rounded-xl bg-brand-600 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
              >
                Checkout Now
              </Link>
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="block w-full rounded-xl border border-ink-200 py-3 text-center text-sm font-semibold text-ink-900 transition hover:border-ink-400"
              >
                View Cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
