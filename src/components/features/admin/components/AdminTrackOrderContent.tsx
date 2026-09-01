"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ORDER_STATUS_STEPS } from "@/features/order/data/status";
import { formatDate } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600";

function OrderTrackerCard({
  orderId,
  defaultStatus,
  defaultTracking,
  onSave,
}: {
  orderId: string;
  defaultStatus: string;
  defaultTracking?: { courier: string; trackingId: string; note: string };
  onSave: (status: string, tracking: { courier: string; trackingId: string; note: string }) => void;
}) {
  const [status, setStatus] = useState(defaultStatus);
  const [courier, setCourier] = useState(defaultTracking?.courier ?? "");
  const [trackingId, setTrackingId] = useState(defaultTracking?.trackingId ?? "");
  const [note, setNote] = useState(defaultTracking?.note ?? "");

  const save = () => {
    onSave(status, { courier, trackingId, note });
  };

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
      <p className="font-mono text-sm font-black text-ink-950">{orderId}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputCls}
          >
            {ORDER_STATUS_STEPS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Courier</label>
          <input
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            className={inputCls}
            placeholder="e.g. Pathao / Sundarban"
          />
        </div>
        <div>
          <label className={labelCls}>Tracking ID</label>
          <input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className={inputCls}
            placeholder="Courier tracking number"
          />
        </div>
        <div>
          <label className={labelCls}>Note</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputCls}
            placeholder="Optional tracking note"
          />
        </div>
      </div>
      <button
        onClick={save}
        className="mt-4 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
      >
        Save Tracking
      </button>
    </div>
  );
}

export default function AdminTrackOrderContent() {
  const { orders, updateOrderStatus, updateOrderTracking, toast } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(
    () =>
      [...orders]
        .sort((a, b) => +new Date(b.date) - +new Date(a.date))
        .filter((o) => filter === "All" || o.status === filter)
        .filter(
          (o) =>
            !query.trim() ||
            o.id.toLowerCase().includes(query.trim().toLowerCase()) ||
            o.name.toLowerCase().includes(query.trim().toLowerCase())
        ),
    [orders, filter, query]
  );

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Track Order
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Update order status and courier tracking details. Customers see this when
        they track their order.
      </p>

      <div className="mt-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order ID or customer name..."
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink-950"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {["All", ...ORDER_STATUS_STEPS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                filter === s
                  ? "bg-ink-950 text-white"
                  : "border border-ink-200 bg-white text-ink-700 hover:border-ink-950"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white py-16 text-center text-sm text-ink-500 ring-1 ring-ink-200/60">
          No orders match.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((o) => (
            <OrderTrackerCard
              key={o.id}
              orderId={o.id}
              defaultStatus={o.status}
              defaultTracking={o.tracking}
              onSave={(status, tracking) => {
                updateOrderStatus(o.id, status);
                updateOrderTracking(o.id, tracking);
                toast("Tracking updated", `${o.id} · ${status}`);
              }}
            />
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-ink-400">
        Total orders: {orders.length} · placed {orders.length ? formatDate(orders[orders.length - 1]?.date) : "—"}
      </p>
    </div>
  );
}
