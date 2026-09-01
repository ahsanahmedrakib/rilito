import { ProductGridSkeleton } from "@/components/shared/components/ProductGridSkeleton";
import { Skeleton } from "@/components/shared/components/Skeleton";

export function SearchSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-2 h-4 w-32" />
      <ProductGridSkeleton count={8} className="mt-6 xl:grid-cols-4" />
    </div>
  );
}