import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminToken } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const loginUrl = new URL("/admin/login?error=1", request.url);

  const admin = await prisma.adminUser.findUnique({ where: { email } }).catch(() => null);

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminToken(admin.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

