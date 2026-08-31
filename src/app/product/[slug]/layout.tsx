import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Explore premium Rilito menswear — panjabi, t-shirts, shirts, pants, winter fashion and footwear with cash on delivery across Bangladesh.",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
