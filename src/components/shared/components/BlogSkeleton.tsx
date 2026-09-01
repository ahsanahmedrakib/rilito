import { Skeleton } from "@/components/shared/components/Skeleton";

export function BlogSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <div className="max-w-2xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-10 w-80 max-w-full md:w-96" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      </div>
      <div className="mt-10 grid overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/60 md:grid-cols-2">
        <Skeleton className="aspect-16/10 w-full rounded-none md:aspect-auto md:h-full" />
        <div className="flex flex-col justify-center p-7 md:p-10">
          <Skeleton className="h-3.5 w-44" />
          <Skeleton className="mt-4 h-7 w-4/5" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-6 h-10 w-32 rounded-full" />
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/60"
          >
            <Skeleton className="aspect-16/10 w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}