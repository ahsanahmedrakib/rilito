import { Skeleton } from "@/components/shared/components/Skeleton";

export function AdminSkeleton() {
  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-ink-200/60 bg-white p-4 md:flex">
        <Skeleton className="h-8 w-32" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-3 h-8 w-16" />
              <Skeleton className="mt-4 h-2.5 w-3/4" />
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-ink-100 py-4 last:border-0">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
