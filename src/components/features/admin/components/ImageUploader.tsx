"use client";

import { useRef, useState } from "react";
import { CloseIcon, UploadIcon } from "@/components/shared/components/icons";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

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

async function compressImage(
  src: string,
  maxDim = 900,
  quality = 0.82
): Promise<string> {
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

export function ImageUploader({
  value,
  onChange,
  label,
  hint,
  aspect = "video",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  aspect?: "square" | "video";
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setError(null);
    setWorking(true);
    try {
      const raw = await readFileAsDataUrl(file);
      const compressed = await compressImage(raw);
      onChange(compressed);
    } catch {
      setError("Could not read that image. Try a different file.");
    } finally {
      setWorking(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const applyUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setUrl("");
    setError(null);
  };

  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">{label}</label>}

      {value ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
          <img
            src={value}
            alt={label ?? "Uploaded image"}
            className={cn(
              "w-full object-cover",
              aspect === "square" ? "aspect-square" : "aspect-video"
            )}
          />
          <button
            type="button"
            onClick={() => {
              onChange("");
              setError(null);
            }}
            aria-label="Remove image"
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink-900 shadow transition hover:bg-red-600 hover:text-white"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={working}
          className={cn(
            "grid w-full max-w-xs place-items-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 text-ink-500 transition hover:border-brand-600 hover:text-brand-600 disabled:opacity-60",
            aspect === "square" ? "aspect-square" : "aspect-video"
          )}
        >
          <span className="flex flex-col items-center gap-1.5 text-xs font-semibold">
            <UploadIcon className="h-5 w-5" />
            {working ? "Processing..." : "Upload image"}
          </span>
        </button>
      )}

      {hint && value === "" && (
        <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyUrl())}
          placeholder="…or paste an image URL"
          className={inputCls}
        />
        <button
          type="button"
          onClick={applyUrl}
          className="shrink-0 rounded-xl border border-ink-200 px-4 py-2 text-sm font-bold text-ink-800 transition hover:border-ink-950"
        >
          Use URL
        </button>
      </div>

      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
