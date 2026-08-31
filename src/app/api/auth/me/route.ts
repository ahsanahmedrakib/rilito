import { NextRequest, NextResponse } from "next/server";
import { connectDb, AdminUser } from "@/lib/db/models";
import { getRequestPayload } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const payload = await getRequestPayload(request);
    if (!payload || payload.kind !== "admin") {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    await connectDb();
    const user = await AdminUser.findById(payload.sub).lean().exec();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[auth/me]", err);
    return NextResponse.json({ user: null, error: "Server error" }, { status: 500 });
  }
}
