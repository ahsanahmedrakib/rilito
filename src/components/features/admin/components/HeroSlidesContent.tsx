"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import type { HeroSlide } from "@/lib/types";
import { ImageUploader } from "@/features/admin/components/ImageUploader";
import { CloseIcon } from "@/components/shared/components/icons";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600";

function HeroSlideForm({
  slide,
  onSave,
  onCancel,
}: {
  slide?: HeroSlide;
  onSave: (s: HeroSlide) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(slide?.title ?? "");
  const [eyebrow, setEyebrow] = useState(slide?.eyebrow ?? "");
  const [subtitle, setSubtitle] = useState(slide?.subtitle ?? "");
  const [image, setImage] = useState(slide?.image ?? "");
  const [ctaLabel, setCtaLabel] = useState(slide?.cta?.label ?? "");
  const [ctaHref, setCtaHref] = useState(slide?.cta?.href ?? "");
  const [active, setActive] = useState(slide?.active !== false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: slide?.id ?? `slide-${Date.now()}`,
      order: slide?.order ?? 0,
      active,
      image: image.trim(),
      eyebrow: eyebrow.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      cta: {
        href: ctaHref.trim() || "/products",
        label: ctaLabel.trim() || "Shop Now",
      },
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-ink-200/60">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
          {slide ? "Edit Slide" : "Add Slide"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-ink-200 px-4 py-1.5 text-xs font-bold text-ink-700 transition hover:border-ink-950"
        >
          Cancel
        </button>
      </div>

      <div>
        <label className={labelCls}>Headline *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
          placeholder="e.g. Wear The Moment"
        />
      </div>

      <div>
        <label className={labelCls}>Eyebrow / kicker</label>
        <input
          value={eyebrow}
          onChange={(e) => setEyebrow(e.target.value)}
          className={inputCls}
          placeholder="e.g. New Season · Street & Classic"
        />
      </div>

      <div>
        <label className={labelCls}>Subtitle</label>
        <textarea
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          rows={3}
          className={cn(inputCls, "resize-none")}
          placeholder="Short supporting paragraph shown on the banner"
        />
      </div>

      <ImageUploader
        value={image}
        onChange={setImage}
        label="Background image"
        aspect="video"
        hint="Wide banner image. Recommended around 1600px wide."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Button label</label>
          <input
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            className={inputCls}
            placeholder="Shop T-Shirts"
          />
        </div>
        <div>
          <label className={labelCls}>Button link</label>
          <input
            value={ctaHref}
            onChange={(e) => setCtaHref(e.target.value)}
            className={inputCls}
            placeholder="/category/t-shirts"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-5 w-5 accent-ink-950"
        />
        <span className="text-sm font-semibold text-ink-800">Active (shown on homepage)</span>
      </label>

      <button
        type="submit"
        className="w-full rounded-xl bg-ink-950 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600"
      >
        {slide ? "Save Changes" : "Add Slide"}
      </button>
    </form>
  );
}

function AdminHeroSlidesManager() {
  const { settings, saveHeroSlide, deleteHeroSlide, reorderHeroSlide, toast } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState("");

  const slides = [...(settings.heroSlides ?? [])].sort((a, b) => a.order - b.order);

  const editing = params.get("edit")
    ? slides.find((s) => s.id === params.get("edit"))
    : undefined;
  const adding = !!params.get("new");

  const clearParams = () => router.replace("/admin/hero-slides");

  const filtered = slides.filter((s) =>
    `${s.title} ${s.eyebrow}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  if (adding || editing) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
          {editing ? "Edit Slide" : "Add Slide"}
        </h1>
        <div className="mt-6">
          <HeroSlideForm
            slide={editing}
            onCancel={clearParams}
            onSave={(slide) => {
              saveHeroSlide(slide);
              toast(editing ? "Slide updated" : "Slide added", slide.title, "success");
              clearParams();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
          Hero Slides
        </h1>
        <Link
          href="/admin/hero-slides?new=1"
          className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          + Add Slide
        </Link>
      </div>
      <p className="mt-2 text-sm text-ink-500">
        Manage the banner carousel on the homepage. Order controls slide sequence and
        inactive slides are hidden.
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search slides..."
        className="mt-6 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink-950"
      />

      <ul className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-2xl bg-white py-14 text-center text-sm text-ink-500 ring-1 ring-ink-200/60">
            No slides found.
          </p>
        ) : (
          filtered.map((s, i) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 ring-1 ring-ink-200/60"
            >
              <div className="flex items-center gap-4">
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-14 w-24 rounded-xl object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-bold text-ink-950">
                    {s.title}
                    {s.active === false && (
                      <span className="ml-2 rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-500">
                        Hidden
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink-500">{s.eyebrow}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => reorderHeroSlide(s.id, -1)}
                    disabled={i === 0}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 transition hover:bg-ink-100 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => reorderHeroSlide(s.id, 1)}
                    disabled={i === filtered.length - 1}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 transition hover:bg-ink-100 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </div>
                <Link
                  href={`/admin/hero-slides?edit=${s.id}`}
                  className="rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-bold text-ink-800 transition hover:border-ink-950"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`Delete slide "${s.title}"?`)) {
                      deleteHeroSlide(s.id);
                      toast("Slide deleted", s.title, "info");
                    }
                  }}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                  aria-label="Delete slide"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <p className="mt-4 text-xs text-ink-500">
        Slides are shown in the order above on the homepage hero carousel.
      </p>
    </div>
  );
}

export default function HeroSlidesContent() {
  return (
    <Suspense fallback={null}>
      <AdminHeroSlidesManager />
    </Suspense>
  );
}
