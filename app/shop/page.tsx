import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "@/components/ShopClient";
import ScrollSection from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Shop Pet Supplies",
  description:
    "Browse pet supplies at Petsaco. Discover toys, accessories, food and essentials for dogs, cats and small animals. Quality products with fast shipping.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Pet Supplies | Petsaco",
    description:
      "Explore our collection of pet toys, accessories and essentials. Everything your pet needs in one place.",
    url: "https://petsaco.com/shop",
    siteName: "Petsaco",
    type: "website",
  },
};

function ShopPageFallback() {
  return (
    <main className="min-h-screen bg-[#dddad5] px-6 py-28 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="py-20 text-sm uppercase tracking-[0.18em] text-black/45">
          Loading shop...
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <ScrollSection>
      <Suspense fallback={<ShopPageFallback />}>
        <ShopClient />
      </Suspense>
    </ScrollSection>
  );
}
