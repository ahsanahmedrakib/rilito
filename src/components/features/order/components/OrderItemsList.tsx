import Image from "next/image";
import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function OrderItemsList({ items }: { items: CartItem[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.key} className="flex items-center gap-3">
          <Image
            src={item.image}
            alt={item.name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-sm font-semibold text-ink-900">{item.name}</p>
            <p className="text-xs text-ink-500">
              {item.color} · {item.size} · ×{item.qty}
            </p>
          </div>
          <span className="text-sm font-bold text-ink-950">
            {formatPrice(item.price * item.qty)}
          </span>
        </li>
      ))}
    </ul>
  );
}