import { ShieldCheck } from "lucide-react";
import { StoreShell } from "@/components/StoreShell";
import { prisma } from "@/lib/db";

export default async function CertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    where: { published: true, type: "Certificate" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <StoreShell>
      <DocumentGrid title="Certificates" subtitle="Quality, authenticity, and supplier verification placeholders." items={certificates} />
    </StoreShell>
  );
}

export function DocumentGrid({ title, subtitle, items }: { title: string; subtitle: string; items: { id: string; title: string; description: string; type: string; fileUrl: string }[] }) {
  return (
    <section className="container-page py-10">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Trust documents</p>
      <h1 className="mt-2 text-4xl font-black">{title}</h1>
      <p className="mt-3 max-w-2xl leading-7 text-stone-600">{subtitle}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex h-44 items-center justify-center rounded-md" style={{ background: item.fileUrl }}>
              <ShieldCheck className="text-white drop-shadow" size={44} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-emerald-700">{item.type}</p>
            <h2 className="mt-1 text-xl font-black">{item.title}</h2>
            <p className="mt-2 leading-7 text-stone-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

