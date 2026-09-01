import { LogoMark } from "@/components/shared/components/icons";
import { cn } from "@/lib/utils";

export function LoadingLogo({
  label = "Rilito",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative grid place-items-center">
        <span className="absolute h-20 w-20 border-2 border-transparent border-t-brand-600 animate-logo-spin" />
        <span className="absolute inset-0 -m-1 bg-brand-600/10 animate-logo-breathe" />
        <LogoMark className="relative h-16 w-16 animate-logo-pulse" />
      </div>
      {label && (
        <span className="mt-5 text-sm font-black uppercase tracking-[0.3em] text-ink-500">
          {label}
        </span>
      )}
    </div>
  );
}

