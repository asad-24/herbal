import { revalidatePath } from "next/cache";
import { AdminField } from "@/components/AdminControls";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function saveSettings(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = {
    storeName: String(formData.get("storeName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
    address: String(formData.get("address") ?? ""),
    shippingText: String(formData.get("shippingText") ?? ""),
    supportCopy: String(formData.get("supportCopy") ?? ""),
  };
  if (id) await prisma.siteSetting.update({ where: { id }, data });
  else await prisma.siteSetting.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await prisma.siteSetting.findFirst();

  return (
    <AdminShell>
      <h1 className="text-3xl font-black">Store settings</h1>
      <form action={saveSettings} className="mt-6 max-w-4xl rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <input type="hidden" name="id" value={settings?.id ?? ""} />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Store name" name="storeName" defaultValue={settings?.storeName} required />
          <AdminField label="Phone" name="phone" defaultValue={settings?.phone} required />
          <AdminField label="WhatsApp number" name="whatsappNumber" defaultValue={settings?.whatsappNumber} required />
          <AdminField label="Address" name="address" defaultValue={settings?.address} required />
          <label className="md:col-span-2">
            <span className="admin-label">Shipping text</span>
            <textarea name="shippingText" defaultValue={settings?.shippingText} className="admin-input min-h-24" required />
          </label>
          <label className="md:col-span-2">
            <span className="admin-label">Support copy</span>
            <textarea name="supportCopy" defaultValue={settings?.supportCopy} className="admin-input min-h-24" required />
          </label>
        </div>
        <button className="btn-primary mt-5">Save settings</button>
      </form>
    </AdminShell>
  );
}
