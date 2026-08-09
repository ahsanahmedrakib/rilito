"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "@/components/shared/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "New Season · Street & Classic",
    title: "Wear The Moment",
    subtitle:
      "Heavyweight tees, sharp shirts and relaxed fits — cut for the way you actually dress.",
    cta: { href: "/category/t-shirts", label: "Shop T-Shirts" },
  },
  {
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Panjabi · Eid & Beyond",
    title: "Elegance In Every Thread",
    subtitle:
      "From classic cotton to intricate embroidery, find the panjabi that carries the occasion.",
    cta: { href: "/category/panjabi", label: "Explore Panjabi" },
  },
  {
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Winter Drop · Up to 40% Off",
    title: "Bundle Up In Style",
    subtitle:
      "Quilted bombers, puffer jackets and cosy knits that handle the cold without hiding your look.",
    cta: { href: "/category/winter", label: "Shop Winter" },
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (next: number) => {
    setCurrent((next + slides.length) % slides.length);
  };

  useEffect(() => {
    timer.current = setInterval(() => go(1), 6000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative aspect-[4/5] overflow-hidden bg-ink-950 sm:aspect-[16/9] lg:aspect-[21/9]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/45 to-transparent" />
          <div className="relative flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
              <div className="max-w-xl">
                <p className="animate-fade-in text-sm font-bold uppercase tracking-[0.25em] text-brand-400">
                  {slide.eyebrow}
                </p>
                <h1
                  className={cn(
                    "mt-3 text-4xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl",
                    i === current && "animate-fade-in",
                  )}
                >
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-md text-base leading-relaxed text-ink-200 md:text-lg">
                  {slide.subtitle}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href={slide.cta.href}
                    className="rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-700"
                  >
                    {slide.cta.label}
                  </Link>
                  <Link
                    href="/products"
                    className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white hover:text-ink-950"
                  >
                    Shop All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => go(current - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-ink-950 sm:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(current + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-ink-950 sm:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              i === current
                ? "w-8 bg-brand-500"
                : "w-2 bg-white/50 hover:bg-white",
            )}
          />
        ))}
      </div>
    </section>
  );
}
