import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Manage your Rilito account — view your profile, order history and saved details.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
