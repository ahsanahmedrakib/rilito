"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import {
  ChevronLeft,
  ChevronRight,
} from "@/components/shared/components/icons";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductScroller({
  products,
  height = "auto",
}: {
  products: Product[];
  height?: string;
}) {
  const swiper = useRef<SwiperClass | null>(null);
  const showNav = products.length > 4;

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, FreeMode]}
        freeMode
        slidesPerView={1.5}
        spaceBetween={16}
        breakpoints={{
          480: { slidesPerView: 2.2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        onSwiper={(s) => (swiper.current = s)}
        className="px-4"
        style={{ height }}
      >
        {products.map((p, i) => (
          <SwiperSlide key={i} style={{ height: "auto" }}>
            <ProductCard product={p} />
          </SwiperSlide>
        ))}
      </Swiper>

      {showNav && (
        <div className="absolute -top-14 right-0 hidden gap-2 lg:flex">
          <button
            onClick={() => swiper.current?.slidePrev()}
            aria-label="Scroll left"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-900 transition hover:border-ink-950 hover:bg-ink-950 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => swiper.current?.slideNext()}
            aria-label="Scroll right"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-900 transition hover:border-ink-950 hover:bg-ink-950 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}