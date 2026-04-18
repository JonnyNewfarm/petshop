"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/app/store/cart-store";
import { trackMetaEvent } from "@/lib/meta-pixel";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore((state) => state.items);
  const hasHandled = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) return;
    if (hasHandled.current) return;

    async function verifyAndHandle() {
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
          const storageKey = `petsaco_purchase_tracked_${sessionId}`;
          const alreadyTracked = sessionStorage.getItem(storageKey);

          if (!alreadyTracked) {
            const totalValue =
              typeof data.amountTotal === "number"
                ? data.amountTotal / 100
                : items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0,
                  ) / 100;

            const currency = String(data.currency || "usd").toUpperCase();

            trackMetaEvent("Purchase", {
              currency,
              value: totalValue,
              num_items: items.reduce((sum, item) => sum + item.quantity, 0),
              content_type: "product",
              content_ids: items.map((item) => item.id),
              contents: items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                item_price: item.price / 100,
              })),
            });

            if (typeof window !== "undefined" && window.gtag) {
              window.gtag("event", "conversion", {
                send_to: "AW-18099784617/Plm3CIO1zZ4cEKmX07ZD",
                value: totalValue,
                currency,
                transaction_id: sessionId,
              });
            }

            sessionStorage.setItem(storageKey, "true");
          }

          clearCart();
          hasHandled.current = true;
        }
      } catch (error) {
        console.error("Failed to verify payment:", error);
      }
    }

    verifyAndHandle();
  }, [searchParams, clearCart, items]);

  return null;
}
