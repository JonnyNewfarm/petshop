import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { deleteProduct } from "@/actions/product-actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: {
        orderBy: {
          order: "asc",
        },
      },
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-28 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
              Admin
            </p>
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
              Products
            </h1>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center border border-black bg-black px-6 py-4 text-sm uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
          >
            Add product
          </Link>
        </div>

        <div className="mt-10 overflow-x-auto border border-black/10 bg-white">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-left text-[11px] uppercase tracking-[0.18em] text-black/50">
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Stock</th>
                <th className="px-4 py-4">Variants</th>
                <th className="px-4 py-4">Featured</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-black/10 align-top"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="mt-1 text-sm text-black/45">
                        {product.slug}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm">{product.category.name}</td>
                  <td className="px-4 py-4 text-sm">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-4 text-sm">{product.stock}</td>
                  <td className="px-4 py-4 text-sm">
                    {product.variants.length}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {product.featured ? "Yes" : "No"}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="text-sm uppercase tracking-[0.14em] text-black/55 transition hover:text-black"
                      >
                        View
                      </Link>

                      <form
                        action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-sm uppercase tracking-[0.14em] text-black/55 transition hover:text-black"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm uppercase tracking-[0.18em] text-black/45"
                  >
                    No products yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
