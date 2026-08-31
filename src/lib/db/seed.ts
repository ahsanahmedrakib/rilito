import { Category, Coupon, Product, Review, Setting, connectDb } from "./models";
import type mongoose from "mongoose";
import { categories as seedCategories, allProducts } from "@/lib/data";
import { defaultCoupons } from "@/lib/coupons";

const SETTING_KEYS = ["qrImage", "paymentNumber", "paymentNote"] as const;

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
    if (!existing) {
      const defaults: Record<string, string> = {
        qrImage: "",
        paymentNumber: "01979-394059",
        paymentNote: "Send to this number and keep the transaction ID.",
      };
      await Setting.create({
        key,
        value: (defaults[key] ?? "") as unknown as mongoose.Schema.Types.Mixed,
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

export async function readSettings() {
  const [qrImage, paymentNumber, paymentNote] = await Promise.all([
    getSetting<string>("qrImage", ""),
    getSetting<string>("paymentNumber", "01979-394059"),
    getSetting<string>("paymentNote", "Send to this number and keep the transaction ID."),
  ]);
  return { qrImage, paymentNumber, paymentNote };
}
