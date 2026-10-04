import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminToken } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const DEFAULT_ADMIN_EMAIL = "admin@herbal.local";
const DEFAULT_ADMIN_PASSWORD = "Admin123!";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const loginUrl = new URL("/admin/login?error=1", request.url);

  let admin = await prisma.adminUser.findUnique({ where: { email } }).catch(() => null);

  if (!admin && email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
    admin = await prisma.adminUser
      .create({
        data: {
          email: DEFAULT_ADMIN_EMAIL,
          passwordHash: await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10),
        },
      })
      .catch(() => null);
  }

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
