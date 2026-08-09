import { ChevronRight } from "@/components/shared/components/icons";
import { faqs } from "@/features/content/data/faqs";

export function FaqAccordion() {
  return (
    <div className="space-y-3">
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
  );
}
