import Link from "next/link";
import { redirect } from "next/navigation";
import { clearAdminSession } from "@/lib/admin-auth";

const links = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Categories", "/admin/categories"],
  ["Orders", "/admin/orders"],
  ["Certificates", "/admin/certificates"],
  ["Settings", "/admin/settings"],
];

export function AdminNav() {
  async function logout() {
    "use server";
    await clearAdminSession();
    redirect("/admin/login");
  }

  return (
    <aside className="border-b border-stone-200 bg-white p-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <Link href="/admin" className="text-xl font-black text-emerald-950">
        Store Admin
      </Link>
      <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-900"
          >
            {label}
          </Link>
        ))}
      </nav>
      <form action={logout} className="mt-6">
        <button className="rounded-md border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50">
          Sign out
        </button>
      </form>
    </aside>
  );
}
