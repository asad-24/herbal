import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, Search, ShieldCheck, Star } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { StoreShell } from "@/components/StoreShell";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProducts, bestSellers, categories, certificates, settings] = await Promise.all([
    prisma.product.findMany({
      where: { status: "active", featured: true },
      include: { category: true },
      take: 4,
    }),
    prisma.product.findMany({
      where: { status: "active", bestSeller: true },
      include: { category: true },
      take: 4,
    }),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
    prisma.certificate.findMany({ where: { published: true }, take: 3 }),
    prisma.siteSetting.findFirst(),
  ]);

  return (
    <StoreShell>
      <section className="bg-[linear-gradient(135deg,#f8fbf2_0%,#eef5e4_48%,#dfe8ce_100%)]">
        <div className="container-page grid min-h-[72vh] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 shadow-sm">
              Herbal care delivered across Pakistan
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-emerald-950 sm:text-6xl">
              Natural wellness store with COD ordering and WhatsApp help.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
              Shop herbal medicines, organic herbs, oils, honey, and personal care essentials from a clean ecommerce experience built for trust.
            </p>
            <form action="/shop" className="mt-8 flex max-w-xl flex-col gap-3 rounded-lg bg-white p-2 shadow-lg sm:flex-row">
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search size={20} className="text-stone-400" />
                <input name="q" placeholder="Search shilajit, honey, moringa..." className="w-full py-3 outline-none" />
              </div>
              <button className="btn-primary">
                Search <ArrowRight size={18} />
              </button>
            </form>
            <div className="mt-7 grid gap-3 text-sm font-semibold text-stone-700 sm:grid-cols-3">
              {["Cash on delivery", "Certificates & reports", "WhatsApp support"].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-700" />
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 rounded-xl bg-white/75 p-4 shadow-2xl ring-1 ring-emerald-900/10">
            <div className="rounded-lg bg-emerald-900 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">Today&apos;s focus</p>
              <h2 className="mt-3 text-3xl font-black">Best selling herbal essentials</h2>
              <p className="mt-3 text-emerald-100">Discounted product cards, stock states, categories, and fast cart actions are ready for real catalog management.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {bestSellers.slice(0, 2).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <SectionHeader eyebrow="Shop by need" title="Popular categories" />
        <div className="grid gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/collections/${category.slug}`} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-50 text-emerald-800">
                <ShieldCheck size={22} />
              </div>
              <h3 className="mt-5 text-lg font-black">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{category.description}</p>
              <p className="mt-4 text-sm font-bold text-emerald-700">{category._count.products} products</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <SectionHeader eyebrow="Featured" title="Recommended products" href="/shop" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <SectionHeader eyebrow="Best selling" title="Discounted favorites" href="/shop?filter=best" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-5 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg bg-emerald-950 p-8 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">Trust center</p>
          <h2 className="mt-3 text-3xl font-black">Certificates and lab reports</h2>
          <p className="mt-4 leading-7 text-emerald-100">
            Inspired by established herbal stores, the site includes dedicated pages for quality documents and public trust material.
          </p>
          <Link href="/certificates" className="mt-6 inline-flex items-center gap-2 font-bold text-amber-200">
            View documents <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex h-24 items-center justify-center rounded-md" style={{ background: certificate.fileUrl }}>
                <ShieldCheck className="text-white drop-shadow" size={32} />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-emerald-700">{certificate.type}</p>
              <h3 className="mt-1 font-black">{certificate.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{certificate.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-5 py-10 md:grid-cols-3">
        {[
          ["Excellent quality and packing. COD made the first order easy.", "Verified customer"],
          ["The WhatsApp support helped me choose the right product quickly.", "Repeat buyer"],
          ["Clean website, clear rates, and fast delivery updates.", "Karachi customer"],
        ].map(([quote, author]) => (
          <div key={quote} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={18} fill="currentColor" />
              ))}
            </div>
            <p className="mt-4 leading-7 text-stone-700">&quot;{quote}&quot;</p>
            <p className="mt-4 text-sm font-bold text-emerald-800">{author}</p>
          </div>
        ))}
      </section>

      <section className="container-page rounded-xl bg-stone-900 p-8 text-white md:p-10">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-black">Need help before ordering?</h2>
            <p className="mt-3 text-stone-200">{settings?.supportCopy ?? "Talk with support on WhatsApp before placing your COD order."}</p>
          </div>
          <Link href={`https://wa.me/${settings?.whatsappNumber ?? "923000000000"}`} className="btn-primary bg-amber-400 text-emerald-950 hover:bg-amber-300">
            <MessageCircle size={18} />
            WhatsApp support
          </Link>
        </div>
      </section>
    </StoreShell>
  );
}
