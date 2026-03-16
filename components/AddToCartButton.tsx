"use client";

import { useState } from "react";
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
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
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

    setTimeout(() => {
      setAdded(false);
    }, 1400);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="inline-flex items-center justify-center border border-black bg-black px-7 py-4 text-sm font-medium uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
    >
      {added ? "Added" : "Add to cart"}
    </button>
  );
}
