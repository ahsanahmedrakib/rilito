import { SHIPPING_FEE, EXPRESS_FEE, FREE_SHIPPING_THRESHOLD } from "@/features/cart/data/shipping";

export const deliveryCities = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

export type DeliveryMethodId = "standard" | "express";

export interface DeliveryMethod {
  id: DeliveryMethodId;
  title: string;
  description: (freeDelivery: boolean) => string;
}

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: "standard",
    title: "Standard Delivery",
    description: (freeDelivery) =>
      freeDelivery ? "FREE today" : `৳${SHIPPING_FEE} · 1–3 days in Dhaka`,
  },
  {
    id: "express",
    title: "Express (Next Day)",
    description: () => `Same-day in Dhaka · +৳${EXPRESS_FEE}`,
  },
];

export type PaymentMethodId = "cod" | "bkash" | "nagad";

export interface PaymentMethod {
  id: PaymentMethodId;
  title: string;
  description: string;
}

export const paymentMethods: PaymentMethod[] = [
  { id: "cod", title: "Cash on Delivery", description: "Pay when you receive" },
  { id: "bkash", title: "bKash", description: "Send to 01979-394059" },
  { id: "nagad", title: "Nagad", description: "Send to 01979-394059" },
];

export { FREE_SHIPPING_THRESHOLD };

export interface ShippingQuoteInput {
  subtotal: number;
  delivery: DeliveryMethodId;
}

export function quoteShipping({ subtotal, delivery }: ShippingQuoteInput): number {
  if (subtotal === 0) return 0;
  const free = subtotal >= FREE_SHIPPING_THRESHOLD;
  if (delivery === "express") return free ? EXPRESS_FEE : SHIPPING_FEE + EXPRESS_FEE;
  return free ? 0 : SHIPPING_FEE;
}