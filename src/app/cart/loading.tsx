import { CartSkeleton } from "@/components/shared/components/CartSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <CartSkeleton />
    </div>
  );
}