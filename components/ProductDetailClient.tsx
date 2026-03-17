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
    <div className="border border-black/10 bg-[#e6e2dc]">
      <div className="border-b border-black/10 px-6 py-6 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
          {product.categoryName}
        </p>

        <h2
          style={{ fontFamily: "Mango" }}
          className="mt-4 text-[clamp(2.3rem,4.8vw,4.8rem)] uppercase leading-[0.9] tracking-[-0.02em]"
        >
          {product.name}
        </h2>

        <div className="mt-6 flex items-end justify-between gap-6 border-t border-black/10 pt-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
              Price
            </p>
            <p className="mt-2 text-[1.9rem] leading-none tracking-[-0.05em]">
              {formatPrice(displayPrice)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
              Stock
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-black/70">
              {displayStock > 0 ? `${displayStock} available` : "Out of stock"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <div className="border-b border-black/10 pb-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
            Description
          </p>

          <p className="mt-4 max-w-[52ch] text-[15px] leading-7 text-black/65">
            {product.description}
          </p>
        </div>

        {hasVariants && (
          <div className="border-b border-black/10 py-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                  Options
                </p>
                <p className="mt-2 text-sm leading-6 text-black/58">
                  Choose a variant before adding to cart.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {groupedOptions.map((group) => (
                <div key={group.name}>
                  <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-black/45">
                    {group.name}
                  </p>

                  <div className="flex flex-wrap gap-2.5">
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
                          className={`px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition ${
                            isActive
                              ? "bg-black text-[#f6f1e8]"
                              : "bg-[#f3efe8] text-black hover:bg-black hover:text-[#f6f1e8]"
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

            <div className="mt-6 border-t border-black/10 pt-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                Selected variant
              </p>
              <p className="mt-2 text-[1.05rem] uppercase tracking-[-0.02em] text-black">
                {selectedVariant?.name ?? "No variant selected"}
              </p>
            </div>
          </div>
        )}

        <div className="py-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-b border-black/10 pb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                Category
              </p>
              <p className="mt-2 text-base uppercase tracking-[-0.02em]">
                {product.categoryName}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                Product
              </p>
              <p className="mt-2 text-base uppercase tracking-[-0.02em]">
                Curated item
              </p>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex flex-col gap-4">
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
              />

              <a
                href="/shop"
                className="inline-flex items-center justify-center border border-black/15 px-7 py-4 text-[11px] uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8]"
              >
                Back to shop
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
