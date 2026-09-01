import { Skeleton } from "@/components/shared/components/Skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <Skeleton className="h-8 w-44" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
            <Skeleton className="h-5 w-36" />
            <div className="mt-5 grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
            <Skeleton className="h-5 w-44" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-full max-w-56" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
          <Skeleton className="h-5 w-32" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="mt-6 h-11 w-full rounded-xl" />
          <div className="mt-5 space-y-3 border-t border-ink-100 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="mt-8 h-12 w-full rounded-xl" />
        </aside>
      </div>
    </div>
  );
}