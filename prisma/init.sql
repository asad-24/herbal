PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS "OrderItem";
DROP TABLE IF EXISTS "Order";
DROP TABLE IF EXISTS "Product";
DROP TABLE IF EXISTS "Category";
DROP TABLE IF EXISTS "Certificate";
DROP TABLE IF EXISTS "AdminUser";
DROP TABLE IF EXISTS "SiteSetting";

CREATE TABLE "Category" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

CREATE TABLE "Product" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "benefits" TEXT NOT NULL,
  "usage" TEXT NOT NULL,
  "packing" TEXT NOT NULL,
  "regularPrice" INTEGER NOT NULL,
  "salePrice" INTEGER,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "images" TEXT NOT NULL DEFAULT '[]',
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "bestSeller" BOOLEAN NOT NULL DEFAULT false,
  "status" TEXT NOT NULL DEFAULT 'active',
  "categoryId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

CREATE TABLE "Order" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "customerName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "notes" TEXT,
  "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "total" INTEGER NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "quantity" INTEGER NOT NULL,
  "unitPrice" INTEGER NOT NULL,
  "productId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Certificate" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "AdminUser" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

CREATE TABLE "SiteSetting" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "storeName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "whatsappNumber" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "shippingText" TEXT NOT NULL,
  "supportCopy" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

PRAGMA foreign_keys=ON;

