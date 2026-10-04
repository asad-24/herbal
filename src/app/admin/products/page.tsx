import { revalidatePath } from "next/cache";
import { AdminField, AdminTable } from "@/components/AdminControls";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatPrice, parseImages } from "@/lib/format";

export const dynamic = "force-dynamic";

async function saveProduct(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const name = String(formData.get("name") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const regularPrice = Number(formData.get("regularPrice") ?? 0);
  const salePriceValue = String(formData.get("salePrice") ?? "");
  const data = {
    name,
    slug,
    categoryId,
    description: String(formData.get("description") ?? ""),
    benefits: String(formData.get("benefits") ?? ""),
    usage: String(formData.get("usage") ?? ""),
    packing: String(formData.get("packing") ?? ""),
    regularPrice,
    salePrice: salePriceValue ? Number(salePriceValue) : null,
    stock: Number(formData.get("stock") ?? 0),
    images: JSON.stringify([String(formData.get("image") ?? "linear-gradient(135deg,#f2f7e9,#cde0b8,#708c55)")]),
    featured: formData.get("featured") === "on",
    bestSeller: formData.get("bestSeller") === "on",
    status: String(formData.get("status") ?? "active"),
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

async function deleteProduct(formData: FormData) {
  "use server";
  await requireAdmin();
  await prisma.product.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/products");
}

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  await requireAdmin();
  const params = await searchParams;
  const editId = typeof params.edit === "string" ? params.edit : "";
  const [products, categories, editProduct] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    editId ? prisma.product.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <AdminShell>
      <h1 className="text-3xl font-black">Products</h1>
      <form action={saveProduct} className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">{editProduct ? "Edit product" : "Add product"}</h2>
        <input type="hidden" name="id" value={editProduct?.id ?? ""} />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <AdminField label="Name" name="name" defaultValue={editProduct?.name} required />
          <AdminField label="Slug" name="slug" defaultValue={editProduct?.slug} required />
          <label>
            <span className="admin-label">Category</span>
            <select name="categoryId" defaultValue={editProduct?.categoryId ?? categories[0]?.id} className="admin-input" required>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <AdminField label="Regular price" name="regularPrice" type="number" defaultValue={editProduct?.regularPrice} required />
          <AdminField label="Sale price" name="salePrice" type="number" defaultValue={editProduct?.salePrice ?? ""} />
          <AdminField label="Stock" name="stock" type="number" defaultValue={editProduct?.stock ?? 0} required />
          <AdminField label="Packing" name="packing" defaultValue={editProduct?.packing} required />
          <AdminField label="Image CSS gradient / URL" name="image" defaultValue={editProduct ? parseImages(editProduct.images)[0] : ""} />
          <label>
            <span className="admin-label">Status</span>
            <select name="status" defaultValue={editProduct?.status ?? "active"} className="admin-input">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <label className="md:col-span-3">
            <span className="admin-label">Description</span>
            <textarea name="description" defaultValue={editProduct?.description} className="admin-input min-h-24" required />
          </label>
          <label>
            <span className="admin-label">Benefits</span>
            <textarea name="benefits" defaultValue={editProduct?.benefits} className="admin-input min-h-24" required />
          </label>
          <label>
            <span className="admin-label">Usage</span>
            <textarea name="usage" defaultValue={editProduct?.usage} className="admin-input min-h-24" required />
          </label>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="featured" defaultChecked={editProduct?.featured} /> Featured</label>
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="bestSeller" defaultChecked={editProduct?.bestSeller} /> Best seller</label>
          </div>
        </div>
        <button className="btn-primary mt-5">{editProduct ? "Save product" : "Create product"}</button>
      </form>
      <AdminTable headers={["Product", "Category", "Price", "Stock", "Status", "Actions"]}>
        {products.map((product) => (
          <tr key={product.id} className="border-t border-stone-200">
            <td className="p-3 font-semibold">{product.name}</td>
            <td className="p-3">{product.category.name}</td>
            <td className="p-3">{formatPrice(product.salePrice ?? product.regularPrice)}</td>
            <td className="p-3">{product.stock}</td>
            <td className="p-3 capitalize">{product.status}</td>
            <td className="p-3">
              <div className="flex gap-2">
                <a className="btn-secondary py-2" href={`/admin/products?edit=${product.id}`}>Edit</a>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
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
