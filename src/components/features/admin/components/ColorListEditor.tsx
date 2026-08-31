"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/shared/components/icons";
import type { ColorOption } from "@/lib/types";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

function normalizeHex(hex: string): string {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex.trim());
  return m ? `#${m[1].toLowerCase()}` : "#cccccc";
}

export function ColorListEditor({
  colors,
  onChange,
  label,
  error,
}: {
  colors: ColorOption[];
  onChange: (colors: ColorOption[]) => void;
  label?: string;
  error?: string;
}) {
  const [name, setName] = useState("");

  const setHex = (index: number, hex: string) =>
    onChange(colors.map((c, i) => (i === index ? { ...c, hex } : c)));
  const setNameAt = (index: number, value: string) =>
    onChange(colors.map((c, i) => (i === index ? { ...c, name: value } : c)));
  const remove = (index: number) =>
    onChange(colors.filter((_, i) => i !== index));
  const add = () => {
    onChange([...colors, { name: name.trim(), hex: "#cccccc" }]);
    setName("");
  };

  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-600">
          <span>{label} *</span>
          {error && (
            <span className="font-semibold normal-case text-red-600">{error}</span>
          )}
        </div>
      )}

      {colors.length > 0 && (
        <ul className="space-y-2">
          {colors.map((c, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                type="color"
                value={normalizeHex(c.hex)}
                onChange={(e) => setHex(i, e.target.value)}
                aria-label={`Color ${i + 1} picker`}
                className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-ink-200 bg-white p-1"
              />
              <input
                value={c.name}
                onChange={(e) => setNameAt(i, e.target.value)}
                placeholder="Color name"
                className={inputCls}
              />
              <span className="shrink-0 font-mono text-xs text-ink-400">
                {normalizeHex(c.hex)}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove color ${i + 1}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink-200 text-ink-500 transition hover:border-red-600 hover:bg-red-50 hover:text-red-600"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {colors.length === 0 && (
        <p className="rounded-xl bg-ink-50 py-4 text-center text-xs text-ink-500">
          No colors yet — add the first one below.
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="New color name"
          className={inputCls}
        />
        <button
          type="button"
          onClick={add}
          className="flex shrink-0 items-center gap-1 rounded-xl border border-ink-200 px-4 py-2 text-sm font-bold text-ink-800 transition hover:border-ink-950"
        >
          <PlusIcon className="h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
}
