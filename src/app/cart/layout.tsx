import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Review the items in your Rilito shopping bag and head to secure checkout with cash on delivery or online payment.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: false },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
