"use client";

import {
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
  PhoneIcon,
  TikTokIcon,
} from "@/components/shared/components/icons";
import { HOTLINE, HOTLINE_LINK, socialLinks } from "@/components/shared/data/site";
import { useStore } from "@/lib/store";
import Link from "next/link";

export function MobileMenu() {
  const { mobileOpen, setMobileOpen, categories } = useStore();
  if (!mobileOpen) return null;

  return (
    <div className="fixed inset-0 z-[92]">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={() => setMobileOpen(false)}
      />
      <aside className="animate-fade-in absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <span className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
            Rilito
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-500 hover:bg-ink-100"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="block rounded-xl bg-ink-950 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white"
          >
            Shop All
          </Link>

          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-ink-400">
            Categories
          </p>
          <ul className="mt-2 space-y-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink-800 transition hover:bg-ink-100"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-ink-400">
            More
          </p>
          <ul className="mt-2 space-y-1 text-ink-800">
            {[
              { href: "/blog", label: "Style Blog" },
              { href: "/track-order", label: "Track Order" },
              { href: "/contact", label: "Contact Us" },
              { href: "/pages/about", label: "About Us" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-ink-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <footer className="border-t border-ink-100 px-5 py-4">
          <div className="flex gap-2">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full bg-ink-100 text-ink-800 hover:bg-brand-600 hover:text-white"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full bg-ink-100 text-ink-800 hover:bg-brand-600 hover:text-white"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full bg-ink-100 text-ink-800 hover:bg-brand-600 hover:text-white"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
          <a
            href={HOTLINE_LINK}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white"
          >
            <PhoneIcon className="h-4 w-4" /> Call {HOTLINE}
          </a>
        </footer>
      </aside>
    </div>
  );
}

