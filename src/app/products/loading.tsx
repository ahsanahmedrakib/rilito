import { ProductsSkeleton } from "@/components/shared/components/ProductsSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <ProductsSkeleton />
    </div>
  );
}