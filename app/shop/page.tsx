import { Suspense } from "react";
import ShopClient from "@/components/ShopClient";
import ScrollSection from "@/components/SmoothScroll";

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
