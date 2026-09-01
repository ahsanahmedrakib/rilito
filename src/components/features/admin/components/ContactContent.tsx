"use client";

import { useMemo, useState } from "react";
import { MailIcon, TrashIcon } from "@/components/shared/components/icons";
import { useStore } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";

const filters = ["all", "unread", "read"] as const;
type Filter = (typeof filters)[number];

const subjectColors: Record<string, string> = {
  "Order query": "bg-blue-100 text-blue-700",
  "Delivery & shipping": "bg-violet-100 text-violet-700",
  "Exchange or return": "bg-amber-100 text-amber-800",
  "Payment issue": "bg-red-100 text-red-700",
  "Product question": "bg-emerald-100 text-emerald-700",
  Other: "bg-ink-100 text-ink-600",
};

function subjectBadge(subject: string) {
  return cn(
    "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
    subjectColors[subject] ?? "bg-ink-100 text-ink-600"
  );
}

export default function ContactContent() {
  const { contactQueries, markContactQuery, deleteContactQuery, toast } = useStore();
  const [filter, setFilter] = useState<Filter>("all");

  const unreadCount = contactQueries.filter((q) => !q.read).length;

  const filtered = useMemo(() => {
    const sorted = [...contactQueries].sort(
      (a, b) => +new Date(b.date) - +new Date(a.date)
    );
    if (filter === "all") return sorted;
    return sorted.filter((q) =>
      filter === "unread" ? !q.read : q.read
    );
  }, [contactQueries, filter]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Contact Queries
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Messages submitted from the website contact page. Mark them as read once
        you have responded.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold capitalize transition",
              filter === f
                ? "bg-ink-950 text-white"
                : "border border-ink-200 bg-white text-ink-700 hover:border-ink-950"
            )}
          >
            {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-white py-16 text-center ring-1 ring-ink-200/60">
          <MailIcon className="h-10 w-10 text-ink-300" />
          <p className="text-sm text-ink-500">
            {filter === "all"
              ? "No contact queries yet."
              : `No ${filter} queries.`}
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {filtered.map((q) => (
            <li
              key={q.id}
              className={cn(
                "rounded-2xl bg-white p-5 ring-1 ring-ink-200/60 transition",
                !q.read && "ring-2 ring-brand-200"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-ink-950">{q.name}</p>
                  {!q.read && (
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                      New
                    </span>
                  )}
                  {subjectBadge(q.subject)}
                </div>
                <span className="text-xs text-ink-400">{formatDate(q.date)}</span>
              </div>

              {(q.phone || q.email) && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                  {q.email && <span>{q.email}</span>}
                  {q.phone && <span>{q.phone}</span>}
                </div>
              )}

              <p className="mt-3 text-sm leading-relaxed text-ink-600">{q.message}</p>

              <div className="mt-4 flex gap-2 border-t border-ink-100 pt-4">
                <button
                  onClick={() => {
                    markContactQuery(q.id, !q.read);
                    toast(!q.read ? "Marked as read" : "Marked as unread", q.name, "info");
                  }}
                  className="rounded-full bg-ink-950 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-brand-600"
                >
                  {q.read ? "Mark unread" : "Mark as read"}
                </button>
                <button
                  onClick={() => {
                    deleteContactQuery(q.id);
                    toast("Query deleted", q.name, "info");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
