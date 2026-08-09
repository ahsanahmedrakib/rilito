"use client";

import { ChevronRight } from "@/components/shared/components/icons";
import { usePathname, useRouter } from "next/navigation";

const options = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best Selling" },
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const update = (next: string) => {
    const params = new URLSearchParams(window.location.search);
    if (next === "featured") params.delete("sort");
    else params.set("sort", next);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => update(e.target.value)}
        aria-label="Sort products"
        className="appearance-none rounded-xl border border-ink-200 bg-white py-2.5 pl-4 pr-9 text-sm font-semibold text-ink-900 outline-none transition focus:border-ink-950"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-ink-500" />
    </div>
  );
}
