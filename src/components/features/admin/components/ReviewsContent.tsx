"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-ink-100 text-ink-500",
};

const filters = ["pending", "approved", "rejected"] as const;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500">
      {"★".repeat(Math.round(rating))}
      <span className="text-ink-200">{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

export default function ReviewsContent() {
  const { reviews, setReviewStatus, toast } = useStore();
  const [filter, setFilter] = useState<string>("pending");

  const filtered = useMemo(
    () => [...reviews].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [reviews]
  ).filter((r) => filter === "all" || r.status === filter);

  const counts = {
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Reviews
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Customer reviews are held for moderation. Accept them to show on the
        product page, or reject to hide.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition ${
              filter === f
                ? "bg-ink-950 text-white"
                : "border border-ink-200 bg-white text-ink-700 hover:border-ink-950"
            }`}
          >
            {f} {counts[f as keyof typeof counts] > 0 && `(${counts[f as keyof typeof counts]})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white py-16 text-center text-sm text-ink-500 ring-1 ring-ink-200/60">
          No {filter} reviews yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {filtered.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-ink-950">{r.author}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColors[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-500">
                    on {r.productName} · {formatDate(r.date)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Stars rating={r.rating} />
                  <span className="text-sm font-bold text-ink-900">
                    {r.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-ink-900">{r.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{r.body}</p>

              <div className="mt-4 flex gap-2 border-t border-ink-100 pt-4">
                <button
                  onClick={() => {
                    setReviewStatus(r.id, "approved");
                    toast("Review approved", "It's now visible on the product page");
                  }}
                  disabled={r.status === "approved"}
                  className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-40"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    setReviewStatus(r.id, "rejected");
                    toast("Review rejected", r.author, "info");
                  }}
                  disabled={r.status === "rejected"}
                  className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-600 hover:bg-red-50 disabled:opacity-40"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
