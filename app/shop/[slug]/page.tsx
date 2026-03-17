import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailsClient from "@/components/ProductDetailClient";
import ProductGalleryClient from "@/components/ProductGalleryClient";
import ScrollSection from "@/components/SmoothScroll";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
};

type ProductOption = {
  id: string;
  name: string;
  value: string;
};

type ProductVariant = {
  id: string;
  name: string;
  price: number | null;
  stock: number;
  options: ProductOption[];
};

type ProductWithRelations = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    name: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product: ProductWithRelations | null = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
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
  });

  if (!product) {
    notFound();
  }

  return (
    <ScrollSection>
      <main className="min-h-screen bg-[#dddad5] text-black">
        <div className="mx-auto max-w-[1600px] px-6 pb-20 pt-28 sm:px-8 lg:px-12">
          <section className="border-b border-black/10 pb-12 lg:pb-16">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
              <div className="max-w-[980px]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                  Product
                </p>

                <h1
                  style={{ fontFamily: "Mango" }}
                  className="mt-5 text-[clamp(3rem,8vw,8rem)] uppercase leading-[0.88] tracking-[-0.02em]"
                >
                  {product.name}
                </h1>

                <p className="mt-6 max-w-[620px] text-[15px] leading-7 text-black/62 md:text-base">
                  Thoughtfully selected essentials for modern pet living,
                  designed to feel functional, refined and easy to live with
                  every day.
                </p>
              </div>

              <div className="flex flex-col justify-end">
                <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-black/10 pt-6 sm:grid-cols-3 lg:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                      Category
                    </p>
                    <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                      {product.category.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                      Images
                    </p>
                    <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                      {product.images.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                      Selection
                    </p>
                    <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                      2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1.1fr)_480px] lg:gap-16 lg:pt-12">
            <div className="min-w-0">
              <ProductGalleryClient
                productName={product.name}
                images={product.images}
              />
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductDetailsClient
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  stock: product.stock,
                  imageUrl: product.images[0]?.url ?? "/placeholder.jpg",
                  categoryName: product.category.name,
                  variants: product.variants.map((variant) => ({
                    id: variant.id,
                    name: variant.name,
                    price: variant.price,
                    stock: variant.stock,
                    options: variant.options.map((option) => ({
                      id: option.id,
                      name: option.name,
                      value: option.value,
                    })),
                  })),
                }}
              />
            </div>
          </section>
        </div>
      </main>
    </ScrollSection>
  );
}
