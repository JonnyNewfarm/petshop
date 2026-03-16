"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/app/store/cart-store";

export default function CartButton() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/cart"
      className="flex w-full items-center justify-between text-lg font-semibold text-black/70 transition hover:text-black"
    >
      <span>Cart</span>

      <span className="ml-4 inline-flex min-w-7 items-center justify-center border border-black/10 px-2 py-1 text-sm text-black">
        {mounted ? itemCount : ""}
      </span>
    </Link>
  );
}
