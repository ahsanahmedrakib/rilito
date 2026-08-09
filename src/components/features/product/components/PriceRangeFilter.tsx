"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { formatPrice } from "@/lib/utils";

const MAX = 5000;
const STEP = 100;

export function PriceRangeFilter({ min = 0, max = MAX }: { min?: number; max?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);

  const apply = (l: number, h: number) => {
    const params = new URLSearchParams(window.location.search);
    if (l <= 0) params.delete("min");
    else params.set("min", String(l));
    if (h >= MAX) params.delete("max");
    else params.set("max", String(h));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-ink-700">
        <span>{formatPrice(lo)}</span>
        <span>{formatPrice(hi === MAX ? 4990 : hi)}</span>
      </div>
      <div className="mt-2">
        <input
          type="range"
          min={0}
          max={MAX}
          step={STEP}
          value={lo}
          onChange={(e) => setLo(Number(e.target.value))}
          onPointerUp={() => apply(lo, hi)}
          className="w-full accent-brand-600"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={0}
          max={MAX}
          step={STEP}
          value={hi}
          onChange={(e) => setHi(Number(e.target.value))}
          onPointerUp={() => apply(lo, hi)}
          className="w-full accent-brand-600"
          aria-label="Maximum price"
        />
      </div>
      <button
        onClick={() => apply(lo, hi)}
        className="mt-3 w-full rounded-xl bg-ink-950 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-600"
      >
        Apply Price
      </button>
    </div>
  );
}