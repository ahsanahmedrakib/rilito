import { Skeleton } from "@/components/shared/components/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 lg:px-8">
      <Skeleton className="h-8 w-56" />
      <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-ink-200/60">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="mt-2 h-3 w-1/3" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-ink-100 pt-4">
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    </div>
  );
}
