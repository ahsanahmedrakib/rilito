import { SectionHeading } from "@/components/shared/components/SectionHeading";
import { StarFilledIcon } from "@/components/shared/components/icons";
import { testimonials } from "@/features/home/data/home";

export function HomeTestimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Wall of Love"
        title="What Customers Say"
        description="Real reviews from real deliveries — no ghosts, no filters."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200/60"
          >
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarFilledIcon key={i} className="h-4 w-4" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-xs font-extrabold text-brand-700">
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-ink-950">{t.name}</p>
                <p className="text-xs text-ink-500">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
