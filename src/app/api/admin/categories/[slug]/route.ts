import { NextRequest, NextResponse } from "next/server";
import { Category, connectDb } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";
import { toPlain } from "@/lib/db/serialize";

type Ctx = { params: Promise<{ slug: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { slug } = await ctx.params;
  try {
    await connectDb();
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const doc = await Category.findOne({ slug }).exec();
    if (!doc) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    for (const field of ["name", "tagline", "image", "accent"] as const) {
      if (body[field] !== undefined) (doc as unknown as Record<string, unknown>)[field] = body[field];
    }
    if (body.slug !== undefined && String(body.slug).trim()) {
      const newSlug = String(body.slug)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const clash = await Category.findOne({
        slug: newSlug,
        _id: { $ne: doc._id },
      }).exec();
      if (clash) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 409 }
        );
      }
      doc.slug = newSlug;
    }
    await doc.save();
    return NextResponse.json({ category: toPlain(doc) });
  } catch (err) {
    console.error("[admin/categories PATCH]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { slug } = await ctx.params;
  try {
    await connectDb();
    const doc = await Category.findOne({ slug }).exec();
    if (!doc) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    await Category.deleteOne({ _id: doc._id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/categories DELETE]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
