"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
};

type ProductGalleryClientProps = {
  productName: string;
  images: ProductImage[];
};

export default function ProductGalleryClient({
  productName,
  images,
}: ProductGalleryClientProps) {
  const [activeImageId, setActiveImageId] = useState<string | null>(
    images[0]?.id ?? null,
  );

  const activeImage = useMemo(() => {
    return (
      images.find((image) => image.id === activeImageId) ?? images[0] ?? null
    );
  }, [activeImageId, images]);

  if (!images.length) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e2db]" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e2db]">
        {activeImage ? (
          <Image
            key={activeImage.id}
            src={activeImage.url}
            alt={activeImage.alt || productName}
            fill
            priority
            className="object-cover"
          />
        ) : null}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {images.map((image) => {
            const isActive = image.id === activeImage?.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImageId(image.id)}
                className={`relative aspect-[0.9] overflow-hidden bg-[#e7e2db] transition ${
                  isActive
                    ? "ring-1 ring-black"
                    : "opacity-85 hover:opacity-100"
                }`}
                aria-label={`View image ${image.order + 1} of ${productName}`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || productName}
                  fill
                  className="object-cover"
                />

                <span
                  className={`pointer-events-none absolute inset-0 transition ${
                    isActive ? "bg-black/0" : "bg-black/8"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
