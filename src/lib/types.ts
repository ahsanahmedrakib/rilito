export interface ColorOption {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
  colors: ColorOption[];
  /** Stock per size label. Total `stock` should equal the sum of these values. */
  sizeStock?: Record<string, number>;
  /** Optional size-guide chart image shown in the "View size guide" popup. */
  sizeGuideImage?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  featured?: boolean;
  deleted?: boolean;
  reviews: Review[];
}

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  accent: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  content: string[];
}

export type HomeValueIcon = "truck" | "cash" | "refresh" | "shield";

export interface HomeValue {
  icon: HomeValueIcon;
  title: string;
  text: string;
}

export interface HomeTestimonial {
  name: string;
  role: string;
  text: string;
  initials: string;
  /** Optional star rating (1-5). Defaults to 5 when absent. */
  rating?: number;
}

export interface EditorialBanner {
  eyebrow: string;
  /** Title lines separated by "\n" to support multi-line headings. */
  title: string;
  subtitle: string;
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export interface Faq {
  question: string;
  answer: string;
}

export interface PageSection {
  heading: string;
  body: string[];
}

export interface PageContent {
  title: string;
  sections: PageSection[];
}

export interface NewsletterContent {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonLabel: string;
  codeIntro: string;
  codeValue: string;
  codeOutro: string;
}

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  qty: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  payment: string;
  /** Transaction / reference ID for prepaid (QR) payments. */
  transactionId?: string;
  status: string;
  date: string;
  tracking?: {
    courier: string;
    trackingId: string;
    note: string;
  };
}

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
}

export interface AppSettings {
  qrImage: string;
  paymentNumber: string;
  paymentNote: string;
  /** Standard delivery fee in BDT. */
  shippingFee: number;
  /** Orders at or above this subtotal get FREE standard delivery. */
  freeShippingThreshold: number;
  /** Announcement marquee messages shown above the navbar. */
  marqueeTexts: string[];
  /** Hero banner slides shown on the public home page. */
  heroSlides: HeroSlide[];
  /** Value propositions shown below the home hero slider. */
  homeValues: HomeValue[];
  /** Customer testimonials shown on the home page. */
  testimonials: HomeTestimonial[];
  /** "The Rilito Edit" editorial banner on the home page. */
  editorialBanner: EditorialBanner;
  /** Blog posts powering the blog index, detail pages and home section. */
  blogPosts: BlogPost[];
  /** Static info pages (about, privacy, terms, returns, delivery, booking…). */
  pageContents: Record<string, PageContent>;
  /** FAQ entries shown on the /pages/faq page. */
  faqs: Faq[];
  /** Marketing copy for the newsletter signup section on the home page. */
  newsletter: NewsletterContent;
}

export interface HeroSlide {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { href: string; label: string };
  order: number;
  active?: boolean;
}

export interface ContactQuery {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
  read: boolean;
  date: string;
}