import { Skeleton } from "@/components/shared/components/Skeleton";

export function SiteSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
      {/* Hero */}
      <Skeleton className="mt-4 h-[46vh] min-h-[300px] w-full rounded-3xl md:h-[60vh]" />

      {/* Value props */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="mt-4 h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-1.5 h-3 w-5/6" />
          </div>
        ))}
      </div>

      {/* Category tiles */}
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className={[
              i < 2 ? "col-span-2 aspect-[16/10] md:col-span-2" : "",
              i === 2 ? "aspect-[16/10] md:col-span-1" : "",
              i > 2 ? "aspect-square" : "",
            ]
              .join(" ")
              .trim()}
          />
        ))}
      </div>

      {/* Product scroller */}
      <div className="pt-14">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-7 w-64" />
      </div>
      <div className="mt-6 flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-40 shrink-0 md:w-48">
            <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
            <Skeleton className="mt-3 h-3.5 w-4/5" />
            <Skeleton className="mt-2 h-3.5 w-2/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
