"use client";

import { useStore } from "@/lib/store";
import { CheckCircleIcon, CloseIcon, InfoIcon } from "./icons";

export function Toaster() {
  const { toasts } = useStore();

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-scale-in pointer-events-auto flex items-start gap-3 rounded-xl bg-ink-950 px-4 py-3 text-white shadow-2xl"
        >
          {t.variant === "success" && <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />}
          {t.variant === "error" && <CloseIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />}
          {t.variant === "info" && <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />}
          <div className="min-w-0">
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description && <p className="text-xs text-ink-300">{t.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}