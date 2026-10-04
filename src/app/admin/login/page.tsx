export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-950 px-4">
      <form
        action="/api/admin/login"
        method="POST"
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Admin panel</p>
        <h1 className="mt-2 text-3xl font-black">Sign in</h1>
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
        {hasError ? (
          <p className="mt-4 text-sm font-semibold text-red-700">
            Invalid login details. Make sure Vercel has the same MongoDB URI and the database is seeded.
          </p>
        ) : null}
        <button className="btn-primary mt-6 w-full">Sign in</button>
      </form>
    </main>
  );
}
