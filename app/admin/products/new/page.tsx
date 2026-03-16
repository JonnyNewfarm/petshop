import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewAdminProductPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
    }),
  ]);
  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-28 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1000px]">
        <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
          Admin
        </p>

        <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
          Add product
        </h1>

        <div className="mt-10">
          <ProductForm tags={tags} categories={categories} />
        </div>
      </div>
    </main>
  );
}
