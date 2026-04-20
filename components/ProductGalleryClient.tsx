"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => a.order - b.order);
  }, [images]);

  const activeIndex = Math.max(
    0,
    sortedImages.findIndex((image) => image.id === activeImageId),
  );

  const activeImage = sortedImages[activeIndex] ?? null;
  const activeIsVideo = activeImage ? isVideoUrl(activeImage.url) : false;

  function goToPrev() {
    if (!sortedImages.length) return;
    const prevIndex =
      (activeIndex - 1 + sortedImages.length) % sortedImages.length;
    onImageChange(sortedImages[prevIndex].id);
  }

  function goToNext() {
    if (!sortedImages.length) return;
    const nextIndex = (activeIndex + 1) % sortedImages.length;
    onImageChange(sortedImages[nextIndex].id);
  }

  useEffect(() => {
    if (!isFullscreenOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFullscreenOpen(false);
        return;
      }

      if (!sortedImages.length) return;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = (activeIndex + 1) % sortedImages.length;
        onImageChange(sortedImages[nextIndex].id);
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const prevIndex =
          (activeIndex - 1 + sortedImages.length) % sortedImages.length;
        onImageChange(sortedImages[prevIndex].id);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreenOpen, activeIndex, sortedImages, onImageChange]);

  if (!activeImage) {
    return (
      <div className="aspect-[0.95] border border-black/10 bg-[#e7e2db]" />
    );
  }

  return (
    <>
      <div className="min-w-0">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[78px_minmax(0,1fr)] lg:gap-6">
          {sortedImages.length > 1 && (
            <div className="order-2 lg:order-1">
              {/* Desktop thumbnails */}
              <div className="hidden lg:block">
                <div
                  style={{ scrollbarWidth: "none" }}
                  className="max-h-[760px] overflow-y-auto  pr-2"
                >
                  <div className="flex flex-col gap-3">
                    {sortedImages.map((image) => {
                      const isActive = image.id === activeImage.id;
                      const isVideo = isVideoUrl(image.url);

                      return (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => onImageChange(image.id)}
                          className={`group relative aspect-square w-[78px] shrink-0 overflow-hidden border bg-[#e7e2db] transition ${
                            isActive
                              ? "border-black"
                              : "border-black/10 hover:border-black/40"
                          }`}
                          aria-label={`Select ${image.alt || productName} media`}
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
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-xs text-white">
                                  ▶
                                </div>
                              </div>
                            </>
                          ) : (
                            <Image
                              src={image.url}
                              alt={image.alt || productName}
                              fill
                              className="cursor-pointer object-cover transition duration-500 group-hover:scale-[1.03]"
                              sizes="78px"
                              quality={100}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="order-1 lg:order-2">
            <div className="mx-auto w-full max-w-[760px] lg:mx-0">
              <button
                type="button"
                onClick={() => setIsFullscreenOpen(true)}
                className="group block w-full text-left"
                aria-label="Open product media fullscreen"
              >
                <div className="relative aspect-[0.95] overflow-hidden border border-black/10 bg-[#e7e2db] lg:aspect-[1/1.04]">
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
                      className="cursor-pointer object-cover"
                      priority
                      quality={100}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 58vw, 760px"
                    />
                  )}

                  <div className="pointer-events-none absolute right-4 top-4 border border-black/10 bg-[#f6f1e8]/90 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-black opacity-0 transition duration-300 group-hover:opacity-100">
                    View
                  </div>
                </div>
              </button>

              {/* Mobile thumbnails */}
              {sortedImages.length > 1 && (
                <div
                  style={{ scrollbarWidth: "none" }}
                  className="mt-4 overflow-x-auto"
                >
                  <div className="flex gap-3 pb-1 lg:hidden">
                    {sortedImages.map((image) => {
                      const isActive = image.id === activeImage.id;
                      const isVideo = isVideoUrl(image.url);

                      return (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => onImageChange(image.id)}
                          className={`group relative aspect-square h-[84px] w-[84px] shrink-0 overflow-hidden border bg-[#e7e2db] transition ${
                            isActive
                              ? "border-black"
                              : "border-black/10 hover:border-black/40"
                          }`}
                          aria-label={`Select ${image.alt || productName} media`}
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
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-xs text-white">
                                  ▶
                                </div>
                              </div>
                            </>
                          ) : (
                            <Image
                              src={image.url}
                              alt={image.alt || productName}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-[1.03]"
                              sizes="84px"
                              quality={100}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFullscreenOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/92 px-4 py-4 md:px-8 md:py-8"
          onClick={() => setIsFullscreenOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreenOpen(false);
            }}
            className="absolute right-4 top-4 z-20 cursor-pointer border border-white/15 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white transition hover:border-white/35"
            aria-label="Close fullscreen"
          >
            Close
          </button>

          {sortedImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-white/15 bg-black/30 text-white transition hover:border-white/35"
                aria-label="Previous media"
              >
                ←
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-white/15 bg-black/30 text-white transition hover:border-white/35"
                aria-label="Next media"
              >
                →
              </button>
            </>
          )}

          <div className="flex h-full w-full items-center justify-center">
            <div
              className="relative h-full w-full max-w-[1300px]"
              onClick={(e) => e.stopPropagation()}
            >
              {activeIsVideo ? (
                <video
                  key={activeImage.url}
                  src={activeImage.url}
                  className="h-full w-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt || productName}
                  fill
                  className="object-contain"
                  quality={100}
                  sizes="100vw"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
