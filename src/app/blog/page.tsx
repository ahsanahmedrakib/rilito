import { ArrowRight } from "@/components/shared/components/icons";
import { blogPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Style Journal — Rilito",
  description:
    "Style guides, menswear trends and fabric tips from the Rilito style desk.",
};

export default function BlogIndexPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">
          Style Journal
        </p>
        <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight text-ink-950 md:text-5xl">
          Stories From The Rilito Desk
        </h1>
        <p className="mt-3 text-sm text-ink-500 md:text-base">
          Practical style guides, seasonal trends and the fabric know-how behind
          every great fit.
        </p>
      </div>

      <Link
        href={`/blog/${featured.slug}`}
        className="group mt-10 grid overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/60 md:grid-cols-2"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-100 md:aspect-auto">
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            priority
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center p-7 md:p-10">
          <p className="flex items-center gap-2 text-xs text-ink-500">
            <span className="font-bold uppercase tracking-wide text-brand-600">
              {featured.category}
            </span>
            <span>·</span>
            {formatDate(featured.date)} · {featured.readTime}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-ink-950 group-hover:text-brand-700 md:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-600 md:text-base">
            {featured.excerpt}
          </p>
          <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition group-hover:bg-brand-600">
            Read Story{" "}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/60 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
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
              <h3 className="mt-2 line-clamp-2 text-lg font-bold text-ink-950 group-hover:text-brand-700">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-ink-500">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
