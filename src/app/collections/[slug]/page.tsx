import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { StoreShell } from "@/components/StoreShell";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { status: "active" },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) notFound();

  return (
    <StoreShell>
      <section className="container-page py-10">
        <SectionHeader eyebrow="Collection" title={category.name} />
        <p className="mb-8 max-w-2xl leading-7 text-stone-600">{category.description}</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </StoreShell>
  );
}
