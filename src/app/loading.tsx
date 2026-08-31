import { SiteSkeleton } from "@/components/shared/components/SiteSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <SiteSkeleton />
    </div>
  );
}
