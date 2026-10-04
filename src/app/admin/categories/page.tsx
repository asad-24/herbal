import { revalidatePath } from "next/cache";
import { AdminField, AdminTable } from "@/components/AdminControls";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function saveCategory(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

async function deleteCategory(formData: FormData) {
  "use server";
  await requireAdmin();
  await prisma.category.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage({ searchParams }: PageProps<"/admin/categories">) {
  await requireAdmin();
  const params = await searchParams;
  const editId = typeof params.edit === "string" ? params.edit : "";
  const [categories, editCategory] = await Promise.all([
    prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } }),
    editId ? prisma.category.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <AdminShell>
      <h1 className="text-3xl font-black">Categories</h1>
      <form action={saveCategory} className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">{editCategory ? "Edit category" : "Add category"}</h2>
        <input type="hidden" name="id" value={editCategory?.id ?? ""} />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <AdminField label="Name" name="name" defaultValue={editCategory?.name} required />
          <AdminField label="Slug" name="slug" defaultValue={editCategory?.slug} required />
          <label className="md:col-span-2">
            <span className="admin-label">Description</span>
            <textarea name="description" defaultValue={editCategory?.description} className="admin-input min-h-24" required />
          </label>
        </div>
        <button className="btn-primary mt-5">{editCategory ? "Save category" : "Create category"}</button>
      </form>
      <AdminTable headers={["Name", "Slug", "Products", "Actions"]}>
        {categories.map((category) => (
          <tr key={category.id} className="border-t border-stone-200">
            <td className="p-3 font-semibold">{category.name}</td>
            <td className="p-3">{category.slug}</td>
            <td className="p-3">{category._count.products}</td>
            <td className="p-3">
              <div className="flex gap-2">
                <a className="btn-secondary py-2" href={`/admin/categories?edit=${category.id}`}>Edit</a>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <button disabled={category._count.products > 0} className="btn-secondary py-2 text-red-700 disabled:opacity-40">Delete</button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </AdminShell>
  );
}
