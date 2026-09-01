import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/features/cart/data/shipping";

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

export interface ShippingConfig {
  shippingFee: number;
  freeShippingThreshold: number;
}

export type PaymentMethodId = "cod" | "qr";

export interface PaymentMethod {
  id: PaymentMethodId;
  title: string;
  description: string;
}

export const paymentMethods: PaymentMethod[] = [
  { id: "cod", title: "Cash on Delivery", description: "Pay when you receive" },
  { id: "qr", title: "QR Payment", description: "Scan & pay with any app" },
];

export { FREE_SHIPPING_THRESHOLD };

export interface ShippingQuoteInput {
  subtotal: number;
  config?: Partial<ShippingConfig>;
}

export function quoteShipping({
  subtotal,
  config = {},
}: ShippingQuoteInput): number {
  if (subtotal === 0) return 0;
  const { shippingFee = SHIPPING_FEE, freeShippingThreshold = FREE_SHIPPING_THRESHOLD } =
    config;
  const free = shippingFee === 0 || subtotal >= freeShippingThreshold;
  return free ? 0 : shippingFee;
}