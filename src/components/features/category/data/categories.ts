import { img } from "@/components/shared/data/site";
import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "t-shirts",
    name: "T-Shirt",
    tagline: "Daily essentials with a bold print",
    image: img("1523381210434-271e8be1f52b"),
    accent: "#18181b",
  },
  {
    slug: "panjabi",
    name: "Panjabi",
    tagline: "Elegant wear for every occasion",
    image: img("1506629082955-511b1aa562c8"),
    accent: "#0f766e",
  },
  {
    slug: "shirts",
    name: "Shirt",
    tagline: "Crisp fits from desk to dinner",
    image: img("1591047139829-d91aecb6caea"),
    accent: "#0369a1",
  },
  {
    slug: "pants",
    name: "Pants",
    tagline: "Everyday bottoms that hold their shape",
    image: img("1542272604-787c3835535d"),
    accent: "#b45309",
  },
  {
    slug: "winter",
    name: "Winter Fashion",
    tagline: "Stay warm without losing the style",
    image: img("1434389677669-e08b4cac3105"),
    accent: "#334155",
  },
  {
    slug: "footwear",
    name: "Footwear",
    tagline: "Step out in comfort and confidence",
    image: img("1523275335684-37898b6baf30"),
    accent: "#44403c",
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "The finishing touches that complete you",
    image: img("1495385794356-15371f348c31"),
    accent: "#3f3f46",
  },
  {
    slug: "active",
    name: "Active Wear",
    tagline: "Train hard, look sharp",
    image: img("1556905055-8f358a7a47b2"),
    accent: "#047857",
  },
  {
    slug: "combo",
    name: "Combo Pack",
    tagline: "Curated sets, smarter prices",
    image: img("1490481651871-ab68de25d43d"),
    accent: "#a21caf",
  },
  {
    slug: "blazer",
    name: "Blazer",
    tagline: "Sharp shoulder lines for big moments",
    image: img("1552374196-c4e7ffc6e126"),
    accent: "#3730a3",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const spotlightCategories = ["pants", "t-shirts", "shirts"] as const;
