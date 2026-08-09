export const ORDER_STATUS_STEPS = [
  "Order Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

export function generateOrderId(): string {
  return `RIL-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(
    Math.random() * 90 + 10
  )}`;
}