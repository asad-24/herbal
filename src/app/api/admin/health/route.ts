import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function databaseNameFromUri(uri?: string) {
  if (!uri) return null;
  try {
    const url = new URL(uri);
    return url.pathname.replace(/^\//, "") || null;
  } catch {
    return null;
  }
}

export async function GET() {
  const hasMongoUri = Boolean(process.env.MONGODB_URI);
  const databaseName = databaseNameFromUri(process.env.MONGODB_URI);

  try {
    const [adminCount, defaultAdmin] = await Promise.all([
      prisma.adminUser.count(),
      prisma.adminUser.findUnique({
        where: { email: "admin@herbal.local" },
        select: { email: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      hasMongoUri,
      databaseName,
      adminCount,
      defaultAdminExists: Boolean(defaultAdmin),
      defaultAdminEmail: defaultAdmin?.email ?? null,
      defaultAdminCreatedAt: defaultAdmin?.createdAt ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        hasMongoUri,
        databaseName,
        error: error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 },
    );
  }
}

