import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductViewClient from "@/components/ProductViewClient";
import ScrollSection from "@/components/SmoothScroll";
import RelatedProductsSection from "@/components/RelatedProductsSection";

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
  compareAtPrice: number | null;
  stock: number;
  options: ProductOption[];
};

type ProductWithRelations = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  featured: boolean;
  badge: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  benefits: string[] | null;
  sizeGuideEnabled: boolean;
  sizeGuideTitle: string | null;
  sizeGuideContent: string | null;
  category: {
    name: string;
    slug: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
};

function getProductBenefits(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 6);
}

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
    product.seoDescription?.trim() ||
    product.shortDescription?.trim() ||
    product.description?.trim() ||
    `Shop ${product.name} at Petsaco. Explore premium pet products for everyday comfort, play and care.`;

  return {
    title: product.seoTitle?.trim() || `${product.name} | Petsaco`,
    description: cleanDescription,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: product.seoTitle?.trim() || `${product.name} | Petsaco`,
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
      title: product.seoTitle?.trim() || `${product.name} | Petsaco`,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
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
      reviews: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!product) {
    notFound();
  }

  const productBenefits = getProductBenefits(product.benefits);

  const relatedCandidates = await prisma.product.findMany({
    where: {
      NOT: {
        id: product.id,
      },

      AND: [
        {
          OR: [
            {
              tags: {
                some: {
                  id: {
                    in: product.tags.map((tag) => tag.id),
                  },
                },
              },
            },
            {
              categoryId: product.categoryId,
            },
          ],
        },

        {
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
      ],
    },

    include: {
      category: true,
      tags: true,
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

  const relatedProducts = relatedCandidates
    .map((item) => {
      const sharedTagCount = item.tags.filter((tag) =>
        product.tags.some((currentTag) => currentTag.id === tag.id),
      ).length;

      const sameCategory = item.category.id === product.category.id ? 1 : 0;

      return {
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.price,
        categoryName: item.category.name,
        imageUrl: item.images[0]?.url || "/placeholder.jpg",
        imageAlt: item.images[0]?.alt || item.name,
        inStock:
          item.stock > 0 || item.variants.some((variant) => variant.stock > 0),
        score: sharedTagCount * 2 + sameCategory,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ score, ...rest }) => rest);

  const productUrl = `https://petsaco.com/shop/${product.slug}`;
  const hasVariantInStock = product.variants.some(
    (variant) => variant.stock > 0,
  );
  const availability =
    product.stock > 0 || hasVariantInStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.seoDescription || product.shortDescription || product.description,
    image: product.images.map((image) => image.url),
    sku: product.id,
    category: product.category.name,
    brand: {
      "@type": "Brand",
      name: "Petsaco",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: (product.price / 100).toFixed(2),
      availability,
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating:
      product.reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (
              product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              product.reviews.length
            ).toFixed(1),
            reviewCount: product.reviews.length,
          }
        : undefined,
  };

  return (
    <ScrollSection>
      <main className="min-h-screen bg-[#dddad5] text-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-12 lg:pt-28">
          <section className="border-b border-black/10 pb-6 lg:hidden">
            <div className="mt-3 grid gap-5 sm:mt-0">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-black/45">
                  {product.category.name}
                </p>

                {product.badge ? (
                  <p className="mt-3 inline-flex  text-[10px] uppercase tracking-[0.2em] text-black/70">
                    {product.badge}
                  </p>
                ) : null}

                <h1
                  style={{ fontFamily: "Mango" }}
                  className="mt-3 text-[clamp(2.2rem,11vw,4.25rem)] uppercase leading-[0.9] tracking-[-0.001em]"
                >
                  {product.name}
                </h1>

                {product.shortDescription ? (
                  <p className="mt-4 max-w-[62ch] text-sm leading-6 text-black/65">
                    {product.shortDescription}
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-black/10 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                    Price
                  </p>
                  <p className="mt-2 text-base leading-none tracking-[-0.03em]">
                    ${(product.price / 100).toFixed(2)}
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

                {product.badge ? (
                  <p className="mt-5 inline-flex border border-black/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-black/70">
                    {product.badge}
                  </p>
                ) : null}

                <h1
                  style={{ fontFamily: "Mango" }}
                  className="mt-5 text-[clamp(3rem,8vw,8rem)] uppercase leading-[0.88] tracking-[-0.02em]"
                >
                  {product.name}
                </h1>

                <p className="mt-6 max-w-[620px] text-[15px] leading-7 text-black/62 md:text-base">
                  {product.shortDescription ||
                    "Thoughtfully selected essentials for modern pet living, designed to feel functional, refined and easy to live with every day."}
                </p>

                {productBenefits.length > 0 ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {productBenefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="border border-black/12 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-black/72"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                ) : null}
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

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                      Shipping
                    </p>
                    <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                      Fast
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
                shortDescription: product.shortDescription,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                stock: product.stock,
                badge: product.badge,
                categoryName: product.category.name,
                benefits: productBenefits,
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
                  compareAtPrice: variant.compareAtPrice,
                  stock: variant.stock,
                  options: variant.options.map((option) => ({
                    id: option.id,
                    name: option.name,
                    value: option.value,
                  })),
                })),
                reviews: product.reviews.map((review) => ({
                  id: review.id,
                  authorName: review.authorName,
                  authorCountry: review.authorCountry,
                  rating: review.rating,
                  title: review.title,
                  content: review.content,
                  imageUrl: review.imageUrl,
                  verified: review.verified,
                  source: review.source,
                  reviewDate: review.reviewDate
                    ? review.reviewDate.toISOString()
                    : null,
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
