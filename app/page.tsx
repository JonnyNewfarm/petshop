import HeroSection from "@/components/HeroSection";
import ScrollSection from "@/components/SmoothScroll";

export default function HomePage() {
  return (
    <ScrollSection>
      <HeroSection />

      <section
        id="shop"
        className="bg-[#f6f1e8] px-6 py-24 text-neutral-950 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.18em] text-black/50">
            Next section
          </p>
          <h2 className="mt-4 text-4xl font-semibold uppercase tracking-[-0.04em]">
            Featured products
          </h2>
        </div>
      </section>
    </ScrollSection>
  );
}
