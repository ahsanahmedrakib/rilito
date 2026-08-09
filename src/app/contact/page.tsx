import { Breadcrumbs } from "@/components/shared/components/Breadcrumbs";
import {
  FacebookIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/shared/components/icons";
import { FACEBOOK_URL, HOTLINE } from "@/components/shared/data/site";
import { ContactForm } from "@/features/contact/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Rilito",
  description:
    "Get in touch with the Rilito team for orders, deliveries, exchanges and questions.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Contact Us", href: undefined },
        ]}
      />

      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink-950 md:text-5xl">
          {"We're One Message Away"}
        </h1>
        <p className="mt-3 text-sm text-ink-500 md:text-base">
          {
            "Questions about your order, a size you're deciding between, or a return — a real human replies, usually within minutes."
          }
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: <PhoneIcon className="h-6 w-6" />,
            title: "Hotline",
            value: HOTLINE,
            href: `tel:${HOTLINE.replace("-", "")}`,
          },
          {
            icon: <MailIcon className="h-6 w-6" />,
            title: "Email",
            value: "support@rilito.com",
            href: "mailto:support@rilito.com",
          },
          {
            icon: <WhatsAppIcon className="h-6 w-6" />,
            title: "WhatsApp",
            value: "Chat with support",
            href: "https://wa.me/8801979394059",
          },
          {
            icon: <FacebookIcon className="h-6 w-6" />,
            title: "Facebook",
            value: "Rilito on Facebook",
            href: FACEBOOK_URL,
          },
        ].map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noreferrer" : undefined}
            className="group rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-ink-950 text-brand-500 transition group-hover:bg-brand-600 group-hover:text-white">
              {c.icon}
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-ink-500">
              {c.title}
            </p>
            <p className="mt-1 text-sm font-bold text-ink-950 group-hover:text-brand-700">
              {c.value}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-8">
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
            Send Us A Message
          </h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl bg-ink-950 p-7 text-white">
            <h3 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-tight">
              <PinIcon className="h-5 w-5 text-brand-500" /> Visit The Store
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              Level 3, Shop 12, Bashundhara City,
              <br />
              Panthapath, Dhaka 1205, Bangladesh
            </p>
            <p className="mt-2 text-xs text-ink-400">
              Open every day · 11:00 AM – 9:30 PM (Fri from 3:00 PM)
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/60">
            <h3 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
              Order Help
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              For an existing order, please quote your order ID (from your
              confirmation SMS) so we can trace it instantly.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://wa.me/8801979394059"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-emerald-700"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
              </a>
              <a
                href={`tel:${HOTLINE.replace("-", "")}`}
                className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-5 py-3 text-xs font-bold uppercase tracking-wide text-ink-900 transition hover:border-ink-950"
              >
                <PhoneIcon className="h-4 w-4" /> Call Us
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/60">
            <h3 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
              Follow The Journey
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              New drops and behind-the-scenes on Facebook and TikTok.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full bg-ink-100 text-ink-900 transition hover:bg-brand-600 hover:text-white"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@rilito.bd"
                target="_blank"
                rel="noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full bg-ink-100 text-ink-900 transition hover:bg-brand-600 hover:text-white"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

