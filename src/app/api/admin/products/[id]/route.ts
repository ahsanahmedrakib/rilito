import { NextRequest, NextResponse } from "next/server";
import { Product, connectDb } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";
import { toProductPlain } from "@/lib/db/serialize";

type Ctx = { params: Promise<{ id: string }> };

const FIELDS = [
  "slug",
  "sku",
  "name",
  "category",
  "price",
  "salePrice",
  "images",
  "description",
  "details",
  "sizes",
  "colors",
  "tags",
  "rating",
  "reviewCount",
  "stock",
  "isBestSeller",
  "isNew",
  "featured",
  "deleted",
] as const;

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { id } = await ctx.params;
  try {
    await connectDb();

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const doc = await Product.findOne({ id }).exec();
    if (!doc) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    for (const field of FIELDS) {
      if (body[field] !== undefined) {
        (doc as unknown as Record<string, unknown>)[field] =
          field === "price" ||
          field === "salePrice" ||
          field === "stock" ||
          field === "rating" ||
          field === "reviewCount"
            ? Number(body[field])
            : body[field];
      }
    }

    await doc.save();
    return NextResponse.json({ product: toProductPlain(doc) });
  } catch (err) {
    console.error("[admin/products PATCH]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { id } = await ctx.params;
  try {
    await connectDb();
    const doc = await Product.findOne({ id }).exec();
    if (!doc) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await Product.deleteOne({ _id: doc._id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/products DELETE]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
