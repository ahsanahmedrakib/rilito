"use client";

import { CloseIcon, SearchIcon } from "@/components/shared/components/icons";
import { trendingSearches } from "@/features/search/data/trending";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, products } = useStore();
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  if (!searchOpen) return null;

  const results =
    query.trim().length >= 2
      ? products
          .filter((p) =>
            `${p.name} ${p.category} ${p.tags.join(" ")}`
              .toLowerCase()
              .includes(query.trim().toLowerCase())
          )
          .slice(0, 6)
      : [];

  const submit = () => {
    if (!query.trim()) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-[95]">
      <div
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        onClick={() => setSearchOpen(false)}
      />
      <div className="animate-fade-in relative mx-auto mt-20 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl md:mt-28 md:p-6">
        <div className="flex items-center gap-3 rounded-xl border-2 border-ink-200 px-4 py-3 focus-within:border-brand-600">
          <SearchIcon className="h-5 w-5 text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Search pants, panjabi, hoodies…"
            className="flex-1 bg-transparent text-base text-ink-950 outline-none placeholder:text-ink-400"
          />
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-950"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {query.trim().length < 2 ? (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-400">
              Trending now
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {trendingSearches.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setQuery(t);
                    setSearchOpen(false);
                    router.push(`/search?q=${encodeURIComponent(t)}`);
                  }}
                  className="rounded-full bg-ink-100 px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-950 hover:text-white"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {results.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-500">
                No products match &ldquo;{query}&rdquo;. Try another keyword.
              </p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 py-2.5 hover:bg-ink-50"
                    >
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-950">
                          {p.name}
                        </p>
                        <p className="text-xs text-ink-500">{p.category}</p>
                      </div>
                      <span className="text-sm font-bold text-ink-950">
                        {formatPrice(p.salePrice ?? p.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {results.length > 0 && (
              <button
                onClick={submit}
                className="mt-3 w-full rounded-xl bg-ink-950 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                See all results
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
