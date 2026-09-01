import { CheckoutSkeleton } from "@/components/shared/components/CheckoutSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <CheckoutSkeleton />
    </div>
  );
}