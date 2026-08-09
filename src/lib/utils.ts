import type { Product } from "@/lib/types";

export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString("en-IN")}`;
}

export function discountPercent(price: number, sale?: number): number {
  if (!sale) return 0;
  return Math.round(((price - sale) / price) * 100);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function currentPrice(product: Product): number {
  return product.salePrice ?? product.price;
}