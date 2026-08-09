import { SectionHeading } from "@/components/shared/components/SectionHeading";
import { ArrowRight } from "@/components/shared/components/icons";
import { getCategoryBySlug } from "@/features/category/data/categories";
import { productsByCategory } from "@/features/product/data/products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function CategorySpotlight({
  slug,
  isFirst = false,
}: {
  slug: string;
  isFirst?: boolean;
}) {
  const category = getCategoryBySlug(slug);
  if (!category) return null;
  const products = productsByCategory(slug).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
      <div className="pt-12 md:pt-16">
        <SectionHeading
          align="left"
          eyebrow={isFirst ? "Editor's Picks" : undefined}
          title={category.name}
          link={`/category/${slug}`}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-100"
            >
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-sm font-bold text-white">{p.name}</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {formatPrice(p.salePrice ?? p.price)}
                  {p.salePrice && (
                    <span className="ml-2 text-xs font-medium text-ink-300 line-through">
                      {formatPrice(p.price)}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          ))}
          <div className="hidden flex-col justify-center rounded-2xl bg-ink-950 p-6 text-white md:flex">
            <p className="text-4xl font-black uppercase leading-none">
              Up to
              <br />
              40%<span className="text-brand-500">Off</span>
            </p>
            <p className="mt-3 text-sm text-ink-300">
              on this season's {category.name.toLowerCase()}
            </p>
            <Link
              href={`/category/${slug}`}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase text-ink-950 transition hover:bg-brand-600 hover:text-white"
            >
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
