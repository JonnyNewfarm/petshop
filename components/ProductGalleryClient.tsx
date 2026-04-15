"use client";

import Image from "next/image";
import { useMemo } from "react";

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
};

type ProductGalleryClientProps = {
  productName: string;
  images: ProductImage[];
  activeImageId: string | null;
  onImageChange: (imageId: string) => void;
};

function isVideoUrl(url: string) {
  const cleanUrl = url.split("?")[0].toLowerCase();
  return (
    cleanUrl.endsWith(".mp4") ||
    cleanUrl.endsWith(".webm") ||
    cleanUrl.endsWith(".mov") ||
    cleanUrl.endsWith(".ogg")
  );
}

export default function ProductGalleryClient({
  productName,
  images,
  activeImageId,
  onImageChange,
}: ProductGalleryClientProps) {
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => a.order - b.order);
  }, [images]);

  const activeImage =
    sortedImages.find((image) => image.id === activeImageId) ??
    sortedImages[0] ??
    null;

  if (!activeImage) {
    return <div className="aspect-[0.9] border border-black/10 bg-[#e7e2db]" />;
  }

  const activeIsVideo = isVideoUrl(activeImage.url);

  return (
    <div className="min-w-0">
      <div className="relative aspect-[0.9] overflow-hidden border border-black/10 bg-[#e7e2db]">
        {activeIsVideo ? (
          <video
            key={activeImage.url}
            src={activeImage.url}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
          />
        ) : (
          <Image
            src={activeImage.url}
            alt={activeImage.alt || productName}
            fill
            className="object-cover"
            priority
            quality={100}
          />
        )}
      </div>

      {sortedImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {sortedImages.map((image) => {
            const isActive = image.id === activeImage.id;
            const isVideo = isVideoUrl(image.url);

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => onImageChange(image.id)}
                className={`relative aspect-square overflow-hidden border transition ${
                  isActive
                    ? "border-black"
                    : "border-black/10 hover:border-black/40"
                }`}
              >
                {isVideo ? (
                  <>
                    <video
                      src={image.url}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white">
                        ▶
                      </div>
                    </div>
                  </>
                ) : (
                  <Image
                    src={image.url}
                    alt={image.alt || productName}
                    fill
                    className="object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
