"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ImageUploader } from "@/features/admin/components/ImageUploader";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600";

export default function PaymentContent() {
  const { settings, saveSettings, toast } = useStore();
  const [qrImage, setQrImage] = useState(settings.qrImage);
  const [paymentNumber, setPaymentNumber] = useState(settings.paymentNumber);
  const [paymentNote, setPaymentNote] = useState(settings.paymentNote);

  const save = () => {
    saveSettings({ qrImage, paymentNumber, paymentNote });
    toast("Payment settings saved", "Used across checkout");
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Payment
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Manage QR payment details shown to customers at checkout.
      </p>

      <section className="mt-6 max-w-2xl rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
        <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
          QR Payment Settings
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          These are shown to customers who choose QR payment at checkout.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <ImageUploader
              value={qrImage}
              onChange={setQrImage}
              label="QR code image"
              aspect="square"
              hint="Customers see this when paying by QR"
            />
          </div>
          <div>
            <label className={labelCls}>Payment number</label>
            <input
              value={paymentNumber}
              onChange={(e) => setPaymentNumber(e.target.value)}
              className={inputCls}
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div>
            <label className={labelCls}>Payment note</label>
            <textarea
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              rows={2}
              className={cn(inputCls, "resize-none")}
            />
          </div>
          <button
            onClick={save}
            className="rounded-xl bg-ink-950 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600"
          >
            Save Settings
          </button>
        </div>
      </section>
    </div>
  );
}
