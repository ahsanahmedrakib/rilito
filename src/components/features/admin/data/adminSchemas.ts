import * as yup from "yup";
import type { ColorOption, Product } from "@/lib/types";
import { slugify } from "@/lib/utils";

export const adminLoginSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Min 6 characters"),
});

export type AdminLoginValues = yup.InferType<typeof adminLoginSchema>;

export const couponSchema = yup.object({
  code: yup
    .string()
    .required("Coupon code is required")
    .min(3, "At least 3 characters")
    .matches(/^[A-Z0-9]+$/i, "Use letters and numbers only"),
  type: yup.string().oneOf(["percent", "fixed"], "Select a type"),
  value: yup
    .number()
    .typeError("Enter a number")
    .required("Value is required")
    .positive("Value must be positive"),
  active: yup.boolean(),
});

export type CouponValues = yup.InferType<typeof couponSchema>;

const numberLine = /^[A-Za-z][A-Za-z ]*#[0-9a-fA-F]{6}$/;
const urlLine = /^https?:\/\/\S+$/;
const dataUrlLine = /^data:image\/[a-zA-Z+]+;base64,/;

export const productSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "At least 2 characters"),
  sku: yup
    .string()
    .required("SKU is required")
    .min(3, "At least 3 characters")
    .matches(/^[A-Z0-9-]+$/i, "Use letters, numbers and dashes only"),
  category: yup.string().required("Category is required"),
  price: yup
    .number()
    .typeError("Enter a valid price")
    .required("Price is required")
    .positive("Price must be positive"),
  salePrice: yup
    .number()
    .typeError("Enter a valid price")
    .positive("Sale price must be positive")
    .transform((value, original) => (original === "" ? undefined : value)),
  stock: yup
    .number()
    .typeError("Enter a number")
    .required("Stock is required")
    .integer("Whole numbers only")
    .min(0, "Can't be negative"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "At least 10 characters"),
  details: yup.string(),
  sizes: yup
    .string()
    .test("sizes", "Enter at least one size (e.g. S, M, L)", (value) =>
      splitLines(value).length > 0
    ),
  images: yup
    .string()
    .test("images", "Add at least one image (upload or URL)", (value) => {
      const lines = splitLines(value);
      return (
        lines.length > 0 &&
        lines.every((l) => urlLine.test(l) || dataUrlLine.test(l))
      );
    }),
  colors: yup
    .string()
    .test(
      "colors",
      'Format each color as "Name #hex", one per line',
      (value) => {
        const lines = splitLines(value);
        return lines.length > 0 && lines.every((l) => numberLine.test(l));
      }
    ),
  features: yup.boolean(),
  isBestSeller: yup.boolean(),
  isNew: yup.boolean(),
});

export type ProductValues = yup.InferType<typeof productSchema>;

export function splitLines(value: string | undefined): string[] {
  return (value ?? "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function colorsToText(colors: ColorOption[]): string {
  return colors.map((c) => `${c.name} #${c.hex.replace("#", "")}`).join("\n");
}

export function textToColors(value: string | undefined): ColorOption[] {
  return splitLines(value).map((line) => {
    const idx = line.lastIndexOf("#");
    return {
      name: line.slice(0, idx).trim(),
      hex: line.slice(idx).trim(),
    };
  });
}

export function nextProductId(products: Product[]): string {
  const max = products.reduce((m, p) => {
    const n = parseInt(p.id.replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return `p-${String(max + 1).padStart(3, "0")}`;
}

export function generateSku(products: Product[], date = new Date()): string {
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(date.getDate()).padStart(2, "0")}`;
  const prefix = `RIL-${ymd}`;
  let serial = 0;
  for (const p of products) {
    const match = new RegExp(`^${prefix}-(\\d+)$`).exec(
      (p.sku ?? "").trim().toUpperCase()
    );
    if (match) serial = Math.max(serial, Number(match[1]));
  }
  return `${prefix}-${String(serial + 1).padStart(3, "0")}`;
}

export function buildProduct(
  values: ProductValues,
  products: Product[],
  existing?: Product
): Product {
  const productId = existing?.id ?? nextProductId(products);
  return {
    id: productId,
    slug: slugify(values.name),
    sku: values.sku.trim().toUpperCase(),
    name: values.name.trim(),
    category: values.category,
    price: Number(values.price),
    salePrice: values.salePrice !== undefined ? Number(values.salePrice) : undefined,
    stock: Number(values.stock),
    images: splitLines(values.images),
    description: values.description.trim(),
    details: splitLines(values.details),
    sizes: splitLines(values.sizes),
    colors: textToColors(values.colors),
    tags: [values.category, ...values.name.toLowerCase().split(/\s+/)],
    rating: existing?.rating ?? 0,
    reviewCount: existing?.reviewCount ?? 0,
    isBestSeller: values.isBestSeller,
    isNew: values.isNew,
    featured: values.features,
    reviews: existing?.reviews ?? [],
  };
}