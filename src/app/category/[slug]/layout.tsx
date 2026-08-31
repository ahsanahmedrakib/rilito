import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop by Category",
  description:
    "Browse Rilito by category — panjabi, t-shirts, shirts, pants, winter fashion, footwear and more, with free delivery over ৳2,000.",
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
