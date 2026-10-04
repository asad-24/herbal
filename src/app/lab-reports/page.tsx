import { DocumentGrid } from "@/app/certificates/page";
import { StoreShell } from "@/components/StoreShell";
import { prisma } from "@/lib/db";
import { fallbackCertificates } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export default async function LabReportsPage() {
  const reports = await prisma.certificate.findMany({
    where: { published: true, type: "Lab Report" },
    orderBy: { createdAt: "desc" },
  }).catch(() => fallbackCertificates.filter((item) => item.type === "Lab Report"));

  return (
    <StoreShell>
      <DocumentGrid title="Lab Reports" subtitle="Batch report placeholders for future uploaded product testing documents." items={reports} />
    </StoreShell>
  );
}
