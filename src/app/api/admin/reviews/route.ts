import { NextRequest, NextResponse } from "next/server";
import { Product, Review, connectDb } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth";
import { toPlain } from "@/lib/db/serialize";

async function refreshProductStats(productId: string) {
  const reviews = await Review.find({ productId, status: "approved" }).exec();
  const count = reviews.length;
  const avg =
    count === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / count;
  await Product.updateOne(
    { id: productId },
    { rating: Math.round(avg * 10) / 10, reviewCount: count }
  ).exec();
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    await connectDb();
    const status = request.nextUrl.searchParams.get("status");
    const query: Record<string, unknown> =
      status && status !== "all" ? { status } : {};
    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({ reviews: reviews.map(toPlain) });
  } catch (err) {
    console.error("[admin/reviews GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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
    const { id, status } = body;
    if (!id || !["pending", "approved", "rejected"].includes(String(status))) {
      return NextResponse.json(
        { error: "id and a valid status are required" },
        { status: 400 }
      );
    }
    const review = await Review.findOne({ id: String(id) }).exec();
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    review.status = status as "pending" | "approved" | "rejected";
    await review.save();
    await refreshProductStats(review.productId);
    return NextResponse.json({ review: toPlain(review) });
  } catch (err) {
    console.error("[admin/reviews PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
