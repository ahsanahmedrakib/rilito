import { Skeleton } from "@/components/shared/components/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-4 h-8 w-32" />
          <div className="grid grid-cols-3 gap-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/60">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="mt-3 h-3.5 w-3/4" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </div>
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
      <div className="mt-12">
        <Skeleton className="h-6 w-40" />
        <div className="mt-6 flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-40 shrink-0">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
