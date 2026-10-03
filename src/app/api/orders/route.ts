import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CartLine } from "@/types/cart";

export async function POST(request: Request) {
  const body = await request.json();
  const items = Array.isArray(body.items) ? (body.items as CartLine[]) : [];

  if (!body.customerName || !body.phone || !body.address || !body.city || !items.length) {
    return NextResponse.json({ error: "Missing required order information." }, { status: 400 });
  }

  const ids = items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids }, status: "active" } });
  const productMap = new Map(products.map((product) => [product.id, product]));

  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`Product unavailable: ${item.name}`);
    }
    const price = product.salePrice ?? product.regularPrice;
    return {
      productId: product.id,
      quantity: Math.max(1, Math.min(item.quantity, product.stock)),
      unitPrice: price,
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      customerName: String(body.customerName),
      phone: String(body.phone),
      email: body.email ? String(body.email) : null,
      address: String(body.address),
      city: String(body.city),
      notes: body.notes ? String(body.notes) : null,
      total,
      paymentMethod: "COD",
      items: { create: orderItems },
    },
  });

  const settings = await prisma.siteSetting.findFirst();
  return NextResponse.json({
    orderId: order.id,
    whatsappUrl: buildWhatsAppUrl(settings?.whatsappNumber ?? "923000000000", items, order.id),
  });
}

