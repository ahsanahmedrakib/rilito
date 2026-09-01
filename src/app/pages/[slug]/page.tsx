import { Breadcrumbs } from "@/components/shared/components/Breadcrumbs";
import { ChevronRight } from "@/components/shared/components/icons";
import { readSettingsSafely } from "@/lib/db/seed";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "faq")
    return {
      title: "FAQ — Rilito",
      description: "Answers to common questions about Rilito orders, sizing, delivery and returns.",
      alternates: { canonical: `/pages/faq` },
    };
  const settings = await readSettingsSafely();
  const page = settings.pageContents?.[slug];
  if (!page) return { title: "Page not found — Rilito" };
  return {
    title: page.title,
    description:
      page.sections[0]?.body[0] ?? "Learn more about Rilito — modern menswear for Bangladesh.",
    alternates: { canonical: `/pages/${slug}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await readSettingsSafely();
  const { faqs, pageContents } = settings;

  if (slug === "faq") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "FAQ", href: undefined },
          ]}
        />
        <h1 className="mt-6 text-3xl font-extrabold uppercase tracking-tight text-ink-950 md:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-sm text-ink-500 md:text-base">
          Everything about delivery, payment, exchanges and more.
        </p>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.question}
              className="group rounded-2xl bg-white p-5 ring-1 ring-ink-200/60"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-ink-950 md:text-base">
                {f.question}
                <ChevronRight className="h-5 w-5 shrink-0 text-brand-600 transition group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    );
  }

  const page = pageContents?.[slug];
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: page.title, href: undefined },
        ]}
      />
      <h1 className="mt-6 text-3xl font-extrabold uppercase tracking-tight text-ink-950 md:text-5xl">
        {page.title}
      </h1>
      <div className="mt-8 space-y-10">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950 md:text-xl">
              {section.heading}
            </h2>
            {section.body.map((para, i) => (
              <p
                key={i}
                className="mt-3 text-sm leading-relaxed text-ink-600 md:text-base"
              >
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
