import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDb, AdminUser } from "@/lib/db/models";
import {
  COOKIE_REFRESH,
  setAuthCookies,
  toAdminPayload,
  verifyRefreshToken,
} from "@/lib/auth";

export async function POST() {
  try {
    const store = await cookies();
    const refresh = store.get(COOKIE_REFRESH)?.value;
    if (!refresh) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }
    const payload = verifyRefreshToken(refresh);
    if (!payload || payload.kind !== "admin") {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    await connectDb();
    const user = await AdminUser.findById(payload.sub).exec();
    if (!user) {
      return NextResponse.json({ error: "User no longer exists" }, { status: 401 });
    }

    await setAuthCookies(toAdminPayload(user));
    return NextResponse.json({ ok: true, role: user.role });
  } catch (err) {
    console.error("[auth/refresh]", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
