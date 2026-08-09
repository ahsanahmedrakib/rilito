"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "@/components/shared/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const change = (dir: 1 | -1) => {
    setActive(
      (((active + dir) % images.length) + images.length) % images.length,
    );
  };

  return (
    <div>
      <div
        className="relative aspect-square overflow-hidden rounded-3xl bg-ink-100"
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchStart;
          if (dx > 40) change(-1);
          if (dx < -40) change(1);
        }}
      >
        <Image
          src={images[active]}
          alt={`${name} — view ${active + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => change(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => change(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-xl ring-2 transition",
                active === i
                  ? "ring-brand-600"
                  : "ring-transparent hover:ring-ink-300",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
