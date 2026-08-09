import { Toaster } from "@/components/shared/components/Toaster";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { Footer } from "@/features/footer/components/Footer";
import { Header } from "@/features/header/components/Header";
import { MobileMenu } from "@/features/header/components/MobileMenu";
import { SearchOverlay } from "@/features/search/components/SearchOverlay";
import { StoreProvider } from "@/lib/store";
import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rilito — Modern Menswear for Bangladesh",
  description:
    "Shop Rilito for premium panjabi, t-shirts, shirts, pants, winter fashion and footwear. Free delivery over ৳2,000 and cash on delivery across Bangladesh.",
  keywords: [
    "Rilito",
    "menswear Bangladesh",
    "panjabi",
    "t-shirt",
    "online clothing store",
    "cash on delivery",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream font-sans">
        <StoreProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
          <SearchOverlay />
          <MobileMenu />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
