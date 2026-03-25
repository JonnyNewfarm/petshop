"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cart-store";

type AddToCartButtonProps = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName?: string;
  variantId?: string | null;
  variantName?: string | null;
  variantOptions?: { name: string; value: string }[];
  disabled?: boolean;
};

export default function AddToCartButton({
  productId,
  slug,
  name,
  price,
  imageUrl,
  categoryName,
  variantId,
  variantName,
  variantOptions,
  disabled = false,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    if (added) {
      router.push("/cart");
      return;
    }

    addItem({
      productId,
      variantId,
      name,
      slug,
      price,
      imageUrl,
      categoryName,
      variantName,
      variantOptions,
    });

    setAdded(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="inline-flex items-center justify-center border border-black bg-black px-7 py-4 text-[11px] uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
    >
      {added ? "Continue to cart" : "Add to cart"}
    </button>
  );
}
