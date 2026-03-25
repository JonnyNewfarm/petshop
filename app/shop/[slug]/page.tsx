import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductViewClient from "@/components/ProductViewClient";
import ScrollSection from "@/components/SmoothScroll";
import RelatedProductsSection from "@/components/RelatedProductsSection";
import { formatPrice } from "@/lib/format";

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
  sizeGuideEnabled: boolean;
  sizeGuideTitle: string | null;
  sizeGuideContent: string | null;
  category: {
    name: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productUrl = `https://petsaco.com/product/${product.slug}`;
  const imageUrl = product.images[0]?.url || "/placeholder.jpg";

  const cleanDescription =
    product.description?.trim() ||
    `Shop ${product.name} at Petsaco. Explore premium pet products for everyday comfort, play and care.`;

  return {
    title: `${product.name} | Petsaco`,
    description: cleanDescription,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Petsaco`,
      description: cleanDescription,
      url: productUrl,
      siteName: "Petsaco",
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: product.images[0]?.alt || product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Petsaco`,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

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

  const relatedCandidates = await prisma.product.findMany({
    where: {
      category: {
        name: product.category.name,
      },
      NOT: {
        id: product.id,
      },
      OR: [
        {
          stock: {
            gt: 0,
          },
        },
        {
          variants: {
            some: {
              stock: {
                gt: 0,
              },
            },
          },
        },
      ],
    },
    include: {
      category: true,
      images: {
        orderBy: {
          order: "asc",
        },
        take: 1,
      },
      variants: {
        select: {
          stock: true,
        },
      },
    },
    take: 12,
  });

  const relatedProducts = [...relatedCandidates]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      categoryName: item.category.name,
      imageUrl: item.images[0]?.url || "/placeholder.jpg",
      imageAlt: item.images[0]?.alt || item.name,
      inStock:
        item.stock > 0 || item.variants.some((variant) => variant.stock > 0),
    }));

  return (
    <ScrollSection>
      <main className="min-h-screen bg-[#dddad5] text-black">
        <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-12 lg:pt-28">
          <section className="border-b border-black/10 pb-6 lg:hidden">
            <div className="grid gap-5 mt-3 sm:mt-0">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-black/45">
                  {product.category.name}
                </p>

                <h1
                  style={{ fontFamily: "Mango" }}
                  className="mt-3 text-[clamp(2.2rem,11vw,4.25rem)] uppercase leading-[0.9] tracking-[-0.03em]"
                >
                  {product.name}
                </h1>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-black/10 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                    Price
                  </p>
                  <p className="mt-2 text-base leading-none tracking-[-0.03em]">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                    Images
                  </p>
                  <p className="mt-2 text-base leading-none tracking-[-0.03em]">
                    {product.images.length}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                    Category
                  </p>
                  <p className="mt-2 text-base leading-none tracking-[-0.03em]">
                    {product.category.name}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="hidden border-b border-black/10 pb-12 lg:block lg:pb-16">
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

          <section className="pt-6 sm:pt-8 lg:pt-12">
            <ProductViewClient
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                categoryName: product.category.name,
                sizeGuideEnabled: product.sizeGuideEnabled,
                sizeGuideTitle: product.sizeGuideTitle,
                sizeGuideContent: product.sizeGuideContent,
                images: product.images.map((image) => ({
                  id: image.id,
                  url: image.url,
                  alt: image.alt,
                  order: image.order,
                })),
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
          </section>

          {relatedProducts.length > 0 ? (
            <RelatedProductsSection
              title="You may also like"
              products={relatedProducts}
            />
          ) : null}
        </div>
      </main>
    </ScrollSection>
  );
}
