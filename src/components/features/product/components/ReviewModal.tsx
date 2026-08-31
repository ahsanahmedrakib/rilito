"use client";

import { CloseIcon, StarFilledIcon } from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useState } from "react";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600";

export function ReviewModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const { user, submitReview, toast } = useStore();
  const [name, setName] = useState(user?.name ?? "");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!body.trim() || body.trim().length < 5) {
      setError("Please write a short review (at least 5 characters).");
      return;
    }
    submitReview({
      id: `rev-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      author: name.trim(),
      rating,
      title: title.trim() || "My review",
      body: body.trim(),
      date: new Date().toISOString(),
      verified: !!user,
      status: "pending",
    });
    toast("Review submitted", "It will appear once approved by an admin");
    setTitle("");
    setBody("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-96 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-scale-in relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
            Review this product
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-500 hover:bg-ink-100"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-ink-500">{product.name}</p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className={labelCls}>Your name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className={labelCls}>Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const n = i + 1;
                const active = n <= (hover || rating);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                    className="text-3xl"
                  >
                    <StarFilledIcon
                      className={cn(
                        "h-8 w-8 transition",
                        active ? "text-amber-500" : "text-ink-200"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelCls}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              placeholder="e.g. Great quality"
            />
          </div>

          <div>
            <label className={labelCls}>Review *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              className={cn(inputCls, "resize-none")}
              placeholder="Share your experience with this product..."
            />
          </div>

          {error && (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-ink-950 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600"
          >
            Submit Review
          </button>
          <p className="text-center text-xs text-ink-400">
            Reviews are moderated — your review appears after admin approval.
          </p>
        </form>
      </div>
    </div>
  );
}
