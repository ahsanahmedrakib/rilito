import { Skeleton } from "@/components/shared/components/Skeleton";

export function AuthSkeleton() {
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/60">
        <Skeleton className="mx-auto h-16 w-16 rounded-2xl" />
        <Skeleton className="mx-auto mt-5 h-7 w-32" />
        <Skeleton className="mx-auto mt-2 h-4 w-44" />
        <div className="mt-7 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-6 h-12 w-full rounded-xl" />
        <Skeleton className="mx-auto mt-5 h-4 w-48" />
      </div>
    </div>
  );
}