"use client";

import { Breadcrumbs } from "@/components/shared/components/Breadcrumbs";
import {
  CheckIcon,
  StarFilledIcon,
} from "@/components/shared/components/icons";
import { ProductActions } from "@/features/product/components/ProductActions";
import { ProductGallery } from "@/features/product/components/ProductGallery";
import { ProductScroller } from "@/features/product/components/ProductScroller";
import { getCategoryBySlug } from "@/features/category/data/categories";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";

const sampleNames = [
  "Kazi Mahi",
  "Rafi Ahmed",
  "Ayon Hossain",
  "Shadman Sakib",
  "Jubayer Khan",
  "Mehedi Hasan",
  "Zihan Rahman",
  "Fahim Chowdhury",
];
const sampleTitles = [
  "Exactly as pictured",
  "Great quality for the price",
  "Beautiful fabric, spot-on fit",
  "Orders here regularly",
  "Better than expected",
  "Sizing guide was perfect",
];
const sampleBodies = [
  "The quality genuinely surprised me. Stitching is clean, the fabric feels premium, and delivery was faster than promised.",
  "I compared a few options before buying and this remains the best choice. Ordered a second one in another colour.",
  "Fits exactly as the description said. Went with the size I normally wear and the silhouette is exactly what I wanted.",
  "Packaging was neat and the COD inspection saved me the worry. Customer service on WhatsApp answered in minutes.",
  "Already washing it a few times and there's no fading or shrinking. Colour is true to the photos.",
  "Worth every taka. This is my third item from Rilito and they stay consistent.",
];

function seededReviews(product: Product) {
  const count = Math.min(6, (product.reviewCount % 6) + 3);
  return Array.from({ length: count }).map((_, i) => {
    const seed = (product.id.charCodeAt(2) + i * 7) % sampleNames.length;
    const daysAgo = 3 + ((i * 13 + seed) % 90);
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString();
    return {
      id: `${product.id}-r${i}`,
      author: sampleNames[(seed + i) % sampleNames.length],
      rating: product.rating - (i % 2 === 0 ? 0 : 0.2),
      title: sampleTitles[(seed + i * 2) % sampleTitles.length],
      body: sampleBodies[(seed + i * 3) % sampleBodies.length],
      date,
      verified: i !== count - 1,
    };
  });
}

function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <span className="flex text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarFilledIcon
          key={i}
          className={`${size} ${i < Math.round(rating) ? "" : "text-ink-200"}`}
        />
      ))}
    </span>
  );
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useStore();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 10);
  const fallback = products.filter((p) => p.id !== product.id).slice(0, 10);
  const relatedProducts = related.length ? related : fallback;

  const reviews = seededReviews(product);
  const stars = Math.round(product.rating);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          {
            label: category?.name ?? "Products",
            href: category ? `/category/${category.slug}` : "/products",
          },
          { label: product.name, href: undefined },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
            {category?.name ?? "Rilito"}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-950 md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <Stars rating={product.rating} />
            <span className="text-sm text-ink-500">
              {product.rating.toFixed(1)} · Based on {product.reviewCount} reviews
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink-600 md:text-base">
            {product.description}
          </p>
          <div className="mt-8">
            <ProductActions product={product} />
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-8">
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink-950">
            Product Details
          </h2>
          <ul className="mt-5 space-y-3">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm text-ink-700">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink-100 pt-6 text-center">
            <div>
              <p className="text-xs text-ink-500">Fabric Care</p>
              <p className="mt-1 text-xs font-bold text-ink-900">Machine wash</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">Origin</p>
              <p className="mt-1 text-xs font-bold text-ink-900">Made in BD</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">SKU</p>
              <p className="mt-1 text-xs font-bold text-ink-900">{product.id}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink-950">
              Reviews
            </h2>
            <div className="flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-white">
              <span className="text-lg font-black">{product.rating.toFixed(1)}</span>
              <Stars rating={stars} size="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="border-b border-ink-100 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink-950">{r.author}</p>
                  <p className="text-xs text-ink-400">{formatDate(r.date)}</p>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Stars rating={r.rating} size="h-3.5 w-3.5" />
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckIcon className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-ink-800">{r.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
            You May Also Like
          </h2>
          <Link
            href={`/category/${product.category}`}
            className="text-sm font-semibold text-ink-950 transition hover:text-brand-600"
          >
            More in {category?.name} →
          </Link>
        </div>
        <div className="mt-6">
          <ProductScroller products={relatedProducts} />
        </div>
      </section>
    </div>
  );
}