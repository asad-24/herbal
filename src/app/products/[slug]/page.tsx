import Link from "next/link";
import { CheckCircle2, MessageCircle, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { StoreShell } from "@/components/StoreShell";
import { prisma } from "@/lib/db";
import { fallbackProducts, fallbackSettings } from "@/lib/fallback-data";
import { discountPercent, formatPrice, parseImages } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  }).catch(() => fallbackProducts.find((item) => item.slug === slug) ?? null);

  if (!product || product.status !== "active") notFound();

  const related = await prisma.product.findMany({
    where: {
      status: "active",
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: { category: true },
    take: 4,
  }).catch(() =>
    fallbackProducts
      .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
      .slice(0, 4),
  );

  const image = parseImages(product.images)[0] || "";
  const price = product.salePrice ?? product.regularPrice;
  const discount = discountPercent(product.regularPrice, product.salePrice);
  const settings = await prisma.siteSetting.findFirst().catch(() => fallbackSettings);
  const trustItems: { Icon: LucideIcon; text: string }[] = [
    { Icon: CheckCircle2, text: `${product.stock} in stock` },
    { Icon: Truck, text: "COD available" },
    { Icon: MessageCircle, text: "WhatsApp support" },
  ];

  return (
    <StoreShell>
      <section className="container-page grid gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <ProductImage image={image} name={product.name} className="shadow-lg" />
        <div>
          <Link href={`/collections/${product.category.slug}`} className="text-sm font-bold uppercase tracking-wide text-emerald-700">
            {product.category.name}
          </Link>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-stone-700">{product.description}</p>
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-black text-emerald-900">{formatPrice(price)}</span>
            {product.salePrice ? <span className="text-xl text-stone-400 line-through">{formatPrice(product.regularPrice)}</span> : null}
            {discount ? <span className="rounded bg-amber-400 px-2 py-1 text-sm font-black text-emerald-950">Save {discount}%</span> : null}
          </div>
          <div className="mt-6 grid gap-3 rounded-lg border border-stone-200 bg-white p-5 sm:grid-cols-3">
            {trustItems.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                <Icon size={18} className="text-emerald-700" />
                {text}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton
              item={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price,
                image,
                stock: product.stock,
              }}
            />
            <Link href={`https://wa.me/${settings?.whatsappNumber ?? "923000000000"}?text=${encodeURIComponent(`I want to order ${product.name}`)}`} className="btn-secondary">
              <MessageCircle size={18} />
              Ask on WhatsApp
            </Link>
          </div>
          <div className="mt-8 grid gap-4">
            <InfoBlock title="Benefits" text={product.benefits} />
            <InfoBlock title="How to use" text={product.usage} />
            <InfoBlock title="Packing" text={product.packing} />
          </div>
        </div>
      </section>
      {related.length ? (
        <section className="container-page py-10">
          <h2 className="mb-6 text-2xl font-black">Related products</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </StoreShell>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <h2 className="font-black text-stone-950">{title}</h2>
      <p className="mt-2 leading-7 text-stone-600">{text}</p>
    </div>
  );
}
