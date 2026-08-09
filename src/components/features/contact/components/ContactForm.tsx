"use client";

import { MailIcon, PhoneIcon } from "@/components/shared/components/icons";
import { contactSubjects } from "@/features/contact/data/contact";
import { useStore } from "@/lib/store";
import { useState } from "react";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";

export function ContactForm() {
  const { toast } = useStore();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Order query",
    message: "",
  });

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast("Missing details", "Please add your name and message", "info");
      return;
    }
    toast("Message sent!", "Our team will get back to you within a few hours");
    setForm({
      name: "",
      phone: "",
      email: "",
      subject: "Order query",
      message: "",
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Name *
          </label>
          <input
            className={inputCls}
            value={form.name}
            onChange={set("name")}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Phone
          </label>
          <div className="relative">
            <PhoneIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              className={`${inputCls} pl-11`}
              value={form.phone}
              onChange={set("phone")}
              placeholder="01XXXXXXXXX"
              inputMode="tel"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Email
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="email"
              className={`${inputCls} pl-11`}
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Subject
          </label>
          <select
            className={inputCls}
            value={form.subject}
            onChange={set("subject")}
          >
            {contactSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
            Message *
          </label>
          <textarea
            rows={5}
            className={`${inputCls} resize-none`}
            value={form.message}
            onChange={set("message")}
            placeholder="How can we help?"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
      >
        Send Message
      </button>
    </form>
  );
}
