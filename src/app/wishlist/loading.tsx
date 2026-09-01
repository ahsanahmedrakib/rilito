import { WishlistSkeleton } from "@/components/shared/components/WishlistSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <WishlistSkeleton />
    </div>
  );
}