import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/60 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`relative overflow-hidden bg-ink-100 ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
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
        <h3
          className={`mt-2 line-clamp-2 font-bold text-ink-950 group-hover:text-brand-700 ${
            compact ? "text-sm" : "text-lg"
          }`}
        >
          {post.title}
        </h3>
        {!compact && <p className="mt-2 line-clamp-2 text-sm text-ink-500">{post.excerpt}</p>}
      </div>
    </Link>
  );
}