"use client";

import { LogoMark } from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/track-order", label: "Track Order" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/deleted-data", label: "Deleted data" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/coupons", label: "Coupons" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { ready, isAdmin, logoutAdmin, toast } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready || isAdmin) return;
    if (pathname !== "/admin/login") router.replace("/admin/login");
  }, [ready, isAdmin, pathname, router]);

  if (!ready) {
    return (
      <div className="grid min-h-[80vh] place-items-center text-sm text-ink-500">
        Checking access...
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;

  if (!isAdmin) {
    return (
      <div className="grid min-h-[80vh] place-items-center text-sm text-ink-500">
        Checking access...
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-ink-200 pr-6 md:flex">
        <Link href="/admin" className="mb-4 flex items-center gap-2.5">
          <LogoMark className="h-8 w-8 text-brand-600" />
          <span className="text-lg font-black uppercase leading-none tracking-tighter text-ink-950">
            Rilito Admin
          </span>
        </Link>
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-4 py-2.5 text-sm font-bold transition",
              pathname === item.href
                ? "bg-ink-950 text-white"
                : "text-ink-700 hover:bg-ink-100"
            )}
          >
            {item.label}
          </Link>
        ))}
        <div className="mt-auto space-y-1 pt-6">
          <Link
            href="/"
            className="block rounded-xl px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:bg-ink-100"
          >
            View Store
          </Link>
          <button
            onClick={() => {
              logoutAdmin();
              toast("Signed out", "Admin session ended", "info");
              router.push("/admin/login");
            }}
            className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 md:pl-8">
        <nav className="mb-6 flex items-center gap-1 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-center text-xs font-bold transition",
                pathname === item.href
                  ? "bg-ink-950 text-white"
                  : "border border-ink-200 bg-white text-ink-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}