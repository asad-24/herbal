export const MAX_PRODUCT_IMAGE_SIZE = 3 * 1024 * 1024;
export const PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const DEFAULT_PRODUCT_IMAGE = "linear-gradient(135deg,#f2f7e9,#cde0b8,#708c55)";

export function validateProductImage(file: Pick<File, "size" | "type">) {
  if (!PRODUCT_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a JPG, PNG, WebP, or GIF image.";
  }
  if (file.size === 0) return "This image is empty. Please choose another file.";
  if (file.size > MAX_PRODUCT_IMAGE_SIZE) return "Please choose an image smaller than 3 MB.";
  return null;
}

export function matchesImageType(bytes: Uint8Array, contentType: string) {
  const startsWith = (signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  switch (contentType) {
    case "image/jpeg": return startsWith([0xff, 0xd8, 0xff]);
    case "image/png": return startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/gif": return startsWith([0x47, 0x49, 0x46, 0x38]) && [0x37, 0x39].includes(bytes[4]) && bytes[5] === 0x61;
    case "image/webp": return startsWith([0x52, 0x49, 0x46, 0x46]) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
    default: return false;
  }
}

export function isPhotoSource(image: string) {
  return /^(https?:\/\/|\/(?!\/)|blob:|data:image\/(?:jpeg|png|webp|gif);base64,)/i.test(image);
}
