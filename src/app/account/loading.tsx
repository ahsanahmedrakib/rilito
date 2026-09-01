import { AccountSkeleton } from "@/components/shared/components/AccountSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <AccountSkeleton />
    </div>
  );
}