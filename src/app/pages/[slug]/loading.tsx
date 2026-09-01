import { PagesSkeleton } from "@/components/shared/components/PagesSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <PagesSkeleton />
    </div>
  );
}