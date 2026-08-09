import {
  CashIcon,
  RefreshIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/shared/components/icons";
import { values, type ValueIconKey } from "@/features/home/data/home";

const iconMap: Record<
  ValueIconKey,
  (props: { className?: string }) => React.ReactNode
> = {
  truck: TruckIcon,
  cash: CashIcon,
  refresh: RefreshIcon,
  shield: ShieldIcon,
};

export function HomeValues() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v) => {
          const Icon = iconMap[v.icon];
          return (
            <div
              key={v.title}
              className="group flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200/60"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink-950 text-brand-500 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink-950">{v.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  {v.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
