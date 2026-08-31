import { NextRequest, NextResponse } from "next/server";
import { Product, Review, connectDb } from "@/lib/db/models";
import { toPlain } from "@/lib/db/serialize";

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const productId = request.nextUrl.searchParams.get("productId");
    const query: Record<string, unknown> = { status: "approved" };
    if (productId) query.productId = productId;
    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({ reviews: reviews.map((r) => toPlain(r)) });
  } catch (err) {
    console.error("[reviews GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { productId, author, rating, title, bodyText, verified } = body as {
      productId: string;
      author: string;
      rating: number;
      title?: string;
      bodyText?: string;
      verified?: boolean;
    };
    if (!productId || !author || !rating) {
      return NextResponse.json(
        { error: "productId, author and rating are required" },
        { status: 400 }
      );
    }
    const product = await Product.findOne({ id: productId }).exec();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const review = await Review.create({
      id: `rev-${Date.now().toString(36)}${Math.floor(Math.random() * 90 + 10)}`,
      productId,
      productName: product.name,
      author,
      rating: Number(rating),
      title: title ?? "",
      body: bodyText ?? "",
      date: new Date().toISOString(),
      verified: Boolean(verified),
      status: "pending",
    });
    return NextResponse.json({ review: toPlain(review) }, { status: 201 });
  } catch (err) {
    console.error("[reviews POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
