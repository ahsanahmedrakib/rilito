"use client";

import {
  ArrowRight,
  CashIcon,
  RefreshIcon,
  ShieldIcon,
  StarFilledIcon,
  TruckIcon,
} from "@/components/shared/components/icons";
import { SectionHeading } from "@/components/shared/components/SectionHeading";
import { SiteSkeleton } from "@/components/shared/components/SiteSkeleton";
import { HeroSlider } from "@/features/home/components/HeroSlider";
import { Newsletter } from "@/features/home/components/Newsletter";
import { ProductScroller } from "@/features/product/components/ProductScroller";
import { useStore } from "@/lib/store";
import type { HomeValueIcon } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const valueIcons: Record<
  HomeValueIcon,
  (props: { className?: string }) => React.ReactNode
> = {
  truck: TruckIcon,
  cash: CashIcon,
  refresh: RefreshIcon,
  shield: ShieldIcon,
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function HomeContent() {
  const { products, categories, settings, reviews: allReviews, ready } = useStore();
  const { homeValues, testimonials, blogPosts, editorialBanner } = settings;
  const bestSellers = products.filter((p) => p.isBestSeller);
  const newArrivals = products.filter((p) => p.isNew);
  const byCategory = (slug: string) =>
    products.filter((p) => p.category === slug);

  const approvedReviews = allReviews.filter((r) => r.status === "approved");
  const reviewTestimonials = approvedReviews.map((r) => ({
    name: r.author,
    role: `Verified buyer · ${r.productName || "Rilito"}`,
    text: r.body || r.title || "",
    initials: initialsOf(r.author),
    rating: r.rating,
  }));
  const displayTestimonials =
    reviewTestimonials.length >= 3 ? reviewTestimonials.slice(0, 3) : testimonials;

  if (!ready) return <SiteSkeleton />;

  return (
    <>
      <HeroSlider />

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeValues.map((v) => {
            const Icon = valueIcons[v.icon] ?? ShieldIcon;
            return (
              <div
                key={v.title}
                className="group flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200/60"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink-950 text-brand-500 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-950">{v.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    {v.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
              className={`group relative overflow-hidden rounded-2xl ${
                i < 2
                  ? "col-span-2 aspect-16/10 md:col-span-2"
                  : i === 2
                    ? "aspect-16/10 md:col-span-1"
                    : "aspect-square"
              } ${i === 0 || i === 1 ? "md:aspect-16/10" : ""}`}
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
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

      <section className="mx-auto max-w-7xl px-4 pb-4 md:px-6 lg:px-8">
        <div className="pt-12 md:pt-16">
          <SectionHeading
            eyebrow="Most Loved"
            title="Best Sellers"
            description="The styles our customers buy again and again — restocked, not reserved."
            link="/products?sort=best-selling"
          />
          <ProductScroller products={bestSellers.slice(0, 10)} />
        </div>
      </section>

      <section className="relative mt-10 overflow-hidden bg-ink-950">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:px-6 lg:px-8">
          <div className="relative order-2 aspect-4/3 overflow-hidden rounded-3xl md:order-1">
            <Image
              src={editorialBanner.image}
              alt={editorialBanner.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-400">
              {editorialBanner.eyebrow}
            </p>
            <h2 className="mt-3 whitespace-pre-line text-3xl font-black uppercase leading-tight tracking-tight text-white md:text-5xl">
              {editorialBanner.title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-300 md:text-base">
              {editorialBanner.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={editorialBanner.primaryCta.href}
                className="rounded-full bg-brand-600 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
              >
                {editorialBanner.primaryCta.label}
              </Link>
              <Link
                href={editorialBanner.secondaryCta.href}
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-ink-950"
              >
                {editorialBanner.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="pt-12 md:pt-16">
          <SectionHeading
            eyebrow="Just Landed"
            title="New Arrivals"
            description="Fresh drops every week. Be the first to cop the newest fits."
            link="/products?sort=new"
          />
          <ProductScroller
            products={[...newArrivals, ...bestSellers.slice(0, 4)].slice(0, 10)}
          />
        </div>
      </section>

      {(["pants", "t-shirts", "shirts"] as const).map((catSlug, idx) => {
        const cat = categories.find((c) => c.slug === catSlug)!;
        return (
          <section
            key={catSlug}
            className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8"
          >
            <div className="pt-12 md:pt-16">
              <SectionHeading
                align="left"
                eyebrow={idx === 0 ? "Editor's Picks" : undefined}
                title={cat?.name}
                link={`/category/${catSlug}`}
              />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                {byCategory(catSlug)
                  .slice(0, 4)
                  .map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      className="group relative aspect-3/4 overflow-hidden rounded-2xl bg-ink-100"
                    >
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-ink-950/85 via-transparent to-transparent opacity-90" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-sm font-bold text-white">{p.name}</p>
                        <p className="mt-0.5 text-sm font-semibold text-white">
                          ৳{(p.salePrice ?? p.price).toLocaleString("en-IN")}
                          {p.salePrice && (
                            <span className="ml-2 text-xs font-medium text-ink-300 line-through">
                              ৳{p.price.toLocaleString("en-IN")}
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
                    on this season&rsquo;s {cat?.name.toLowerCase()}
                  </p>
                  <Link
                    href={`/category/${catSlug}`}
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase text-ink-950 transition hover:bg-brand-600 hover:text-white"
                  >
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Wall of Love"
          title="What Customers Say"
          description="Real reviews from real deliveries — no ghosts, no filters."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {displayTestimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200/60"
            >
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarFilledIcon
                    key={i}
                    className={`h-4 w-4 ${i < (t.rating ?? 5) ? "" : "text-ink-200"}`}
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-xs font-extrabold text-brand-700">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-950">{t.name}</p>
                  <p className="text-xs text-ink-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Style Journal"
          title="Latest From The Blog"
          link="/blog"
          linkLabel="All Posts"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/60 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-ink-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <p className="flex items-center gap-2 text-xs text-ink-500">
                  <span className="font-semibold uppercase tracking-wide text-brand-600">
                    {post.category}
                  </span>
                  <span>·</span>
                  {formatDate(post.date)} · {post.readTime}
                </p>
                <h3 className="mt-2 line-clamp-2 text-base font-bold text-ink-950 group-hover:text-brand-700">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-500">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-16">
        <Newsletter />
      </div>
    </>
  );
}

