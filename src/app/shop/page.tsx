import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { StoreShell } from "@/components/StoreShell";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const filter = typeof params.filter === "string" ? params.filter : "";
  const sort = typeof params.sort === "string" ? params.sort : "featured";

  const products = await prisma.product.findMany({
    where: {
      status: "active",
      ...(query
        ? {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } },
              { benefits: { contains: query } },
            ],
          }
        : {}),
      ...(filter === "best" ? { bestSeller: true } : {}),
    },
    include: { category: true },
    orderBy:
      sort === "price-asc"
        ? { salePrice: "asc" }
        : sort === "price-desc"
          ? { regularPrice: "desc" }
          : { createdAt: "desc" },
  });

  return (
    <StoreShell>
      <section className="container-page py-10">
        <SectionHeader eyebrow="Catalog" title={query ? `Search results for "${query}"` : "All herbal products"} />
        <form className="mb-7 grid gap-3 rounded-lg border border-stone-200 bg-white p-4 md:grid-cols-[1fr_auto_auto]">
          <input name="q" defaultValue={query} placeholder="Search products" className="store-input" />
          <select name="filter" defaultValue={filter} className="store-input md:w-44">
            <option value="">All products</option>
            <option value="best">Best sellers</option>
          </select>
          <select name="sort" defaultValue={sort} className="store-input md:w-44">
            <option value="featured">Newest</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
          <button className="btn-primary md:col-start-3">Apply filters</button>
        </form>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {!products.length ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">
            No products found. Try a different search.
          </div>
        ) : null}
      </section>
    </StoreShell>
  );
}
