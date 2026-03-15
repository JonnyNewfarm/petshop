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
      className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.18em] text-black/70 transition hover:text-black"
    >
      Cart
      <span className="inline-flex min-w-6 items-center justify-center border border-black/10 px-1.5 py-1 text-[11px] text-black">
        {mounted ? itemCount : ""}
      </span>
    </Link>
  );
}
