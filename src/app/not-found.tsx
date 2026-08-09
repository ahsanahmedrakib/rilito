import { ArrowRight, SearchIcon } from "@/components/shared/components/icons";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-7xl font-black leading-none tracking-tight text-brand-600">
        404
      </p>
      <h1 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-ink-950">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        {
          "The page you're looking for moved, or never existed. The good stuff is still one click away."
        }
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          Back Home <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide text-ink-900 transition hover:border-ink-950"
        >
          <SearchIcon className="h-4 w-4" /> Shop All
        </Link>
      </div>
    </div>
  );
}

