"use client";

import { useCallback, useMemo, useState } from "react";
import ProductDetailsClient from "@/components/ProductDetailClient";
import ProductGalleryClient from "@/components/ProductGalleryClient";

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

type ProductReview = {
  id: string;
  authorName: string;
  authorCountry: string | null;
  rating: number;
  title: string | null;
  content: string;
  imageUrl: string | null;
  verified: boolean;
  source: string | null;
  reviewDate: string | null;
};

type SelectedOptions = Record<string, string>;

type ProductViewClientProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    shortDescription: string | null;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    badge: string | null;
    categoryName: string;
    benefits: string[];
    sizeGuideEnabled: boolean;
    sizeGuideTitle: string | null;
    sizeGuideContent: string | null;
    images: ProductImage[];
    variants: ProductVariant[];
    reviews: ProductReview[];
  };
  onReviewsModalChange?: (open: boolean) => void;
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
}

function getMatchTokens(value: string) {
  const normalized = normalize(value);

  if (!normalized) return [];

  const slashParts = normalized.split("/").filter(Boolean);
  const parts = slashParts.length > 0 ? slashParts : [normalized];

  const expanded = parts.flatMap((part) => {
    const subParts = part.split("-").filter(Boolean);
    return subParts.length > 0 ? [part, ...subParts] : [part];
  });

  return Array.from(new Set(expanded));
}

export default function ProductViewClient({ product }: ProductViewClientProps) {
  const sortedImages = useMemo(() => {
    return [...product.images].sort((a, b) => a.order - b.order);
  }, [product.images]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [activeImageId, setActiveImageId] = useState<string | null>(
    sortedImages[0]?.id ?? null,
  );

  const displayedImageUrl =
    sortedImages.find((image) => image.id === activeImageId)?.url ??
    sortedImages[0]?.url ??
    "/placeholder.jpg";

  const handleVariantChange = useCallback((variantId: string | null) => {
    setSelectedVariantId(variantId);
  }, []);

  const handleOptionsChange = useCallback(
    (selectedOptions: SelectedOptions) => {
      const optionValues = Object.values(selectedOptions).filter(Boolean);

      if (optionValues.length === 0) return;

      const tokenGroups = optionValues
        .map((value) => getMatchTokens(value))
        .filter((tokens) => tokens.length > 0);

      if (tokenGroups.length === 0) return;

      const exactMatch = sortedImages.find((image) => {
        const haystack = `${image.url} ${image.alt ?? ""}`.toLowerCase();

        return tokenGroups.every((group) =>
          group.some((token) => haystack.includes(token)),
        );
      });

      if (exactMatch) {
        setActiveImageId(exactMatch.id);
        return;
      }

      const bestMatch = sortedImages
        .map((image) => {
          const haystack = `${image.url} ${image.alt ?? ""}`.toLowerCase();

          const score = tokenGroups.reduce((total, group) => {
            return group.some((token) => haystack.includes(token))
              ? total + 1
              : total;
          }, 0);

          return { image, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)[0];

      if (bestMatch) {
        setActiveImageId(bestMatch.image.id);
      }
    },
    [sortedImages],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_460px] lg:gap-12 xl:grid-cols-[minmax(0,1.12fr)_500px] xl:gap-16">
      <div className="min-w-0">
        <ProductGalleryClient
          productName={product.name}
          images={sortedImages}
          activeImageId={activeImageId}
          onImageChange={setActiveImageId}
        />
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ProductDetailsClient
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            description: product.description,
            shortDescription: product.shortDescription,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            stock: product.stock,
            imageUrl: displayedImageUrl,
            badge: product.badge,
            categoryName: product.categoryName,
            benefits: product.benefits,
            sizeGuideEnabled: product.sizeGuideEnabled,
            sizeGuideTitle: product.sizeGuideTitle,
            sizeGuideContent: product.sizeGuideContent,
            variants: product.variants,
            reviews: product.reviews,
          }}
          selectedVariantId={selectedVariantId}
          onVariantChange={handleVariantChange}
          onOptionsChange={handleOptionsChange}
        />
      </div>
    </div>
  );
}
