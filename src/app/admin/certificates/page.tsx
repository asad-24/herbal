import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/AdminShell";
import { prisma } from "@/lib/db";
import { AdminField, AdminTable } from "@/app/admin/products/page";

export const dynamic = "force-dynamic";

async function saveCertificate(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const data = {
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? "Certificate"),
    description: String(formData.get("description") ?? ""),
    fileUrl: String(formData.get("fileUrl") ?? "linear-gradient(135deg,#f8fbf2,#cedbb3)"),
    published: formData.get("published") === "on",
  };
  if (id) await prisma.certificate.update({ where: { id }, data });
  else await prisma.certificate.create({ data });
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  revalidatePath("/lab-reports");
}

async function deleteCertificate(formData: FormData) {
  "use server";
  await prisma.certificate.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/certificates");
}

export default async function AdminCertificatesPage({ searchParams }: PageProps<"/admin/certificates">) {
  const params = await searchParams;
  const editId = typeof params.edit === "string" ? params.edit : "";
  const [certificates, editCertificate] = await Promise.all([
    prisma.certificate.findMany({ orderBy: { createdAt: "desc" } }),
    editId ? prisma.certificate.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <AdminShell>
      <h1 className="text-3xl font-black">Certificates & lab reports</h1>
      <form action={saveCertificate} className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">{editCertificate ? "Edit document" : "Add document"}</h2>
        <input type="hidden" name="id" value={editCertificate?.id ?? ""} />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <AdminField label="Title" name="title" defaultValue={editCertificate?.title} required />
          <label>
            <span className="admin-label">Type</span>
            <select name="type" defaultValue={editCertificate?.type ?? "Certificate"} className="admin-input">
              <option value="Certificate">Certificate</option>
              <option value="Lab Report">Lab Report</option>
            </select>
          </label>
          <AdminField label="File URL / image CSS gradient" name="fileUrl" defaultValue={editCertificate?.fileUrl} />
          <label className="flex items-center gap-2 pt-7 text-sm font-semibold">
            <input type="checkbox" name="published" defaultChecked={editCertificate?.published ?? true} /> Published
          </label>
          <label className="md:col-span-2">
            <span className="admin-label">Description</span>
            <textarea name="description" defaultValue={editCertificate?.description} className="admin-input min-h-24" required />
          </label>
        </div>
        <button className="btn-primary mt-5">{editCertificate ? "Save document" : "Create document"}</button>
      </form>
      <AdminTable headers={["Title", "Type", "Published", "Actions"]}>
        {certificates.map((certificate) => (
          <tr key={certificate.id} className="border-t border-stone-200">
            <td className="p-3 font-semibold">{certificate.title}</td>
            <td className="p-3">{certificate.type}</td>
            <td className="p-3">{certificate.published ? "Yes" : "No"}</td>
            <td className="p-3">
              <div className="flex gap-2">
                <a className="btn-secondary py-2" href={`/admin/certificates?edit=${certificate.id}`}>Edit</a>
                <form action={deleteCertificate}>
                  <input type="hidden" name="id" value={certificate.id} />
                  <button className="btn-secondary py-2 text-red-700">Delete</button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </AdminShell>
  );
}
