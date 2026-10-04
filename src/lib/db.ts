import { PrismaClient } from "@prisma/client";

function normalizeMongoUri() {
  const rawUri = process.env.MONGODB_URI?.trim();
  if (!rawUri) return;

  let uri = rawUri;
  if (uri.startsWith("MONGODB_URI=")) {
    uri = uri.replace(/^MONGODB_URI=/, "").trim();
  }
  uri = uri.replace(/^['"]|['"]$/g, "");

  if (!uri.startsWith("mongo")) {
    return;
  }

  process.env.MONGODB_URI = uri;
}

normalizeMongoUri();

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
