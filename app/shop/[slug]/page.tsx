import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailsClient from "@/components/ProductDetailClient";

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

  const mainImage = product.images[0];

  return (
    <main className="min-h-screen bg-[#dddad5] px-6 py-28 text-black sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden border border-black/10 bg-[#f3efe8]">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt || product.name}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden border border-black/10 bg-[#f3efe8]"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

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
    </main>
  );
}
