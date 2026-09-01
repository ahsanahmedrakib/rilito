import { NextRequest, NextResponse } from "next/server";
import { Product as ProductModel, connectDb } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";
import type { Product } from "@/lib/types";
import { toProductPlain } from "@/lib/db/serialize";
import {
  generateSku,
  nextProductId,
} from "@/components/features/admin/data/adminSchemas";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    await connectDb();
    const includeDeleted = request.nextUrl.searchParams.get("deleted") === "true";
    const query = includeDeleted ? {} : { deleted: { $ne: true } };
    const products = await ProductModel.find(query).lean().exec();
    return NextResponse.json({
      products: products.map((p) => toProductPlain(p)),
    });
  } catch (err) {
    console.error("[admin/products GET]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    await connectDb();

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!body.name || body.price === undefined || body.category === undefined) {
      return NextResponse.json(
        { error: "name, price and category are required" },
        { status: 400 }
      );
    }

    const allProducts = (await ProductModel.find().lean().exec()) as unknown as Product[];
    const id = body.id && String(body.id).trim()
      ? String(body.id).trim()
      : nextProductId(allProducts);
    const slug = String(body.slug && String(body.slug).trim()
      ? body.slug
      : String(body.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    const sku = String(body.sku && String(body.sku).trim()
      ? body.sku
      : generateSku(allProducts));

    const doc = await ProductModel.create({
      id,
      slug,
      sku,
      name: String(body.name).trim(),
      category: String(body.category),
      price: Number(body.price),
      salePrice: body.salePrice !== undefined ? Number(body.salePrice) : undefined,
      images: Array.isArray(body.images) ? body.images : [],
      description: String(body.description ?? ""),
      details: Array.isArray(body.details) ? body.details : [],
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      rating: body.rating !== undefined ? Number(body.rating) : 0,
      reviewCount: body.reviewCount !== undefined ? Number(body.reviewCount) : 0,
      stock: body.stock !== undefined ? Number(body.stock) : 0,
      isBestSeller: Boolean(body.isBestSeller),
      isNew: Boolean(body.isNew),
      featured: Boolean(body.featured),
    });

    return NextResponse.json({ product: toProductPlain(doc) }, { status: 201 });
  } catch (err) {
    console.error("[admin/products POST]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
