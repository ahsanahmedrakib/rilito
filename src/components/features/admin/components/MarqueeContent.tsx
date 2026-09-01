"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { CloseIcon, PlusIcon } from "@/components/shared/components/icons";

export default function MarqueeContent() {
  const { settings, saveSettings, toast } = useStore();
  const texts = settings.marqueeTexts ?? [];
  const [draft, setDraft] = useState("");
  const [items, setItems] = useState<string[]>(texts);

  const addItem = () => {
    const t = draft.trim();
    if (!t) return;
    setItems((prev) => [...prev, t]);
    setDraft("");
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const move = (idx: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const save = () => {
    saveSettings({ marqueeTexts: items.filter((t) => t.trim()) });
    toast("Marquee updated", "The announcement bar has been saved", "success");
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Marquee Text
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Manage the scrolling announcement messages shown above the navbar on the
        storefront. Save to make them live.
      </p>

      <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-ink-200/60">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
            placeholder="Add a new announcement message..."
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950"
          />
          <button
            onClick={addItem}
            className="grid w-12 shrink-0 place-items-center rounded-xl bg-ink-950 text-white transition hover:bg-brand-600"
            aria-label="Add message"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="mt-6 rounded-xl bg-ink-50 py-8 text-center text-sm text-ink-500">
            No messages yet — add one above.
          </p>
        ) : (
          <ul className="mt-5 space-y-2">
            {items.map((t, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-3"
              >
                <span className="flex-1 text-sm font-semibold text-ink-900">{t}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 transition hover:bg-ink-100 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 transition hover:bg-ink-100 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeItem(i)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-red-600 transition hover:bg-red-50"
                    aria-label="Remove message"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={save}
          disabled={items.length === 0}
          className="mt-6 w-full rounded-xl bg-ink-950 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          Save Marquee
        </button>
      </div>
    </div>
  );
}
