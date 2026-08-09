import { img } from "@/components/shared/data/site";
import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "t-shirts",
    name: "T-Shirt",
    tagline: "Daily essentials with a bold print",
    image: img("1523381210434-271e8be1f52b"),
    accent: "from-ink-900 to-ink-700",
  },
  {
    slug: "panjabi",
    name: "Panjabi",
    tagline: "Elegant wear for every occasion",
    image: img("1506629082955-511b1aa562c8"),
    accent: "from-brand-800 to-brand-600",
  },
  {
    slug: "shirts",
    name: "Shirt",
    tagline: "Crisp fits from desk to dinner",
    image: img("1591047139829-d91aecb6caea"),
    accent: "from-sky-800 to-sky-600",
  },
  {
    slug: "pants",
    name: "Pants",
    tagline: "Everyday bottoms that hold their shape",
    image: img("1542272604-787c3835535d"),
    accent: "from-amber-800 to-amber-600",
  },
  {
    slug: "winter",
    name: "Winter Fashion",
    tagline: "Stay warm without losing the style",
    image: img("1434389677669-e08b4cac3105"),
    accent: "from-slate-800 to-slate-600",
  },
  {
    slug: "footwear",
    name: "Footwear",
    tagline: "Step out in comfort and confidence",
    image: img("1523275335684-37898b6baf30"),
    accent: "from-stone-800 to-stone-600",
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "The finishing touches that complete you",
    image: img("1495385794356-15371f348c31"),
    accent: "from-zinc-800 to-zinc-600",
  },
  {
    slug: "active",
    name: "Active Wear",
    tagline: "Train hard, look sharp",
    image: img("1556905055-8f358a7a47b2"),
    accent: "from-emerald-800 to-emerald-600",
  },
  {
    slug: "combo",
    name: "Combo Pack",
    tagline: "Curated sets, smarter prices",
    image: img("1490481651871-ab68de25d43d"),
    accent: "from-fuchsia-800 to-fuchsia-600",
  },
  {
    slug: "blazer",
    name: "Blazer",
    tagline: "Sharp shoulder lines for big moments",
    image: img("1552374196-c4e7ffc6e126"),
    accent: "from-indigo-900 to-indigo-700",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const spotlightCategories = ["pants", "t-shirts", "shirts"] as const;
