import { AuthSkeleton } from "@/components/shared/components/AuthSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <AuthSkeleton />
    </div>
  );
}