import Link from "next/link";
import type { Category, Product } from "@prisma/client";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImage } from "@/components/ProductImage";
import { discountPercent, formatPrice, parseImages } from "@/lib/format";

type ProductWithCategory = Product & { category: Category };

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const image = parseImages(product.images)[0] || "";
  const price = product.salePrice ?? product.regularPrice;
  const discount = discountPercent(product.regularPrice, product.salePrice);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative">
          <ProductImage image={image} name={product.name} className="rounded-none" />
          {discount ? (
            <span className="absolute left-3 top-3 rounded bg-amber-400 px-2 py-1 text-xs font-bold text-emerald-950">
              -{discount}%
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link
            href={`/collections/${product.category.slug}`}
            className="text-xs font-semibold uppercase tracking-wide text-emerald-700"
          >
            {product.category.name}
          </Link>
          <h3 className="mt-1 min-h-12 text-base font-bold leading-snug text-stone-950">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-stone-600">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold text-emerald-900">{formatPrice(price)}</div>
            {product.salePrice ? (
              <div className="text-sm text-stone-400 line-through">
                {formatPrice(product.regularPrice)}
              </div>
            ) : null}
          </div>
          <span className="text-xs font-medium text-stone-500">
            {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
          </span>
        </div>
        <AddToCartButton
          compact
          item={{
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price,
            image,
            stock: product.stock,
          }}
        />
      </div>
    </article>
  );
}

