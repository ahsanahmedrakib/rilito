"use client";

import { CloseIcon } from "@/components/shared/components/icons";
import type { Product } from "@/lib/types";
import { useState } from "react";

export function SizeGuideLink({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 text-xs font-semibold text-brand-700 underline-offset-2 hover:underline"
      >
        View size guide
      </button>
      {open && <SizeGuideModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}

function SizeGuideModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-96 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-scale-in relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
            Size guide
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-500 hover:bg-ink-100"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {product.sizeGuideImage ? (
          <div className="mt-4 overflow-hidden rounded-2xl bg-ink-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.sizeGuideImage}
              alt={`${product.name} size guide`}
              className="h-auto w-full object-contain"
            />
          </div>
        ) : (
          <div className="mt-4 rounded-2xl bg-ink-50 p-8 text-center text-sm text-ink-500">
            <p className="font-semibold text-ink-800">Available sizes</p>
            <p className="mt-2 font-bold text-ink-950">
              {product.sizes.join(" · ") || "—"}
            </p>
            <p className="mt-3 text-xs text-ink-400">
              Our sizes follow standard Bangladeshi fitting. Contact our team
              via hotline or WhatsApp if you need help choosing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
