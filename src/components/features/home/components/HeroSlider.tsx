"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import {
  ChevronLeft,
  ChevronRight,
} from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import type { HeroSlide } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

const fallbackSlides: HeroSlide[] = [
  {
    id: "slide-tshirts",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "New Season · Street & Classic",
    title: "Wear The Moment",
    subtitle:
      "Heavyweight tees, sharp shirts and relaxed fits — cut for the way you actually dress.",
    cta: { href: "/category/t-shirts", label: "Shop T-Shirts" },
    order: 1,
    active: true,
  },
  {
    id: "slide-panjabi",
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Panjabi · Eid & Beyond",
    title: "Elegance In Every Thread",
    subtitle:
      "From classic cotton to intricate embroidery, find the panjabi that carries the occasion.",
    cta: { href: "/category/panjabi", label: "Explore Panjabi" },
    order: 2,
    active: true,
  },
  {
    id: "slide-winter",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Winter Drop · Up to 40% Off",
    title: "Bundle Up In Style",
    subtitle:
      "Quilted bombers, puffer jackets and cosy knits that handle the cold without hiding your look.",
    cta: { href: "/category/winter", label: "Shop Winter" },
    order: 3,
    active: true,
  },
];

export function HeroSlider() {
  const swiper = useRef<SwiperClass | null>(null);
  const { settings, ready } = useStore();

  const source = !ready ? fallbackSlides : settings.heroSlides;
  const slides = (source && source.length
    ? source
    : fallbackSlides
  )
    .filter((s) => s.active !== false)
    .sort((a, b) => a.order - b.order);

  if (slides.length === 0) return null;

  return (
    <section className="relative aspect-4/5 overflow-hidden bg-ink-950 sm:aspect-video lg:aspect-21/9">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        onSwiper={(s) => (swiper.current = s)}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-ink-950/85 via-ink-950/45 to-transparent" />
              <div className="relative flex h-full items-center">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
                  <div className="max-w-xl">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-400">
                      {slide.eyebrow}
                    </p>
                    <h1 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
                      {slide.title}
                    </h1>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-ink-200 md:text-lg">
                      {slide.subtitle}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <Link
                        href={slide.cta?.href ?? "/products"}
                        className="rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-700"
                      >
                        {slide.cta?.label ?? "Shop Now"}
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
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiper.current?.slidePrev()}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-ink-950 sm:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => swiper.current?.slideNext()}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-ink-950 sm:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </section>
  );
}