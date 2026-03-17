import ScrollSection from "@/components/SmoothScroll";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <ScrollSection>
      <main className="min-h-screen bg-[#dddad5] text-black">
        <div className="mx-auto flex min-h-screen max-w-[1600px] items-center px-6 py-28 sm:px-8 lg:px-12">
          <section className="w-full border border-black/10 bg-[#e6e2dc]">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="border-b border-black/10 px-6 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
                <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                  Checkout
                </p>

                <h1
                  style={{ fontFamily: "Mango" }}
                  className="mt-5 text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.88] tracking-[-0.02em]"
                >
                  Payment cancelled
                </h1>

                <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-black/62 md:text-base">
                  No worries — nothing was completed, and your selected items
                  are still waiting in your cart if you want to try again.
                </p>
              </div>

              <div className="px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
                <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-b border-black/10 pb-8">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                      Status
                    </p>
                    <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                      Cancelled
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                      Cart
                    </p>
                    <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                      Preserved
                    </p>
                  </div>
                </div>

                <div className="py-8">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                    Next step
                  </p>

                  <p className="mt-4 max-w-[420px] text-sm leading-7 text-black/62">
                    Return to your cart to review your order, or continue
                    browsing the collection before checking out again.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Link
                    href="/cart"
                    className="inline-flex items-center justify-center border border-black bg-black px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
                  >
                    Back to cart
                  </Link>

                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center border border-black/15 px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8]"
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ScrollSection>
  );
}
