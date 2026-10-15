import { isPhotoSource } from "@/lib/product-images";

export function ProductImage({
  image,
  name,
  className = "",
}: {
  image: string;
  name: string;
  className?: string;
}) {
  if (isPhotoSource(image)) {
    return (
      <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-stone-50 ${className}`}>
        {/* Native images also support external URLs without a Next.js host allowlist. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} className="absolute inset-0 h-full w-full object-contain" />
      </div>
    );
  }
  return (
    <div
      className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md ${className}`}
      style={{ background: image || "linear-gradient(135deg,#f4f7ec,#bfd2a1)" }}
      aria-label={name}
      role="img"
    >
      <div className="absolute inset-5 rounded-full border border-white/35" />
      <div className="absolute bottom-5 left-5 right-5 h-10 rounded-full bg-white/25 blur-xl" />
      <span className="relative max-w-[12rem] text-center text-lg font-semibold text-white drop-shadow">
        {name}
      </span>
    </div>
  );
}
