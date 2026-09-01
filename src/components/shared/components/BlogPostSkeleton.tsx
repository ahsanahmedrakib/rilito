import { Skeleton } from "@/components/shared/components/Skeleton";

export function BlogPostSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="mt-6 h-9 w-4/5" />
      <Skeleton className="mt-3 h-9 w-2/3" />
      <div className="mt-5 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
      </div>
      <Skeleton className="mt-8 aspect-16/10 w-full rounded-3xl" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}