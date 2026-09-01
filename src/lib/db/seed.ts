import { Category, Coupon, Product, Review, Setting, connectDb } from "./models";
import type mongoose from "mongoose";
import {
  allProducts,
  blogPosts,
  categories as seedCategories,
  editorialBanner,
  faqs,
  homeTestimonials,
  homeValues,
  newsletterDefault,
  pageContents,
} from "@/lib/data";
import { defaultCoupons } from "@/lib/coupons";
import type { AppSettings } from "@/lib/types";

const SETTING_KEYS = [
  "qrImage",
  "paymentNumber",
  "paymentNote",
  "shippingFee",
  "freeShippingThreshold",
  "marqueeTexts",
  "heroSlides",
  "homeValues",
  "testimonials",
  "editorialBanner",
  "blogPosts",
  "pageContents",
  "faqs",
  "newsletter",
] as const;

export const DEFAULT_HERO_SLIDES = [
  {
    id: "slide-tshirts",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "New Season · Street & Classic",
    title: "Wear The Moment",
    subtitle:
      "Heavyweight tees, sharp shirts and relaxed fits — cut for the way you actually dress.",
    cta: { href: "/category/t-shirts", label: "Shop T-Shirts" },
    order: 1,
    active: true,
  },
  {
    id: "slide-panjabi",
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Panjabi · Eid & Beyond",
    title: "Elegance In Every Thread",
    subtitle:
      "From classic cotton to intricate embroidery, find the panjabi that carries the occasion.",
    cta: { href: "/category/panjabi", label: "Explore Panjabi" },
    order: 2,
    active: true,
  },
  {
    id: "slide-winter",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Winter Drop · Up to 40% Off",
    title: "Bundle Up In Style",
    subtitle:
      "Quilted bombers, puffer jackets and cosy knits that handle the cold without hiding your look.",
    cta: { href: "/category/winter", label: "Shop Winter" },
    order: 3,
    active: true,
  },
];

const SETTING_DEFAULTS: AppSettings = {
  qrImage: "",
  paymentNumber: "01611-773755",
  paymentNote: "Send to this number and keep the transaction ID.",
  shippingFee: 100,
  freeShippingThreshold: 2000,
  marqueeTexts: [
    "FREE DELIVERY ON ORDERS OVER ৳2,000",
    "FLAT 40% OFF SELECTED STYLES — SALE NOW LIVE",
    "CASH ON DELIVERY ACROSS BANGLADESH",
    "7-DAY EASY EXCHANGE ON ALL ORDERS",
  ],
  heroSlides: DEFAULT_HERO_SLIDES,
  homeValues,
  testimonials: homeTestimonials,
  editorialBanner,
  blogPosts,
  pageContents,
  faqs,
  newsletter: newsletterDefault,
};

/** Seed defaults only when collections are empty. Safe to call repeatedly. */
export async function seedCollections(): Promise<void> {
  await connectDb();

  if ((await Category.countDocuments().exec()) === 0) {
    await Category.insertMany(seedCategories);
  }

  if ((await Product.countDocuments().exec()) === 0) {
    await Product.insertMany(
      allProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        category: p.category,
        price: p.price,
        salePrice: p.salePrice,
        images: p.images,
        description: p.description,
        details: p.details,
        sizes: p.sizes,
        colors: p.colors,
        tags: p.tags,
        rating: p.rating ?? 0,
        reviewCount: p.reviewCount ?? 0,
        stock: p.stock ?? 0,
        isBestSeller: p.isBestSeller ?? false,
        isNew: p.isNew ?? false,
        featured: p.featured ?? false,
        deleted: p.deleted ?? false,
      }))
    );
  }

  if ((await Coupon.countDocuments().exec()) === 0) {
    await Coupon.insertMany(defaultCoupons());
  }

  for (const key of SETTING_KEYS) {
    const existing = await Setting.findOne({ key }).exec();
    if (
      key === "paymentNumber" &&
      existing &&
      String(existing.value) === "01979-394059"
    ) {
      existing.value =
        "01611-773755" as unknown as mongoose.Schema.Types.Mixed;
      await existing.save();
    } else if (!existing) {
      await Setting.create({
        key,
        value:
          SETTING_DEFAULTS[key] as unknown as mongoose.Schema.Types.Mixed,
      });
    }
  }

  if ((await Review.countDocuments().exec()) === 0) {
    const approved = allProducts
      .flatMap((p) =>
        (p.reviews ?? []).map((r) => ({
          id: r.id,
          productId: p.id,
          productName: p.name,
          author: r.author,
          rating: r.rating,
          title: r.title,
          body: r.body,
          date: r.date,
          verified: r.verified ?? false,
          status: "approved",
        }))
      );
    if (approved.length) await Review.insertMany(approved);
  }
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const doc = await Setting.findOne({ key }).exec();
  return doc ? (doc.value as T) : fallback;
}

export async function readSettings(): Promise<AppSettings> {
  const [
    qrImage,
    paymentNumber,
    paymentNote,
    shippingFee,
    freeShippingThreshold,
    marqueeTexts,
    heroSlides,
    homeValuesValue,
    testimonialsValue,
    editorialBannerValue,
    blogPostsValue,
    pageContentsValue,
    faqsValue,
    newsletterValue,
  ] = await Promise.all([
    getSetting<string>("qrImage", ""),
    getSetting<string>("paymentNumber", "01611-773755"),
    getSetting<string>(
      "paymentNote",
      "Send to this number and keep the transaction ID."
    ),
    getSetting<number>("shippingFee", SETTING_DEFAULTS.shippingFee as number),
    getSetting<number>(
      "freeShippingThreshold",
      SETTING_DEFAULTS.freeShippingThreshold as number
    ),
    getSetting<string[]>(
      "marqueeTexts",
      SETTING_DEFAULTS.marqueeTexts as string[]
    ),
    getSetting<typeof DEFAULT_HERO_SLIDES>(
      "heroSlides",
      DEFAULT_HERO_SLIDES
    ),
    getSetting("homeValues", SETTING_DEFAULTS.homeValues),
    getSetting("testimonials", SETTING_DEFAULTS.testimonials),
    getSetting("editorialBanner", SETTING_DEFAULTS.editorialBanner),
    getSetting("blogPosts", SETTING_DEFAULTS.blogPosts),
    getSetting("pageContents", SETTING_DEFAULTS.pageContents),
    getSetting("faqs", SETTING_DEFAULTS.faqs),
    getSetting("newsletter", SETTING_DEFAULTS.newsletter),
  ]);
  return {
    qrImage,
    paymentNumber,
    paymentNote,
    shippingFee,
    freeShippingThreshold,
    marqueeTexts,
    heroSlides,
    homeValues: homeValuesValue,
    testimonials: testimonialsValue,
    editorialBanner: editorialBannerValue,
    blogPosts: blogPostsValue,
    pageContents: pageContentsValue,
    faqs: faqsValue,
    newsletter: newsletterValue,
  };
}

/** Read site settings, falling back to static defaults if the DB is unreachable. */
export async function readSettingsSafely(): Promise<AppSettings> {
  try {
    return await readSettings();
  } catch (err) {
    console.error("[readme settings]", err);
    return SETTING_DEFAULTS;
  }
}
