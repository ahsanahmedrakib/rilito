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
  /** Announcement marquee messages shown above the navbar. */
  marqueeTexts: string[];
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