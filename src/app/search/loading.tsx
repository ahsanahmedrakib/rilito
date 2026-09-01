import { SearchSkeleton } from "@/components/shared/components/SearchSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <SearchSkeleton />
    </div>
  );
}