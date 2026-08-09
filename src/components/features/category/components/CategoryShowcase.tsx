import { ArrowRight } from "@/components/shared/components/icons";
import { SectionHeading } from "@/components/shared/components/SectionHeading";
import { categories } from "@/features/category/data/categories";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 md:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Curated Collections"
        title="Shop By Category"
        description="Find your fit across ten carefully edited collections — from everyday essentials to full occasion wear."
        link="/products"
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {categories.map((c, i) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={cn(
              "group relative overflow-hidden rounded-2xl",
              i < 2
                ? "col-span-2 aspect-[16/10] md:col-span-2"
                : i === 2
                  ? "aspect-[16/10] md:col-span-1"
                  : "aspect-square",
            )}
          >
            <Image
              src={c.image}
              alt={c.name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="text-lg font-extrabold uppercase tracking-tight text-white md:text-xl">
                {c.name}
              </h3>
              <p className="mt-0.5 text-xs text-ink-200">{c.tagline}</p>
              <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur transition group-hover:bg-brand-600">
                Shop Now{" "}
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
