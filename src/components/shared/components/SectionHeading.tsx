import Link from "next/link";
import { ArrowRight } from "./icons";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  link,
  linkLabel = "See All",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  link?: string;
  linkLabel?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10",
        align === "center" && "flex-col items-center text-center"
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p
            className={cn(
              "mb-2 text-xs font-bold uppercase tracking-[0.2em]",
              dark ? "text-brand-400" : "text-brand-600"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "text-2xl font-extrabold uppercase tracking-tight md:text-4xl",
            dark ? "text-white" : "text-ink-950"
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-3 text-sm leading-relaxed md:text-base", dark ? "text-ink-300" : "text-ink-500")}>
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link}
          className={cn(
            "group inline-flex items-center gap-2 text-sm font-semibold transition",
            dark ? "text-white hover:text-brand-400" : "text-ink-950 hover:text-brand-600"
          )}
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}