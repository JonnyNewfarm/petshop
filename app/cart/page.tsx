"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/app/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const subtotal = useCartStore((state) => state.getSubtotal());

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-28 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
            Cart
          </p>
          <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            Your cart
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="border border-black/10 bg-white p-8">
            <p className="text-base text-black/70">Your cart is empty.</p>

            <Link
              href="/shop"
              className="mt-6 inline-flex border border-black bg-black px-6 py-4 text-sm uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 border border-black/10 bg-white p-4 sm:grid-cols-[120px_1fr]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#f3efe8]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                        {item.categoryName ?? "Product"}
                      </p>

                      <Link
                        href={`/shop/${item.slug}`}
                        className="mt-2 block text-xl font-medium text-black"
                      >
                        {item.name}
                      </Link>

                      {item.variantName ? (
                        <p className="mt-2 text-sm text-black/55">
                          Variant: {item.variantName}
                        </p>
                      ) : null}

                      <p className="mt-3 text-sm text-black/70">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center border border-black/10">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="px-4 py-2 text-sm"
                        >
                          -
                        </button>

                        <span className="px-4 py-2 text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="px-4 py-2 text-sm"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm uppercase tracking-[0.14em] text-black/50 transition hover:text-black"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit border border-black/10 bg-white p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                Summary
              </p>

              <div className="mt-6 flex items-center justify-between text-sm text-black/70">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="mt-4 flex items-center justify-between text-lg font-medium text-black">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <button
                type="button"
                className="mt-8 w-full border border-black bg-black px-6 py-4 text-sm uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
              >
                Checkout
              </button>

              <Link
                href="/shop"
                className="mt-4 inline-flex w-full items-center justify-center border border-black/15 px-6 py-4 text-sm uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8]"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
