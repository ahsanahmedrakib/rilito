import { ProductGridSkeleton } from "@/components/shared/components/ProductGridSkeleton";
import { Skeleton } from "@/components/shared/components/Skeleton";

export function WishlistSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-28" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <ProductGridSkeleton
        count={8}
        className="mt-6 xl:grid-cols-4"
      />
    </div>
  );
}