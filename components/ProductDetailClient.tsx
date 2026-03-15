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
    price: number;
    stock: number;
    imageUrl: string;
    categoryName: string;
    variants: Variant[];
  };
};

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  const hasVariants = product.variants.length > 0;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants[0]?.id ?? null,
  );

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return (
      product.variants.find((variant) => variant.id === selectedVariantId) ??
      product.variants[0] ??
      null
    );
  }, [hasVariants, product.variants, selectedVariantId]);

  const displayPrice = selectedVariant?.price ?? product.price;
  const displayStock = hasVariants
    ? (selectedVariant?.stock ?? 0)
    : product.stock;

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

  return (
    <div className="max-w-[620px]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
        {product.categoryName}
      </p>

      <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.05em]">
        {product.name}
      </h1>

      <p className="mt-5 text-xl text-black/80">{formatPrice(displayPrice)}</p>

      <p className="mt-8 text-base leading-7 text-black/65">
        {product.description}
      </p>

      {hasVariants && (
        <div className="mt-8 space-y-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
              Options
            </p>

            <div className="mt-4 space-y-4">
              {groupedOptions.map((group) => (
                <div key={group.name}>
                  <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-black/70">
                    {group.name}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {group.values.map((value) => {
                      const matchingVariant = product.variants.find((variant) =>
                        variant.options.some(
                          (option) =>
                            option.name === group.name &&
                            option.value === value,
                        ),
                      );

                      const isActive = selectedVariant?.options.some(
                        (option) =>
                          option.name === group.name && option.value === value,
                      );

                      return (
                        <button
                          key={`${group.name}-${value}`}
                          type="button"
                          onClick={() =>
                            matchingVariant &&
                            setSelectedVariantId(matchingVariant.id)
                          }
                          className={`border px-4 py-3 text-sm uppercase tracking-[0.14em] transition ${
                            isActive
                              ? "border-black bg-black text-[#f6f1e8]"
                              : "border-black/10 bg-white text-black hover:border-black"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-black/10 bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
              Selected variant
            </p>
            <p className="mt-2 text-base font-medium text-black">
              {selectedVariant?.name ?? "No variant selected"}
            </p>
          </div>
        </div>
      )}

      <p className="mt-6 text-sm text-black/55">
        Stock: {displayStock > 0 ? displayStock : "Out of stock"}
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <AddToCartButton
          productId={product.id}
          variantId={selectedVariant?.id ?? null}
          variantName={selectedVariant?.name ?? null}
          slug={product.slug}
          name={product.name}
          price={displayPrice}
          imageUrl={product.imageUrl}
          categoryName={product.categoryName}
        />

        <a
          href="/shop"
          className="inline-flex items-center justify-center border border-black/15 px-7 py-4 text-sm font-medium uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8]"
        >
          Back to shop
        </a>
      </div>
    </div>
  );
}
