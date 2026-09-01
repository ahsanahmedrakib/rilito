import jwt, { type SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { connectDb, AdminUser } from "@/lib/db/models";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "rilito-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "rilito-refresh-secret";

const ACCESS_MAX_AGE = 15 * 60; // 15 minutes
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export const COOKIE_ACCESS = "rilito_access";
export const COOKIE_REFRESH = "rilito_refresh";

export interface AuthPayload {
  sub: string;
  email: string;
  role: "superadmin" | "admin" | "customer";
  kind: "admin" | "customer";
}

function sign(
  payload: AuthPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function signAccessToken(payload: AuthPayload): string {
  return sign(payload, ACCESS_SECRET, ACCESS_MAX_AGE);
}

export function signRefreshToken(payload: AuthPayload): string {
  return sign(payload, REFRESH_SECRET, REFRESH_MAX_AGE);
}

export function verifyAccessToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookies(payload: AuthPayload) {
  const store = await cookies();
  store.set(COOKIE_ACCESS, signAccessToken(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
  store.set(COOKIE_REFRESH, signRefreshToken(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: REFRESH_MAX_AGE,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(COOKIE_ACCESS);
  store.delete(COOKIE_REFRESH);
}

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header && header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

export async function getRequestPayload(
  request: NextRequest
): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token =
    getBearerToken(request) ??
    cookieStore.get(COOKIE_ACCESS)?.value ??
    null;
  if (!token) return null;
  return verifyAccessToken(token);
}

export interface AuthedResult {
  ok: boolean;
  status: number;
  error?: string;
  payload?: AuthPayload;
}

/** Authenticate an admin request. Pass requireRole: "superadmin" to restrict. */
export async function requireAdmin(
  request: NextRequest,
  requireRole?: "superadmin" | "admin"
): Promise<AuthedResult> {
  try {
    await connectDb();
  } catch (err) {
    return {
      ok: false,
      status: 503,
      error: err instanceof Error ? err.message : "Database unavailable.",
    };
  }
  const payload = await getRequestPayload(request);
  if (!payload || payload.kind !== "admin") {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  if (requireRole === "superadmin" && payload.role !== "superadmin") {
    return { ok: false, status: 403, error: "Super admin access required" };
  }
  return { ok: true, status: 200, payload };
}

/** Load a fresh, current admin user from DB (respects role changes). */
export async function getCurrentAdmin(payload: AuthPayload) {
  return AdminUser.findById(payload.sub).lean().exec();
}

export function toAdminPayload(user: {
  _id: unknown;
  email?: string;
  role?: string;
}): AuthPayload {
  return {
    sub: String(user._id),
    email: user.email ?? "",
    role: (user.role as AuthPayload["role"]) ?? "admin",
    kind: "admin",
  };
}
