"use client";

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
  label?: string;
  onSuccess?: () => void;
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
  label = "Add to cart",
  onSuccess,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;

    if (label === "Continue to cart") {
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

    onSuccess?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="inline-flex items-center justify-center border border-black bg-black px-7 py-4 text-[11px] uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}
