import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const [categories, product] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
        variants: {
          include: {
            options: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-28 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1000px]">
        <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
          Admin
        </p>

        <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
          Edit product
        </h1>

        <div className="mt-10">
          <ProductForm
            categories={categories}
            initialData={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              description: product.description,
              price: product.price,
              stock: product.stock,
              featured: product.featured,
              categoryId: product.categoryId,
              images: product.images.map((image) => ({
                url: image.url,
              })),
              variants: product.variants.map((variant) => ({
                name: variant.name,
                price: variant.price,
                stock: variant.stock,
                options: variant.options.map((option) => ({
                  name: option.name,
                  value: option.value,
                })),
              })),
            }}
          />
        </div>
      </div>
    </main>
  );
}
