import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Browse every Rilito product — panjabi, t-shirts, shirts, pants, winter fashion, footwear and combo packs. Filter by category, size and price.",
  alternates: { canonical: "/products" },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
