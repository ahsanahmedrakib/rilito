import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the full Rilito catalogue for panjabi, t-shirts, shirts, pants, winter fashion and footwear.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
