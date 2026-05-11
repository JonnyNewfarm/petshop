"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#dddad5] px-6 pb-8 pt-16 text-black md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <nav className="flex flex-wrap gap-x-10 gap-y-4 text-sm uppercase">
          <Link href="/" className="transition-opacity hover:opacity-60">
            home
          </Link>

          <Link href="/shop" className="transition-opacity hover:opacity-60">
            shop
          </Link>

          <Link href="/cart" className="transition-opacity hover:opacity-60">
            cart
          </Link>

          <Link href="/contact" className="transition-opacity hover:opacity-60">
            contact
          </Link>

          <Link href="/privacy" className="transition-opacity hover:opacity-60">
            privacy
          </Link>

          <Link href="/terms" className="transition-opacity hover:opacity-60">
            terms
          </Link>

          <Link href="/refunds" className="transition-opacity hover:opacity-60">
            refunds
          </Link>

          <Link
            href="/shipping"
            className="transition-opacity hover:opacity-60"
          >
            shipping
          </Link>
          <Link href="/about" className="transition-opacity hover:opacity-60">
            about
          </Link>
        </nav>

        <div className="mt-10 h-px w-full bg-black/20" />
      </div>

      <div className="mt-10">
        <div className="footer-marquee flex w-max items-center">
          <span
            style={{ fontFamily: "Mango" }}
            className="block whitespace-nowrap pr-10 text-[clamp(4.5rem,14vw,14rem)] uppercase leading-[0.8]"
          >
            petsaco — petsaco — petsaco — petsaco —
          </span>

          <span
            style={{ fontFamily: "Mango" }}
            className="block whitespace-nowrap pr-10 text-[clamp(4.5rem,14vw,14rem)] uppercase leading-[0.8]"
            aria-hidden="true"
          >
            petsaco — petsaco — petsaco — petsaco —
          </span>
        </div>
      </div>

      <style jsx>{`
        .footer-marquee {
          animation: marqueeMove 18s linear infinite;
        }

        @keyframes marqueeMove {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </footer>
  );
}
