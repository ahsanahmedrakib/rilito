import { TrackSkeleton } from "@/components/shared/components/TrackSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <TrackSkeleton />
    </div>
  );
}