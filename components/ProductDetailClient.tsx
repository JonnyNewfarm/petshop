"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import { useSmoothScroller } from "@/components/SmoothScroll";
import { AnimatePresence, motion } from "framer-motion";

type VariantOption = {
  id: string;
  name: string;
  value: string;
};

type Variant = {
  id: string;
  name: string;
  price: number | null;
  stock: number;
  compareAtPrice: number | null;
  options: VariantOption[];
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

type ProductDetailsClientProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    shortDescription: string | null;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    imageUrl: string;
    badge: string | null;
    categoryName: string;
    benefits: string[];
    sizeGuideEnabled: boolean;
    sizeGuideTitle: string | null;
    sizeGuideContent: string | null;
    variants: Variant[];
    reviews: ProductReview[];
  };
  selectedVariantId: string | null;
  onVariantChange: (variantId: string | null) => void;
  onColorChange: (colorValue: string | null) => void;
};

type SelectedOptions = Record<string, string>;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function isColorOption(name: string) {
  const normalized = normalize(name);
  return normalized === "color" || normalized === "colour";
}

function variantMatchesOptions(
  variant: Variant,
  selectedOptions: SelectedOptions,
) {
  return Object.entries(selectedOptions).every(([optionName, optionValue]) =>
    variant.options.some(
      (option) => option.name === optionName && option.value === optionValue,
    ),
  );
}

function renderStars(rating: number) {
  const safeRating = Math.max(0, Math.min(5, rating));
  return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
}

