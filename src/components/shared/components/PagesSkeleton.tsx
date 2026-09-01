import { Skeleton } from "@/components/shared/components/Skeleton";

export function PagesSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="mt-6 h-10 w-72 max-w-full" />
      <Skeleton className="mt-3 h-4 w-64 max-w-full" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/60"
          >
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-3.5 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}