import { Skeleton } from "@/components/shared/components/Skeleton";

export function TrackSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
      <div className="text-center">
        <Skeleton className="mx-auto h-16 w-16 rounded-2xl" />
        <Skeleton className="mx-auto mt-5 h-8 w-64 md:w-72" />
        <Skeleton className="mx-auto mt-2 h-4 w-80 max-w-full" />
      </div>
      <div className="mx-auto mt-8 flex max-w-md gap-2">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 w-14 rounded-xl" />
      </div>
    </div>
  );
}