import { ContactSkeleton } from "@/components/shared/components/ContactSkeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in bg-cream py-6">
      <ContactSkeleton />
    </div>
  );
}