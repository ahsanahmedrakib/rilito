import { Skeleton } from "@/components/shared/components/Skeleton";

export function CartSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <Skeleton className="h-8 w-52" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-200/60"
            >
              <Skeleton className="h-28 w-28 rounded-xl" />
              <div className="flex flex-1 flex-col gap-3 py-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-5 h-11 w-full rounded-xl" />
          <div className="mt-6 space-y-3 border-t border-ink-100 pt-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="mt-8 h-12 w-full rounded-xl" />
          <Skeleton className="mt-3 h-11 w-full rounded-xl" />
        </aside>
      </div>
    </div>
  );
}