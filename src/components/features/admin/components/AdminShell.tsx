"use client";

import { LogoMark, MenuIcon, CloseIcon, LogoutIcon } from "@/components/shared/components/icons";
import { LoadingLogo } from "@/components/shared/components/LoadingLogo";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/hero-slides", label: "Hero Slides" },
  { href: "/admin/marquee", label: "Marquee" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payment", label: "Payment" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/track-order", label: "Track Order" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/deleted-data", label: "Deleted data" },
];

function NavLinks({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string;
  onNavigate?: () => void;
  onLogout?: () => void;
}) {
  const { logoutAdmin, toast } = useStore();
  const router = useRouter();

  const signOut = () => {
    logoutAdmin();
    toast("Signed out", "Admin session ended", "info");
    router.push("/admin/login");
  };

  return (
    <>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
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
      <div className="space-y-1 pt-6">
        <Link
          href="/"
          onClick={onNavigate}
          className="block rounded-xl px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:bg-ink-100"
        >
          View Store
        </Link>
        <button
          onClick={onLogout ?? signOut}
          className="inline-flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
        >
          <LogoutIcon className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { ready, isAdmin, logoutAdmin } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!ready || isAdmin) return;
    if (pathname !== "/admin/login") router.replace("/admin/login");
  }, [ready, isAdmin, pathname, router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <LoadingLogo label="Rilito" />
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <LoadingLogo label="Rilito" />
      </div>
    );
  }

  const signOut = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-ink-200 pr-6 md:flex">
        <Link href="/admin" className="mb-4 flex items-center gap-2.5">
          <LogoMark className="h-8 w-8 text-brand-600" />
          <span className="text-lg font-black uppercase leading-none tracking-tighter text-ink-950">
            Rilito Admin
          </span>
        </Link>
        <NavLinks pathname={pathname} onLogout={signOut} />
      </aside>

      <div className="min-w-0 flex-1 md:pl-8">
        {/* Mobile top bar with hamburger */}
        <div className="mb-6 flex items-center gap-3 md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-950 text-white transition hover:bg-brand-600"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark className="h-7 w-7 text-brand-600" />
            <span className="text-base font-black uppercase leading-none tracking-tighter text-ink-950">
              Admin
            </span>
          </Link>
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-ink-950/50"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-72 flex-col gap-1 overflow-y-auto bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <LogoMark className="h-8 w-8 text-brand-600" />
                  <span className="text-lg font-black uppercase leading-none tracking-tighter text-ink-950">
                    Rilito Admin
                  </span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-lg text-ink-600 transition hover:bg-ink-100"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <NavLinks
                pathname={pathname}
                onNavigate={() => setDrawerOpen(false)}
                onLogout={signOut}
              />
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
