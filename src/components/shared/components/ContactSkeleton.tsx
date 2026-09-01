import { Skeleton } from "@/components/shared/components/Skeleton";

export function ContactSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
      <Skeleton className="h-5 w-52" />
      <div className="mt-6 max-w-2xl">
        <Skeleton className="h-9 w-80 max-w-full md:w-96" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="mt-4 h-3 w-20" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-8">
          <Skeleton className="h-5 w-40" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="mt-2 h-24 w-full rounded-xl" />
          <Skeleton className="mt-5 h-12 w-full rounded-full" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-44 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}