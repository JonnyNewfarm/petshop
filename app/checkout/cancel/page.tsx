import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f1e8] px-6 text-black">
      <div className="max-w-[700px] border border-black/10 bg-white p-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
          Checkout
        </p>

        <h1 className="mt-4 text-[clamp(2.5rem,6vw,4rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
          Payment cancelled
        </h1>

        <p className="mt-6 text-base leading-7 text-black/65">
          No worries — your cart is still here if you want to try again.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center border border-black bg-black px-6 py-4 text-sm uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
          >
            Back to cart
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-black/15 px-6 py-4 text-sm uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8]"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
