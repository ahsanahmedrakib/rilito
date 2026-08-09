"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import {
  ChevronLeft,
  ChevronRight,
} from "@/components/shared/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const swiper = useRef<SwiperClass | null>(null);
  const [active, setActive] = useState(0);
  const loop = images.length > 1;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-ink-100">
        <Swiper
          loop={loop}
          onSwiper={(s) => (swiper.current = s)}
          onSlideChange={(s) => setActive(s.realIndex)}
          className="h-full w-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative h-full w-full">
                <Image
                  src={img}
                  alt={`${name} — view ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {loop && (
          <>
            <button
              onClick={() => swiper.current?.slidePrev()}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => swiper.current?.slideNext()}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow transition hover:bg-white"
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
              onClick={() => {
                if (loop) swiper.current?.slideToLoop(i);
                else swiper.current?.slideTo(i);
              }}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-xl ring-2 transition",
                active === i ? "ring-brand-600" : "ring-transparent hover:ring-ink-300"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}