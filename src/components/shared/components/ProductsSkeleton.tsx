import { ProductGridSkeleton } from "@/components/shared/components/ProductGridSkeleton";
import { Skeleton } from "@/components/shared/components/Skeleton";

export function ProductsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <Skeleton className="h-5 w-52" />
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Skeleton className="h-8 w-48 md:w-64" />
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
            <Skeleton className="h-4 w-28" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="mt-6 h-4 w-24" />
            <Skeleton className="mt-4 h-2 w-full" />
            <Skeleton className="mt-2 h-2 w-4/5" />
          </div>
        </aside>
        <ProductGridSkeleton
          count={12}
          className="gap-3 md:gap-4 xl:grid-cols-3"
        />
      </div>
    </div>
  );
}