import Link from "next/link";
import { ChevronRight } from "./icons";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="transition hover:text-brand-600">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-ink-900">{item.label}</span>
            )}
            {i < items.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-ink-300" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}