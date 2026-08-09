"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "@/components/shared/components/icons";
import type { Product } from "@/lib/types";
import { useRef } from "react";
import { ProductCard } from "./ProductCard";

export function ProductScroller({
  products,
  height = "auto",
}: {
  products: Product[];
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8"
        style={{ height }}
      >
        {products.map((p, i) => (
          <div key={i} className="w-[46vw] shrink-0 snap-start sm:w-70">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      {products.length > 4 && (
        <>
          <div className="pointer-events-none absolute -left-1 top-1/2 z-10 hidden w-16 -translate-y-1/2 from-cream to-transparent lg:block lg:bg-linear-to-r" />
          <div className="pointer-events-none absolute -right-1 top-1/2 z-10 hidden w-16 -translate-y-1/2 from-cream to-transparent lg:block lg:bg-linear-to-l" />
          <div className="absolute -top-14 right-0 hidden gap-2 lg:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-900 transition hover:border-ink-950 hover:bg-ink-950 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-900 transition hover:border-ink-950 hover:bg-ink-950 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

