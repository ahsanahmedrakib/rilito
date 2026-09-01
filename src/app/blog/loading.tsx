import { BlogSkeleton } from "@/components/shared/components/BlogSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <BlogSkeleton />
    </div>
  );
}