"use client";

import { Breadcrumbs } from "@/components/shared/components/Breadcrumbs";
import { ArrowRight } from "@/components/shared/components/icons";
import { ProductCard } from "@/features/product/components/ProductCard";
import { useStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, categories } = useStore();
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.category === slug);
  const accent = /^#[0-9a-fA-F]{6}$/.test(category?.accent ?? "")
    ? category!.accent
    : null;

  if (!category) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950">
          Category not found
        </h1>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-bold uppercase text-white transition hover:bg-brand-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative h-[260px] overflow-hidden bg-ink-950 md:h-[340px]">
        <Image
          src={category.image}
          alt={category.name}
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/20" />
        {accent && (
          <div
            className="absolute inset-x-0 bottom-0 h-3/4"
            style={{ background: `linear-gradient(to top, ${accent}, transparent)` }}
          />
        )}
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 md:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: category.name, href: undefined },
            ]}
          />
          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
            {category.name}
          </h1>
          <p className="mt-2 max-w-lg text-sm text-ink-200 md:text-base">
            {category.tagline}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-sm text-ink-500">
            <span className="font-bold text-ink-950">{categoryProducts.length}</span>{" "}
            {categoryProducts.length === 1 ? "product" : "products"} in{" "}
            {category.name}
          </p>
          <Link
            href={`/products?category=${category.slug}`}
            className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            Open Full Filters{" "}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white py-20 text-center ring-1 ring-ink-200/60">
            <p className="text-lg font-bold text-ink-950">Nothing here yet</p>
            <p className="mt-2 text-sm text-ink-500">
              New styles for this category are on the way.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
            {categoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}