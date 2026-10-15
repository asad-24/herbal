import { prisma } from "@/lib/db";
import { PRODUCT_IMAGE_TYPES } from "@/lib/product-images";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) return new Response(null, { status: 404 });

  const image = await prisma.productImageAsset.findUnique({ where: { id } });
  if (!image || !PRODUCT_IMAGE_TYPES.includes(image.contentType)) {
    return new Response(null, { status: 404 });
  }

  return new Response(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": String(image.data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
