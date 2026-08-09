import { ORDER_STATUS_STEPS } from "@/features/order/data/status";
import { cn } from "@/lib/utils";

export function OrderStatusTimeline({ status }: { status: string }) {
  const activeStep = ORDER_STATUS_STEPS.indexOf(status as (typeof ORDER_STATUS_STEPS)[number]);

  return (
    <div className="flex items-center">
      {ORDER_STATUS_STEPS.map((step, i) => {
        const reached = i <= activeStep;
        const last = i === ORDER_STATUS_STEPS.length - 1;
        return (
          <div key={step} className={cn("flex items-center", !last && "flex-1")}>
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold",
                  reached ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-400"
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "hidden whitespace-nowrap text-[10px] font-semibold sm:block",
                  reached ? "text-ink-950" : "text-ink-400"
                )}
              >
                {step}
              </span>
            </div>
            {!last && (
              <div
                className={cn(
                  "h-0.5 flex-1 sm:-mt-6",
                  i < activeStep ? "bg-brand-600" : "bg-ink-100"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}