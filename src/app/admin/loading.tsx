import { AdminSkeleton } from "@/components/shared/components/AdminSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in">
      <AdminSkeleton />
    </div>
  );
}
