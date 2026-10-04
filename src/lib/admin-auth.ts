import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "waheed_admin_session";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "change-this-secret-before-production";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createAdminToken(adminId: string) {
  const payload = `${adminId}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  const actual = parts[2];
  if (expected.length !== actual.length) return null;
  const isValid = timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
  return isValid ? parts[0] : null;
}

export async function setAdminSession(adminId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createAdminToken(adminId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAdminId() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  const adminId = await getAdminId();
  if (!adminId) redirect("/admin/login");
  return adminId;
}
