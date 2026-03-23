"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/app/store/cart-store";

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const hasCleared = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) return;
    if (hasCleared.current) return;

    async function verifyAndClear() {
      try {
        const res = await fetch(
          `/api/checkout/verify?session_id=${sessionId}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data.paid) {
          clearCart();
          hasCleared.current = true;
        }
      } catch (error) {
        console.error("Failed to verify payment:", error);
      }
    }

    verifyAndClear();
  }, [searchParams, clearCart]);

  return null;
}
