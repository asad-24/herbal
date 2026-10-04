import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { setAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    redirect("/admin/login?error=1");
  }

  await setAdminSession(admin.id);
  redirect("/admin");
}

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-950 px-4">
      <form action={login} className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Admin panel</p>
        <h1 className="mt-2 text-3xl font-black">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Seed login: admin@herbal.local / Admin123!
        </p>
        <div className="mt-6 grid gap-4">
          <label>
            <span className="admin-label">Email</span>
            <input name="email" type="email" required className="admin-input" defaultValue="admin@herbal.local" />
          </label>
          <label>
            <span className="admin-label">Password</span>
            <input name="password" type="password" required className="admin-input" defaultValue="Admin123!" />
          </label>
        </div>
        {hasError ? <p className="mt-4 text-sm font-semibold text-red-700">Invalid login details.</p> : null}
        <button className="btn-primary mt-6 w-full">Sign in</button>
      </form>
    </main>
  );
}
