import { NextResponse } from "next/server";
import { Product, connectDb } from "@/lib/db/models";

export async function GET() {
  try {
    await connectDb();
    const products = await Product.find({ deleted: { $ne: true } })
      .lean()
      .exec();
    const mapped = products.map((p) => ({
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
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      isBestSeller: p.isBestSeller,
      isNew: p.isNew,
      featured: p.featured,
      deleted: p.deleted,
      reviews: [] as never[],
      _id: undefined,
    }));
    return NextResponse.json({ products: mapped });
  } catch (err) {
    console.error("[products GET]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
