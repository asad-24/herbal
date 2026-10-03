import type { CartLine } from "@/types/cart";

export function buildWhatsAppUrl(phone: string, lines: CartLine[], orderId?: string) {
  const summary = lines
    .map((line) => `- ${line.name} x ${line.quantity}`)
    .join("\n");
  const message = [
    "Assalam o Alaikum, I want to place an order.",
    orderId ? `Order ID: ${orderId}` : "",
    summary,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

