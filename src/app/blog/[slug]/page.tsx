import { Breadcrumbs } from "@/components/shared/components/Breadcrumbs";
import { ArrowRight } from "@/components/shared/components/icons";
import { FadeIn } from "@/components/shared/components/FadeIn";
import { SITE_URL } from "@/components/shared/data/site";
import { readSettingsSafely } from "@/lib/db/seed";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const settings = await readSettingsSafely();
  const post = settings.blogPosts?.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found — Rilito" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      title: `${post.title} — Rilito`,
      description: post.excerpt,
      images: [{ url: post.image, alt: post.title }],
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await readSettingsSafely();
  const post = settings.blogPosts?.find((p) => p.slug === slug);
  if (!post) notFound();

  const more = settings.blogPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Style Journal", href: "/blog" },
          { label: post.title, href: undefined },
        ]}
      />

      <FadeIn>
      <header className="mt-8">
        <p className="flex items-center gap-2 text-xs text-ink-500">
          <span className="font-bold uppercase tracking-wide text-brand-600">
            {post.category}
          </span>
          <span>·</span>
          {formatDate(post.date)} · {post.readTime} · By {post.author}
        </p>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-ink-950 md:text-5xl">
          {post.title}
        </h1>
      </header>
      </FadeIn>

      <FadeIn delay={100}>
      <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl bg-ink-100">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>
      </FadeIn>

      <FadeIn delay={150}>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-700 md:text-lg">
        {post.content.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      </FadeIn>

      <FadeIn delay={100}>
      <div className="mt-12 rounded-3xl bg-ink-950 p-8 text-center">
        <p className="text-lg font-extrabold uppercase tracking-tight text-white">
          Put these tips to work
        </p>
        <p className="mt-2 text-sm text-ink-300">
          Shop the pieces mentioned in this story.
        </p>
        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          Browse Collection <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      </FadeIn>

      {more.length > 0 && (
        <FadeIn delay={100}>
        <section className="mt-12">
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
            Keep Reading
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {more.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/60 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-ink-100">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600">
                    {p.category}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-bold text-ink-950 group-hover:text-brand-700">
                    {p.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
        </FadeIn>
      )}
    </article>
  );
}

