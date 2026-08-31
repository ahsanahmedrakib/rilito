import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Order",
  description:
    "Track your Rilito order status in real time — from confirmed to delivered, anywhere in Bangladesh.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
