"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/app/store/cart-store";
import { trackMetaEvent } from "@/lib/meta-pixel";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const subtotal = useCartStore((state) => state.getSubtotal());

  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const shipping = 0;
  const total = subtotal;

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  async function handleCheckout() {
    try {
      setLoadingCheckout(true);

      trackMetaEvent("InitiateCheckout", {
        currency: "USD",
        value: total / 100,
        num_items: totalQuantity,
        content_type: "product",
        content_ids: items.map((item) => item.id),
        contents: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          item_price: item.price / 100,
        })),
      });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error("Checkout failed");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Could not start checkout.");
    } finally {
      setLoadingCheckout(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#dddad5] text-black">
      <div className="mx-auto max-w-[1600px] px-6 pb-20 pt-28 sm:px-8 lg:px-12">
        <section className="border-b border-black/10 pb-14 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="max-w-[980px]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                Cart
              </p>

              <h1
                style={{ fontFamily: "Mango" }}
                className="mt-5 text-[clamp(3.4rem,9vw,9rem)] uppercase leading-[0.88] tracking-[-0.02em]"
              >
                Your cart
              </h1>

              <p className="mt-6 max-w-[620px] text-[15px] leading-7 text-black/62 md:text-base">
                Review your selected pieces before checkout. A curated cart for
                modern pet living.
              </p>
            </div>

            <div className="flex flex-col justify-end">
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-black/10 pt-6 sm:grid-cols-3 lg:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                    Items
                  </p>
                  <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                    {totalQuantity}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                    Total
                  </p>
                  <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                    {formatPrice(total)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                    Shipping
                  </p>
                  <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                    Free
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {items.length === 0 ? (
          <section className="pt-12">
            <div className="border border-black/10 bg-[#e6e2dc] px-6 py-20 text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                Empty cart
              </p>

              <h2 className="mt-3 text-[2rem] uppercase tracking-[-0.05em]">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-4 max-w-[520px] text-sm leading-7 text-black/60">
                Explore the collection and add a few essentials to your cart.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-flex border border-black bg-black px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
              >
                Continue shopping
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 lg:pt-12">
            <div className="min-w-0">
              <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                    Selection
                  </p>
                  <h2 className="mt-2 text-[1.4rem] uppercase tracking-[-0.04em]">
                    Chosen products
                  </h2>
                </div>

                <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                  {totalQuantity} items
                </div>
              </div>

              <div className="space-y-8">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-5 border-b border-black/10 pb-8 sm:grid-cols-[170px_minmax(0,1fr)]"
                  >
                    <Link
                      href={`/shop/${item.slug}`}
                      className="relative aspect-[0.9] overflow-hidden bg-[#e7e2db]"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-col justify-between gap-6">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                          {item.categoryName ?? "Product"}
                        </p>

                        <Link
                          href={`/shop/${item.slug}`}
                          style={{ fontFamily: "Mango" }}
                          className="mt-3 block text-[clamp(1.5rem,2.2vw,2.4rem)] uppercase leading-[0.92] tracking-[-0.01em]"
                        >
                          {item.name}
                        </Link>

                        {item.variantName ? (
                          <p className="mt-3 text-sm leading-6 text-black/60">
                            Variant: {item.variantName}
                          </p>
                        ) : null}

                        <p className="mt-4 text-[15px] text-black/72">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center border border-black/10 bg-[#f3efe8]">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            className="px-4 py-3 text-[12px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-[#f6f1e8]"
                          >
                            −
                          </button>

                          <span className="min-w-[52px] px-4 py-3 text-center text-[12px] uppercase tracking-[0.18em]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            className="px-4 py-3 text-[12px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-[#f6f1e8]"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-5">
                          <p className="text-[12px] uppercase tracking-[0.18em] text-black/55">
                            {formatPrice(item.price * item.quantity)}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-[11px] uppercase tracking-[0.18em] text-black/50 transition hover:text-black"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border border-black/10 bg-[#e6e2dc]">
                <div className="border-b border-black/10 px-6 py-6 sm:px-8">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                    Summary
                  </p>

                  <h2 className="mt-3 text-[1.6rem] uppercase tracking-[-0.04em]">
                    Order total
                  </h2>
                </div>

                <div className="px-6 py-6 sm:px-8">
                  <div className="mb-6">
                    <div className="text-sm text-black/70">
                      You’ve unlocked free shipping.
                    </div>

                    <div className="mt-3 h-[6px] w-full overflow-hidden bg-black/10">
                      <div
                        className="h-full bg-black transition-all duration-500"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 border-b border-black/10 pb-6">
                    <div className="flex items-center justify-between text-sm text-black/65">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-black/65">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 border-b border-black/10 py-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                        Total
                      </p>
                      <p className="mt-2 text-[1.9rem] leading-none tracking-[-0.05em]">
                        {formatPrice(total)}
                      </p>
                    </div>

                    <p className="max-w-[120px] text-right text-[10px] uppercase tracking-[0.18em] text-black/40">
                      Taxes handled in checkout
                    </p>
                  </div>

                  <div className="pt-6">
                    <div className="flex flex-col gap-4">
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={loadingCheckout}
                        className="w-full border border-black bg-black px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black disabled:opacity-50"
                      >
                        {loadingCheckout ? "Loading..." : "Checkout"}
                      </button>

                      <Link
                        href="/shop"
                        className="inline-flex w-full items-center justify-center border border-black/15 px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8]"
                      >
                        Continue shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
