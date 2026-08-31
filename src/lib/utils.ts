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

/**
 * Returns the stock available for each size. For legacy products without
 * per-size stock records, the total `stock` is assigned to the first size so
 * availability still works.
 */
export function sizeStockMap(product: Product): Record<string, number> {
  if (product.sizeStock && Object.keys(product.sizeStock).length > 0) {
    return product.sizeStock;
  }
  const map: Record<string, number> = {};
  if (product.sizes.length > 0) {
    map[product.sizes[0]] = product.stock;
  }
  return map;
}