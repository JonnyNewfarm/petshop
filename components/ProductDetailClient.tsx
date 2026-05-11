"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import { AnimatePresence } from "framer-motion";
import { FaShippingFast } from "react-icons/fa";

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

type SelectedOptions = Record<string, string>;

const colorMap: Record<string, string> = {
  black: "#111111",
  white: "#f8f8f8",
  grey: "#9ca3af",
  gray: "#9ca3af",
  beige: "#d8c3a5",
  brown: "#7a4f2a",
  navy: "#1e2a44",
  blue: "#2563eb",
  red: "#dc2626",
  green: "#16a34a",
  yellow: "#facc15",
  pink: "#f9a8d4",
  purple: "#9333ea",
  orange: "#f97316",
};

function isColorOption(optionName: string) {
  return ["color", "colour", "farge"].includes(optionName.toLowerCase());
}

function isSizeOption(optionName: string) {
  return ["size", "størrelse", "storrelse"].includes(optionName.toLowerCase());
}

function getColorValue(value: string) {
  return colorMap[value.toLowerCase()] ?? value;
}

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
  onOptionsChange: (selectedOptions: SelectedOptions) => void;
};

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

export default function ProductDetailsClient({
  product,
  selectedVariantId,
  onVariantChange,
  onOptionsChange,
}: ProductDetailsClientProps) {
  const hasVariants = product.variants.length > 0;
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);

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

  const isOnSale =
    !!displayCompareAtPrice && displayCompareAtPrice > displayPrice;

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

  useEffect(() => {
    setHasAddedToCart(false);
  }, [product.id, selectedVariantId, selectedVariant?.id]);

  useEffect(() => {
    if (!hasVariants) return;
    if (groupedOptions.length === 0) return;
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
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-black/45 sm:text-[11px]">
                  {product.categoryName}
                </p>

                <h2
                  style={{ fontFamily: "Mango" }}
                  className="mt-3 text-[clamp(2rem,8.2vw,5rem)] uppercase leading-[0.92] tracking-[-0.01em] sm:mt-4 sm:tracking-[-0.02em]"
                >
                  {product.name}
                </h2>
              </div>

              {product.badge ? (
                <p className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-black/55">
                  {product.badge}
                </p>
              ) : null}
            </div>

            {heroDescription ? (
              <p className="mt-3 w-full text-[17px] leading-6 text-black/62 sm:text-[15px] sm:leading-7">
                {heroDescription}
              </p>
            ) : null}

            {product.benefits.length > 0 ? (
              <div className="mt-5 grid gap-2 border-t border-black/10 pt-4 text-[14px] leading-5 text-black/72">
                {product.benefits.slice(0, 3).map((benefit) => (
                  <p key={benefit} className="flex gap-2">
                    <span className="text-black/45">✓</span>
                    <span>{benefit}</span>
                  </p>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex items-end justify-between gap-6 border-t border-black/10 pt-4 sm:mt-6 sm:pt-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                Price
              </p>

              <div className="mt-2 flex flex-wrap items-end gap-3">
                <p
                  className={`text-[1.55rem] leading-none tracking-[-0.05em] sm:text-[1.9rem] ${
                    isOnSale ? "text-red-700" : "text-black"
                  }`}
                >
                  {formatPrice(displayPrice)}
                </p>

                {isOnSale ? (
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

                        const isColor = isColorOption(group.name);
                        const colorValue = getColorValue(value);

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
                              onOptionsChange(updatedOptions);

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
                            aria-label={`${group.name}: ${value}`}
                            title={value}
                            className={`min-h-[44px] transition ${
                              isColor
                                ? `flex h-11 w-11 items-center justify-center border ${
                                    isActive
                                      ? "border-black bg-[#f3efe8]"
                                      : "border-black/15 bg-[#f3efe8] hover:border-black/50"
                                  }`
                                : `min-w-[74px] border px-5 py-3.5 text-[11px] uppercase tracking-[0.18em] sm:min-w-[86px] sm:px-6 sm:py-4 sm:text-[12px] ${
                                    isActive
                                      ? "border-black bg-black font-semibold text-[#f6f1e8]"
                                      : "border-black/60 bg-[#f8f6f2] font-semibold text-black hover:border-black hover:bg-black hover:text-[#f6f1e8]"
                                  }`
                            } ${!exists ? "cursor-not-allowed opacity-30" : ""}`}
                          >
                            {isColor ? (
                              <span
                                className="block h-7 w-7 border border-black/10"
                                style={{ backgroundColor: colorValue }}
                              />
                            ) : (
                              <>
                                {value}
                                {exists && outOfStock ? (
                                  <span className="ml-2 text-[10px] opacity-70">
                                    • Out
                                  </span>
                                ) : null}
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isSizeOption(group.name) &&
                    product.sizeGuideEnabled &&
                    product.sizeGuideContent ? (
                      <div className="mt-4 border border-black/10 bg-[#f3efe8]">
                        <button
                          type="button"
                          onClick={() => setShowSizeGuide((prev) => !prev)}
                          className="flex w-full items-center justify-between px-4 py-4 text-left"
                        >
                          <span className="text-[12px] uppercase tracking-[0.22em] text-black/80 sm:text-[11px]">
                            {product.sizeGuideTitle || "Size guide"}
                          </span>
                          <span className="text-[12px] uppercase tracking-[0.18em] text-black/60">
                            {showSizeGuide ? "Close" : "Open"}
                          </span>
                        </button>

                        {showSizeGuide ? (
                          <div className="border-t border-black/10 px-4 py-5">
                            <div className="whitespace-pre-line text-[14px] leading-6 text-black/65 sm:text-[15px] sm:leading-7">
                              {product.sizeGuideContent}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
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
              <div className="border-l-2 border-black bg-[#f0dcc5] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#e7c7a8]">
                    <FaShippingFast size={17} color="rgba(0,0,0,0.72)" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] uppercase leading-4 tracking-[0.18em] text-black">
                      Free shipping
                    </p>

                    <p className="mt-1 text-[13px] leading-5 text-black/60">
                      Every order ships with tracking.
                    </p>
                  </div>
                </div>
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
                30-day returns · Secure checkout · Tracked shipping
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
            <span className="text-[12px] uppercase tracking-[0.22em] text-black/80 sm:text-[11px]">
              Description
            </span>
            <span className="text-[12px] uppercase tracking-[0.18em] text-black/80">
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
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f6f1e8]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-[10px] uppercase tracking-[0.16em] text-black/45">
              {product.name}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <p
                className={`text-base tracking-[-0.04em] ${
                  isOnSale ? "text-red-700" : "text-black"
                }`}
              >
                {formatPrice(displayPrice)}
              </p>

              {isOnSale ? (
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

      <AnimatePresence />
    </>
  );
}
