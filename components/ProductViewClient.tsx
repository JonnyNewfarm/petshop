"use client";

import { useMemo, useState } from "react";
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
  stock: number;
  options: ProductOption[];
};

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
  };
};

function normalize(value: string) {
  return value.trim().toLowerCase();
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

  function handleVariantChange(variantId: string | null) {
    setSelectedVariantId(variantId);
  }

  function handleColorChange(colorValue: string | null) {
    if (!colorValue) return;

    const selectedColor = normalize(colorValue);

    const matchedImage = sortedImages.find((image) => {
      const haystack = `${image.url} ${image.alt ?? ""}`.toLowerCase();
      return haystack.includes(selectedColor);
    });

    if (matchedImage) {
      setActiveImageId(matchedImage.id);
    }
  }

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
          }}
          selectedVariantId={selectedVariantId}
          onVariantChange={handleVariantChange}
          onColorChange={handleColorChange}
        />
      </div>
    </div>
  );
}
