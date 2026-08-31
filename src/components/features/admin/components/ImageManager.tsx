"use client";

import { useRef, useState } from "react";
import { PlusIcon, UploadIcon } from "@/components/shared/components/icons";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export const MAX_PRODUCT_IMAGES = 10;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function compressImage(src: string, maxDim = 900, quality = 0.82) {
  const img = await loadImage(src);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return src;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

function Thumb({
  src,
  alt,
  active,
  onReplace,
}: {
  src: string;
  alt: string;
  active?: boolean;
  onReplace: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className={cn(
        "group relative h-16 w-16 overflow-hidden rounded-lg border-2 bg-ink-50 md:h-20 md:w-20",
        active ? "border-brand-600" : "border-ink-200"
      )}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="absolute inset-0 grid place-items-center bg-ink-950/0 opacity-0 transition group-hover:bg-ink-950/40 group-hover:opacity-100"
      >
        <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-ink-900">
          <UploadIcon className="h-3 w-3" /> Replace
        </span>
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onReplace(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function ImageManager({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  const setAt = (index: number, value: string) => {
    const next = [...images];
    next[index] = value;
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const addFile = async (file: File) => {
    setError(null);
    setWorking(true);
    try {
      const raw = await readFileAsDataUrl(file);
      const compressed = await compressImage(raw);
      onChange([...images, compressed]);
    } catch {
      setError("Could not read that image. Try a different file.");
    } finally {
      setWorking(false);
    }
  };

  const addUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-600">
          Product images ({images.length}/{MAX_PRODUCT_IMAGES})
        </p>
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => removeAt(0)}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Replace card image…
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2.5">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <Thumb
              src={img}
              alt={`Image ${i + 1}`}
              active={i === 0}
              onReplace={async (f) => {
                try {
                  const compressed = await compressImage(await readFileAsDataUrl(f));
                  setAt(i, compressed);
                } catch {
                  setError("Could not read that image.");
                }
              }}
            />
            {i === 0 ? (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-950/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                Card · Main
              </span>
            ) : (
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`Remove image ${i + 1}`}
                className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-white/90 text-red-600 shadow transition hover:bg-red-600 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-2.5 w-2.5">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        ))}

        {images.length < MAX_PRODUCT_IMAGES && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={working}
            className="grid h-16 w-16 place-items-center rounded-lg border-2 border-dashed border-ink-200 bg-ink-50 text-ink-400 transition hover:border-brand-600 hover:text-brand-600 disabled:opacity-60 md:h-20 md:w-20"
          >
            <span className="flex flex-col items-center gap-0.5 text-[10px] font-semibold">
              <PlusIcon className="h-4 w-4" />
              {working ? "Adding…" : "Add"}
            </span>
          </button>
        )}
      </div>

      <div className="mt-3 flex max-w-xs gap-2">
        <input
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          placeholder="Or paste a URL…"
          className={inputCls}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl(urlDraft);
              setUrlDraft("");
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            addUrl(urlDraft);
            setUrlDraft("");
          }}
          className="shrink-0 rounded-xl border border-ink-200 px-3 py-2 text-xs font-bold text-ink-800 transition hover:border-ink-950"
        >
          Use URL
        </button>
      </div>

      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) addFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
