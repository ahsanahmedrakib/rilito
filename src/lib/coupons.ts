import type { Coupon } from "./types";

export function discountForCoupon(
  coupons: Coupon[],
  code: string,
  subtotal: number
): number {
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
  );
  if (!coupon) return 0;
  if (coupon.type === "percent") {
    return Math.round(subtotal * (coupon.value / 100));
  }
  return Math.min(coupon.value, subtotal);
}

export function defaultCoupons(): Coupon[] {
  return [{ code: "RILITO10", type: "percent", value: 10, active: true }];
}