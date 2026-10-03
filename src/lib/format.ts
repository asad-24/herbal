export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("PKR", "Rs.");
}

export function parseImages(images: string) {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function discountPercent(regularPrice: number, salePrice?: number | null) {
  if (!salePrice || salePrice >= regularPrice) return null;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

