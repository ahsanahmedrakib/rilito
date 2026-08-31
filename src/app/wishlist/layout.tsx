import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
  description:
    "Your saved Rilito favourites — keep an eye on the styles you love and check out when you are ready.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: false },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
