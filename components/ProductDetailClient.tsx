"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";

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
  options: VariantOption[];
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

export default function ProductDetailsClient({
  product,
  selectedVariantId,
  onVariantChange,
  onColorChange,
}: ProductDetailsClientProps) {
  const hasVariants = product.variants.length > 0;

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

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

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
  const displayCompareAtPrice = product.compareAtPrice;

  const hasAnyVariantInStock = hasVariants
    ? product.variants.some((variant) => variant.stock > 0)
    : false;

  const availabilityLabel = hasVariants
    ? selectedVariant
      ? selectedVariant.stock > 0
        ? "In stock"
        : "Out of stock"
      : hasAnyVariantInStock
        ? "Choose options"
        : "Out of stock"
    : product.stock > 0
      ? "In stock"
      : "Out of stock";

  const isSelectedVariantOutOfStock =
    hasVariants && selectedVariant ? selectedVariant.stock <= 0 : false;

  const isAddToCartDisabled =
    (hasVariants && (!isExactSelectionComplete || !selectedVariant)) ||
    isSelectedVariantOutOfStock;

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

              {product.shortDescription ? (
                <p className="mt-3 max-w-[52ch] text-[14px] leading-6 text-black/62 sm:text-[15px] sm:leading-7">
                  {product.shortDescription}
                </p>
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
            <div className="border-t border-black/10 pt-5 sm:pt-6 mt-5 sm:mt-6">
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

          <div className="border-t border-black/10 pt-5 sm:pt-6 mt-5 sm:mt-6">
            <div className="flex flex-col gap-3">
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
              />

              <p className="text-[10px] uppercase tracking-[0.18em] text-black/55">
                Free shipping over $49 · 30-day returns · Secure Stripe checkout
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
            />
          </div>
        </div>
      </div>
    </>
  );
}
