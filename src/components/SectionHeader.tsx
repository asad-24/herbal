import Link from "next/link";

export function SectionHeader({
  eyebrow,
  title,
  href,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">{title}</h2>
      </div>
      {href ? (
        <Link href={href} className="text-sm font-bold text-emerald-800 hover:text-emerald-600">
          View all
        </Link>
      ) : null}
    </div>
  );
}

