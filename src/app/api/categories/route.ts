import { NextResponse } from "next/server";
import { Category, connectDb } from "@/lib/db/models";
import { toPlain } from "@/lib/db/serialize";

export async function GET() {
  try {
    await connectDb();
    const categories = await Category.find().lean().exec();
    return NextResponse.json({ categories: categories.map((c) => toPlain(c)) });
  } catch (err) {
    console.error("[categories GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
