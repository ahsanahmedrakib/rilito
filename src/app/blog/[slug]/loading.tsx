import { BlogPostSkeleton } from "@/components/shared/components/BlogPostSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <BlogPostSkeleton />
    </div>
  );
}