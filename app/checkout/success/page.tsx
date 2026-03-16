import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f1e8] px-6 text-black">
      <div className="max-w-[700px] border border-black/10 bg-white p-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
          Checkout
        </p>

        <h1 className="mt-4 text-[clamp(2.5rem,6vw,4rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
          Payment successful
        </h1>

        <p className="mt-6 text-base leading-7 text-black/65">
          Thank you for your order.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-flex border border-black bg-black px-6 py-4 text-sm uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
        >
          Back to shop
        </Link>
      </div>
    </main>
  );
}
