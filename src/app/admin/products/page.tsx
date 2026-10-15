import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminField, AdminTable } from "@/components/AdminControls";
import { AdminProductForm, type ProductFormState } from "@/components/AdminProductForm";
import { ProductImageUpload } from "@/components/ProductImageUpload";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatPrice, parseImages } from "@/lib/format";
import { DEFAULT_PRODUCT_IMAGE, matchesImageType, validateProductImage } from "@/lib/product-images";

export const dynamic = "force-dynamic";

async function saveProduct(_state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const name = String(formData.get("name") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const regularPrice = Number(formData.get("regularPrice") ?? 0);
  const salePriceValue = String(formData.get("salePrice") ?? "");
  const imageFile = formData.get("imageFile");
  let image = String(formData.get("image") ?? "").trim();
  let uploadedImageId: string | undefined;
  let savedId: string;

  // Validate before saving anything. File extensions and browser MIME types alone
  // are not enough to identify an uploaded image.
  let imageBytes: Uint8Array<ArrayBuffer> | undefined;
  // Empty native file inputs may arrive with a synthesized filename after
  // multipart serialization, so identify that placeholder by size and type.
  if (imageFile instanceof File && (imageFile.size > 0 || imageFile.type !== "application/octet-stream")) {
    const error = validateProductImage(imageFile);
    if (error) return { error };
    imageBytes = new Uint8Array(await imageFile.arrayBuffer());
    if (!matchesImageType(imageBytes, imageFile.type)) {
      return { error: "This file is not a valid JPG, PNG, WebP, or GIF image. Please choose another photo." };
    }
  } else if (image && !/^(https?:\/\/|\/(?!\/)|(?:linear|radial|conic)-gradient\()/i.test(image)) {
    return { error: "Use Browse images to select a photo from your computer, or enter an image web URL." };
  }

  try {
    if (imageBytes && imageFile instanceof File) {
      const asset = await prisma.productImageAsset.create({
        data: { contentType: imageFile.type, data: imageBytes },
        select: { id: true },
      });
      uploadedImageId = asset.id;
      image = `/api/product-images/${asset.id}`;
    }
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
      images: JSON.stringify([image || DEFAULT_PRODUCT_IMAGE]),
      featured: formData.get("featured") === "on",
      bestSeller: formData.get("bestSeller") === "on",
      status: String(formData.get("status") ?? "active"),
    };

    const saved = id
      ? await prisma.product.update({ where: { id }, data, select: { id: true } })
      : await prisma.product.create({ data, select: { id: true } });
    savedId = saved.id;
  } catch (error) {
    if (uploadedImageId) {
      await prisma.productImageAsset.delete({ where: { id: uploadedImageId } }).catch(() => {});
    }
    console.error("Failed to save product", error);
    return { error: "Could not save the product. Check that the slug is unique and try again. Your entries and selected photo are still here." };
  }
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/products/[slug]", "page");
  redirect(`/admin/products?edit=${savedId}&saved=1`);
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
      <AdminProductForm key={editProduct?.id ?? "new"} action={saveProduct} editing={!!editProduct} saved={params.saved === "1"}>
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
          <ProductImageUpload key={editProduct?.images ?? "new"} initialImage={editProduct ? parseImages(editProduct.images)[0] : ""} />
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
      </AdminProductForm>
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
