import { Toaster } from "@/components/shared/components/Toaster";
import { FloatingSocial } from "@/components/shared/components/FloatingSocial";
import {
  SITE_URL,
  STORE_ADDRESS,
  WEBSITE_NAME,
  socialLinks,
} from "@/components/shared/data/site";
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

const title = "𝐑𝐈𝐋𝐈𝐓𝐎 — 𝐑𝐄𝐃𝐄𝐅𝐈𝐍𝐄 𝐘𝐎𝐔𝐑 𝐒𝐓𝐘𝐋𝐄";
const description =
  "Shop Rilito for premium panjabi, t-shirts, shirts, pants, winter fashion and footwear. Free delivery over ৳2,000 and cash on delivery across Bangladesh.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s — Rilito",
  },
  description,
  keywords: [
    "Rilito",
    "menswear Bangladesh",
    "panjabi",
    "t-shirt",
    "online clothing store",
    "cash on delivery",
    "winter fashion bangladesh",
    "eid panjabi",
    "premium menswear dhaka",
  ],
  authors: [{ name: "Rilito" }],
  creator: "Rilito",
  publisher: "Rilito",
  category: "ecommerce",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: WEBSITE_NAME,
    title,
    description,
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 600,
        height: 600,
        alt: "Rilito",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${SITE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  formatDetection: {
    telephone: false,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: WEBSITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description,
  address: {
    "@type": "PostalAddress",
    streetAddress: STORE_ADDRESS,
    addressLocality: "Gopalganj",
    postalCode: "8100",
    addressCountry: "BD",
  },
  sameAs: Object.values(socialLinks),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
          <FloatingSocial />
        </StoreProvider>
      </body>
    </html>
  );
}