function formatReviewDate(dateString: string | null) {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function ProductDetailsClient({
  product,
  selectedVariantId,
  onVariantChange,
  onColorChange,
}: ProductDetailsClientProps) {
  const hasVariants = product.variants.length > 0;
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const { stop, start } = useSmoothScroller();

  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedReviewImage, setSelectedReviewImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);

  const groupedOptions = useMemo(() => {
    if (!hasVariants) return [];

    const optionMap = new Map<string, string[]>();

    for (const variant of product.variants) {
      for (const option of variant.options) {
        const existingValues = optionMap.get(option.name) ?? [];
        if (!existingValues.includes(option.value)) {
          existingValues.push(option.value);
        }
        optionMap.set(option.name, existingValues);
      }
    }

    return Array.from(optionMap.entries()).map(([name, values]) => ({
      name,
      values,
    }));
  }, [hasVariants, product.variants]);

  const paragraphs = product.description.split(/\n+/).filter(Boolean);

  const visibleParagraphs = showFullDescription
    ? paragraphs
    : paragraphs.slice(0, 2);

  const isExactSelectionComplete = useMemo(() => {
    if (!hasVariants) return true;
    return groupedOptions.every((group) => !!selectedOptions[group.name]);
  }, [groupedOptions, hasVariants, selectedOptions]);

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    if (!isExactSelectionComplete) return null;

    return (
      product.variants.find((variant) =>
        groupedOptions.every((group) => {
          const selectedValue = selectedOptions[group.name];

          return variant.options.some(
            (option) =>
              option.name === group.name && option.value === selectedValue,
          );
        }),
      ) ?? null
    );
  }, [
    groupedOptions,
    hasVariants,
    isExactSelectionComplete,
    product.variants,
    selectedOptions,
  ]);

  const displayPrice = selectedVariant?.price ?? product.price;
  const displayCompareAtPrice =
    selectedVariant?.compareAtPrice ?? product.compareAtPrice;

  const hasAnyVariantInStock = hasVariants
    ? product.variants.some((variant) => variant.stock > 0)
    : false;

  const availabilityLabel = hasVariants
    ? selectedVariant
      ? selectedVariant.stock > 0
        ? "In stock"
        : "Out of stock"
      : hasAnyVariantInStock
        ? "In stock"
        : "Out of stock"
    : product.stock > 0
      ? "In stock"
      : "Out of stock";

  const isSelectedVariantOutOfStock =
    hasVariants && selectedVariant ? selectedVariant.stock <= 0 : false;

  const isSimpleProductOutOfStock = !hasVariants && product.stock <= 0;

  const needsOptionSelection =
    hasVariants && (!isExactSelectionComplete || !selectedVariant);

  const isOutOfStock = hasVariants
    ? isSelectedVariantOutOfStock
    : isSimpleProductOutOfStock;

  const isAddToCartDisabled = needsOptionSelection || isOutOfStock;

  const reviewCount = product.reviews.length;

  const averageRating =
    reviewCount > 0
      ? (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount
        ).toFixed(1)
      : null;

  const featuredReview = product.reviews[0] ?? null;

  useEffect(() => {
    setHasAddedToCart(false);
  }, [product.id, selectedVariantId, selectedVariant?.id]);

  useEffect(() => {
    setShowReviewsModal(false);
    setSelectedReviewImage(null);
  }, [product.id]);

  useEffect(() => {
    const isLocked = showReviewsModal || !!selectedReviewImage;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    if (isLocked) {
      stop();
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      start();
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      start();
    };
  }, [showReviewsModal, selectedReviewImage, stop, start]);

  useEffect(() => {
    if (!hasVariants || groupedOptions.length === 0) return;
    if (Object.keys(selectedOptions).length > 0) return;

    const firstAvailableVariant =
      product.variants.find((variant) => variant.stock > 0) ??
      product.variants[0];

    if (!firstAvailableVariant) return;

    const initialOptions: SelectedOptions = {};
    for (const option of firstAvailableVariant.options) {
      initialOptions[option.name] = option.value;
    }

    setSelectedOptions(initialOptions);
    onVariantChange(firstAvailableVariant.id);
  }, [
    groupedOptions,
    hasVariants,
    onVariantChange,
    product.variants,
    selectedOptions,
  ]);

  const handleScrollToOptions = () => {
    if (!optionsRef.current) return;

    const yOffset = -80;
    const y =
      optionsRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const desktopButtonLabel =
    hasAddedToCart && !needsOptionSelection && !isOutOfStock
      ? "Continue to cart"
      : "Add to cart";

  const mobileButtonLabel = needsOptionSelection
    ? "Choose options"
    : hasAddedToCart && !isOutOfStock
      ? "Continue to cart"
      : "Add to cart";

  const handleAddToCartSuccess = () => {
    setHasAddedToCart(true);
  };

  const heroDescription = product.shortDescription?.trim() || "";

  return (
    <>
      <div className="border border-black/10 bg-[#e6e2dc]">
        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-black/45 sm:text-[11px]">
                {product.categoryName}
              </p>

              <h2
                style={{ fontFamily: "Mango" }}
                className="mt-3 text-[clamp(1.8rem,8vw,4.8rem)] uppercase leading-[0.92] tracking-[-0.03em] sm:mt-4 sm:tracking-[-0.02em]"
              >
                {product.name}
              </h2>

              {heroDescription ? (
                <p className="mt-3 max-w-[52ch] text-[14px] leading-6 text-black/62 sm:text-[15px] sm:leading-7">
                  {heroDescription}
                </p>
              ) : null}

              {reviewCount > 0 && averageRating ? (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="text-sm tracking-[0.02em] text-black/80">
                    <span className="mr-2">
                      {renderStars(Math.round(Number(averageRating)))}
                    </span>
                    {averageRating} / 5
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-black/45">
                    {reviewCount} review{reviewCount === 1 ? "" : "s"}
                  </p>
                </div>
              ) : null}
            </div>

            {product.badge ? (
              <p className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-black/55">
                {product.badge}
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex items-end justify-between gap-6 border-t border-black/10 pt-4 sm:mt-6 sm:pt-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                Price
              </p>

              <div className="mt-2 flex flex-wrap items-end gap-3">
                <p className="text-[1.55rem] leading-none tracking-[-0.05em] sm:text-[1.9rem]">
                  {formatPrice(displayPrice)}
                </p>

                {displayCompareAtPrice &&
                displayCompareAtPrice > displayPrice ? (
                  <p className="text-base leading-none text-black/35 line-through sm:text-lg">
                    {formatPrice(displayCompareAtPrice)}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                Availability
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-black/70 sm:text-sm">
                {availabilityLabel}
              </p>
            </div>
          </div>

          {hasVariants ? (
            <div
              ref={optionsRef}
              className="mt-5 border-t border-black/10 pt-5 sm:mt-6 sm:pt-6"
            >
              <div className="space-y-5 sm:space-y-6">
                {groupedOptions.map((group) => (
                  <div key={group.name}>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-black/45 sm:text-[11px]">
                      {group.name}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {group.values.map((value) => {
                        const nextSelectedOptions = {
                          ...selectedOptions,
                          [group.name]: value,
                        };

                        const matchingVariant = product.variants.find(
                          (variant) =>
                            variantMatchesOptions(variant, nextSelectedOptions),
                        );

                        const isActive = selectedOptions[group.name] === value;
                        const exists = !!matchingVariant;
                        const outOfStock = matchingVariant
                          ? matchingVariant.stock <= 0
                          : true;

                        return (
                          <button
                            key={`${group.name}-${value}`}
                            type="button"
                            onClick={() => {
                              if (!exists) return;

                              const updatedOptions = {
                                ...selectedOptions,
                                [group.name]: value,
                              };

                              setSelectedOptions(updatedOptions);
                              setHasAddedToCart(false);

                              if (isColorOption(group.name)) {
                                onColorChange(value);
                              }

                              const isComplete = groupedOptions.every(
                                (optionGroup) =>
                                  !!updatedOptions[optionGroup.name],
                              );

                              if (!isComplete) {
                                onVariantChange(null);
                                return;
                              }

                              const exactVariant =
                                product.variants.find((variant) =>
                                  groupedOptions.every((optionGroup) => {
                                    const selectedValue =
                                      updatedOptions[optionGroup.name];

                                    return variant.options.some(
                                      (option) =>
                                        option.name === optionGroup.name &&
                                        option.value === selectedValue,
                                    );
                                  }),
                                ) ?? null;

                              onVariantChange(exactVariant?.id ?? null);
                            }}
                            disabled={!exists}
                            className={`min-h-[44px] px-3 py-2.5 text-[10px] uppercase tracking-[0.18em] transition sm:px-4 sm:py-3 sm:text-[11px] ${
                              isActive
                                ? "bg-black text-[#f6f1e8]"
                                : "bg-[#f3efe8] text-black hover:bg-black hover:text-[#f6f1e8]"
                            } ${!exists ? "cursor-not-allowed opacity-30" : ""}`}
                          >
                            {value}
                            {exists && outOfStock ? (
                              <span className="ml-2 text-[10px] opacity-70">
                                • Out
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-black/10 pt-4 sm:mt-6 sm:pt-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-black/45 sm:text-[11px]">
                  Selected
                </p>
                <p className="mt-2 text-sm uppercase tracking-[-0.02em] text-black sm:text-base">
                  {selectedVariant?.name ?? "Choose your options"}
                </p>

                {!isExactSelectionComplete ? (
                  <p className="mt-2 text-sm text-black/55">
                    Please choose all options.
                  </p>
                ) : null}

                {isSelectedVariantOutOfStock ? (
                  <p className="mt-2 text-sm text-red-600">
                    This variant is currently out of stock.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-5 border-t border-black/10 pt-5 sm:mt-6 sm:pt-6">
            <div className="flex flex-col gap-3">
              <div className="border border-black/20 bg-[#f3efe8] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-black">
                  Free shipping ends April 19 — limited time
                </p>
              </div>

              <AddToCartButton
                productId={product.id}
                variantId={selectedVariant?.id ?? null}
                variantName={selectedVariant?.name ?? null}
                variantOptions={selectedVariant?.options ?? []}
                slug={product.slug}
                name={product.name}
                price={displayPrice}
                imageUrl={product.imageUrl}
                categoryName={product.categoryName}
                disabled={isAddToCartDisabled}
                label={desktopButtonLabel}
                onSuccess={handleAddToCartSuccess}
              />

              <p className="text-[10px] uppercase tracking-[0.18em] text-black/85">
                30-day returns · Secure checkout
              </p>

              <a
                href="/shop"
                className="inline-flex min-h-[48px] items-center justify-center border border-black/15 px-6 py-3.5 text-[11px] uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8] sm:px-7 sm:py-4"
              >
                Back to shop
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="flex w-full items-center justify-between px-4 py-4 text-left sm:px-6 lg:px-8"
          >
            <span className="text-[10px] uppercase tracking-[0.22em] text-black/50 sm:text-[11px]">
              Description
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-black/45">
              {showDetails ? "Close" : "Open"}
            </span>
          </button>

          {showDetails ? (
            <div className="border-t border-black/10 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
              <div className="max-w-[52ch] space-y-4 text-[14px] leading-6 text-black/65 sm:text-[15px] sm:leading-7">
                {product.benefits.length > 0 ? (
                  <div className="mt-2 mb-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-black/45">
                      Highlights
                    </p>

                    <ul className="mt-3 space-y-2 text-[14px] leading-6 text-black/75">
                      {product.benefits.slice(0, 4).map((benefit) => (
                        <li key={benefit}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {visibleParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}

                {paragraphs.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowFullDescription((prev) => !prev)}
                    className="text-[11px] uppercase tracking-[0.18em] text-black/60 hover:text-black"
                  >
                    {showFullDescription ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {product.sizeGuideEnabled && product.sizeGuideContent ? (
          <div className="border-t border-black/10">
            <button
              type="button"
              onClick={() => setShowSizeGuide((prev) => !prev)}
              className="flex w-full items-center justify-between px-4 py-4 text-left sm:px-6 lg:px-8"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-black/50 sm:text-[11px]">
                {product.sizeGuideTitle || "Size guide"}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-black/45">
                {showSizeGuide ? "Close" : "Open"}
              </span>
            </button>

            {showSizeGuide ? (
              <div className="border-t border-black/10 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                <div className="whitespace-pre-line text-[14px] leading-6 text-black/65 sm:text-[15px] sm:leading-7">
                  {product.sizeGuideContent}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {product.reviews.length > 0 ? (
          <div className="border-t border-black/10">
            <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-black/45 sm:text-[11px]">
                    Reviews
                  </p>
                  {averageRating ? (
                    <div className="mt-2">
                      <p className="text-lg tracking-[-0.03em] text-black">
                        {averageRating} / 5
                      </p>
                      <p className="mt-1 text-sm text-black/65">
                        {renderStars(Math.round(Number(averageRating)))} ·{" "}
                        {reviewCount} review{reviewCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviewsModal(true)}
                  className="inline-flex min-h-[44px] items-center justify-center border border-black/15 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8]"
                >
                  See all reviews
                </button>
              </div>

              {featuredReview ? (
                <button
                  type="button"
                  onClick={() => setShowReviewsModal(true)}
                  className="mt-6 block w-full text-left"
                >
                  <article className="border border-black/10 bg-[#f3efe8] p-4 transition hover:border-black/20 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-black">
                          {renderStars(featuredReview.rating)}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-black/75">
                            {featuredReview.authorName}
                            {featuredReview.authorCountry
                              ? ` · ${featuredReview.authorCountry}`
                              : ""}
                          </p>

                          {featuredReview.verified ? (
                            <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">
                              Verified
                            </p>
                          ) : null}
                        </div>

                        {featuredReview.title ? (
                          <h3 className="mt-3 text-sm uppercase tracking-[0.06em] text-black">
                            {featuredReview.title}
                          </h3>
                        ) : null}

                        <p className="mt-3 line-clamp-4 max-w-[62ch] text-[14px] leading-6 text-black/68 sm:text-[15px] sm:leading-7">
                          {featuredReview.content}
                        </p>

                        <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-black/45">
                          Tap to view all reviews
                        </p>
                      </div>

                      {featuredReview.imageUrl ? (
                        <div className="w-full shrink-0 sm:w-[140px]">
                          <div className="flex h-[140px] w-full items-center justify-center overflow-hidden border border-black/10 bg-[#ebe6de]">
                            <img
                              src={featuredReview.imageUrl}
                              alt={
                                featuredReview.title ||
                                featuredReview.authorName
                              }
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </article>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f6f1e8]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-[10px] uppercase tracking-[0.16em] text-black/45">
              {product.name}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-base tracking-[-0.04em] text-black">
                {formatPrice(displayPrice)}
              </p>
              {displayCompareAtPrice && displayCompareAtPrice > displayPrice ? (
                <p className="text-xs text-black/35 line-through">
                  {formatPrice(displayCompareAtPrice)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="w-[180px] shrink-0">
            {needsOptionSelection ? (
              <button
                type="button"
                onClick={handleScrollToOptions}
                className="flex min-h-[48px] w-full items-center justify-center bg-black px-6 py-3.5 text-[11px] uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:opacity-90"
              >
                {mobileButtonLabel}
              </button>
            ) : (
              <AddToCartButton
                productId={product.id}
                variantId={selectedVariant?.id ?? null}
                variantName={selectedVariant?.name ?? null}
                variantOptions={selectedVariant?.options ?? []}
                slug={product.slug}
                name={product.name}
                price={displayPrice}
                imageUrl={product.imageUrl}
                categoryName={product.categoryName}
                disabled={isOutOfStock}
                label={mobileButtonLabel}
                onSuccess={handleAddToCartSuccess}
              />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReviewsModal ? (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70"
            onClick={() => setShowReviewsModal(false)}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="flex h-dvh w-full items-end justify-center sm:items-center sm:p-6">
              <motion.div
                className="flex h-[92dvh] w-full max-w-5xl flex-col overflow-hidden bg-[#f6f1e8] sm:h-[88dvh] sm:border sm:border-black/10"
                onClick={(event) => event.stopPropagation()}
                initial={{ y: 40, opacity: 0, scale: 0.985 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="shrink-0 border-b border-black/10 px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-black/45">
                        Customer reviews
                      </p>
                      {averageRating ? (
                        <p className="mt-2 text-sm text-black/75">
                          {renderStars(Math.round(Number(averageRating)))}{" "}
                          {averageRating} · {reviewCount} review
                          {reviewCount === 1 ? "" : "s"}
                        </p>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowReviewsModal(false)}
                      className="text-[11px] uppercase tracking-[0.18em] text-black/60 transition hover:text-black"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div
                  data-modal-scroll
                  className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y px-4 py-4 sm:px-6 sm:py-6"
                >
                  <div className="grid gap-4">
                    {product.reviews.map((review) => {
                      const formattedDate = formatReviewDate(review.reviewDate);

                      return (
                        <article
                          key={review.id}
                          className="border border-black/10 bg-[#f3efe8] p-4 sm:p-5"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-black">
                                {renderStars(review.rating)}
                              </p>

                              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-black/75">
                                  {review.authorName}
                                  {review.authorCountry
                                    ? ` · ${review.authorCountry}`
                                    : ""}
                                </p>

                                {review.verified ? (
                                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">
                                    Verified
                                  </p>
                                ) : null}

                                {review.source ? (
                                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                                    {review.source}
                                  </p>
                                ) : null}

                                {formattedDate ? (
                                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                                    {formattedDate}
                                  </p>
                                ) : null}
                              </div>

                              {review.title ? (
                                <h3 className="mt-3 text-sm uppercase tracking-[0.06em] text-black">
                                  {review.title}
                                </h3>
                              ) : null}

                              <p className="mt-3 max-w-[62ch] text-[14px] leading-6 text-black/68 sm:text-[15px] sm:leading-7">
                                {review.content}
                              </p>
                            </div>

                            {review.imageUrl ? (
                              <div className="w-full shrink-0 sm:w-[160px]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedReviewImage({
                                      url: review.imageUrl as string,
                                      alt: review.title || review.authorName,
                                    })
                                  }
                                  className="group block w-full text-left"
                                  aria-label={`Open review image from ${review.authorName}`}
                                >
                                  <div className="flex h-[160px] w-full items-center justify-center overflow-hidden border border-black/10 bg-[#ebe6de]">
                                    <img
                                      src={review.imageUrl}
                                      alt={review.title || review.authorName}
                                      className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                                    />
                                  </div>
                                  <span className="mt-2 inline-block text-[10px] uppercase tracking-[0.16em] text-black/45">
                                    View full size
                                  </span>
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {selectedReviewImage ? (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedReviewImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedReviewImage(null)}
              className="absolute right-0 top-[-44px] text-[11px] uppercase tracking-[0.18em] text-white/80 transition hover:text-white"
            >
              Close
            </button>

            <div className="flex max-h-[85vh] min-h-[280px] w-full items-center justify-center bg-[#f3efe8] p-3 sm:p-5">
              <img
                src={selectedReviewImage.url}
                alt={selectedReviewImage.alt}
                className="max-h-[80vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
