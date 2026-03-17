import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-28 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
              Admin
            </p>

            <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
              Dashboard
            </h1>
          </div>

          <AdminLogoutButton />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Link
            href="/admin/products"
            className="border border-black/10 bg-white p-6 transition hover:border-black"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-black/45">
              Products
            </p>
            <h2 className="mt-3 text-2xl font-medium">Manage products</h2>
          </Link>

          <Link
            href="/admin/products/new"
            className="border border-black/10 bg-white p-6 transition hover:border-black"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-black/45">
              Create
            </p>
            <h2 className="mt-3 text-2xl font-medium">Add new product</h2>
          </Link>
          <Link
            href="/admin/orders"
            className="border border-black/10 bg-white p-6 transition hover:border-black"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-black/45">
              Orders
            </p>
            <h2 className="mt-3 text-2xl font-medium">Wiew orders</h2>
          </Link>
          <Link
            href="/admin/contact"
            className="border border-black/10 bg-white p-6 transition hover:border-black"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-black/45">
              Messages
            </p>
            <h2 className="mt-3 text-2xl font-medium">Contact inbox</h2>
          </Link>
        </div>
      </div>
    </main>
  );
}
