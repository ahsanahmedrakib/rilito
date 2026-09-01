import { Skeleton } from "@/components/shared/components/Skeleton";

export function AccountSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-44" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
          <Skeleton className="h-5 w-36" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-12 rounded-xl" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-6 h-12 w-full rounded-xl" />
        </div>
        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
          <Skeleton className="h-5 w-40" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}