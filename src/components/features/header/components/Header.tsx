"use client";

import {
  CartIcon,
  ChevronRight,
  HeartIcon,
  LogoMark,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from "@/components/shared/components/icons";
import { HOTLINE } from "@/components/shared/data/site";
import { categories } from "@/features/category/data/categories";
import { quickLinks } from "@/features/header/data/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const {
    cartCount,
    wishlist,
    setCartOpen,
    setSearchOpen,
    setMobileOpen,
    user,
  } = useStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setShowCat(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  const revealCategories = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setShowCat(true);
  };
  const hideCategories = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setShowCat(false), 200);
  };

  return (
    <>
      <div className="relative overflow-hidden bg-ink-950 py-2 text-white">
        <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex items-center gap-10 text-xs font-medium tracking-wide"
            >
              <span>FREE DELIVERY ON ORDERS OVER ৳2,000</span>
              <span className="text-brand-400">✦</span>
              <span>FLAT 40% OFF SELECTED STYLES — SALE NOW LIVE</span>
              <span className="text-brand-400">✦</span>
              <span>CASH ON DELIVERY ACROSS BANGLADESH</span>
              <span className="text-brand-400">✦</span>
              <span>7-DAY EASY EXCHANGE ON ALL ORDERS</span>
              <span className="text-brand-400">✦</span>
            </div>
          ))}
        </div>
        <a
          href={`tel:${HOTLINE.replace("-", "")}`}
          className="absolute inset-y-0 right-0 z-10 hidden items-center gap-1.5 bg-ink-950 px-4 text-xs font-semibold text-brand-400 sm:flex"
        >
          <PhoneIcon className="h-3.5 w-3.5" /> {HOTLINE}
        </a>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b border-ink-100 bg-white/95 backdrop-blur transition-shadow",
          scrolled && "shadow-lg shadow-ink-950/5",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-6 lg:px-8">
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-ink-900 transition hover:bg-ink-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9 text-brand-600" />
            <span className="text-xl font-black uppercase leading-none tracking-tighter text-ink-950 md:text-2xl">
              Rilito
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-1 lg:flex">
            <Link
              href="/products"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold text-ink-800 transition hover:bg-ink-100",
                pathname === "/products" &&
                  "bg-ink-950 text-white hover:bg-ink-950",
              )}
            >
              Shop All
            </Link>
            <div
              onMouseEnter={revealCategories}
              onMouseLeave={hideCategories}
              className="relative"
            >
              <button
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-ink-800 transition hover:bg-ink-100"
                onClick={() => setShowCat((v) => !v)}
              >
                Categories
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    showCat && "rotate-90",
                  )}
                />
              </button>
              {showCat && (
                <div className="animate-scale-in absolute left-0 top-full w-[560px] pt-2">
                  <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 p-px shadow-2xl">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/category/${c.slug}`}
                        className="flex items-center gap-3 bg-white p-3 transition hover:bg-ink-50"
                      >
                        <span className="text-sm font-semibold text-ink-900">
                          {c.name}
                        </span>
                        <span className="ml-auto text-xs text-ink-400">
                          {c.tagline}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-ink-800 transition hover:bg-ink-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-900 transition hover:bg-ink-100"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            <Link
              href={user ? "/account" : "/login"}
              aria-label="Account"
              className="hidden h-10 w-10 place-items-center rounded-full text-ink-900 transition hover:bg-ink-100 sm:grid"
            >
              <UserIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink-900 transition hover:bg-ink-100"
            >
              <HeartIcon className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink-900 transition hover:bg-ink-100"
            >
              <CartIcon className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

