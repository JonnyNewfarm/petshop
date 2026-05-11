import Link from "next/link";
import ScrollSection from "@/components/SmoothScroll";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

export default function LegalPageLayout({
  eyebrow,
  title,
  intro,
  children,
}: LegalPageLayoutProps) {
  return (
    <ScrollSection>
      <main className="min-h-screen bg-[#dddad5] text-black">
        <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-12 lg:pt-32">
          <section className="border-b border-black/10 pb-10 sm:pb-12 lg:pb-16">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
              <div className="max-w-[980px]">
                <p className="text-[10px] uppercase tracking-[0.28em] text-black/45 sm:text-[11px]">
                  {eyebrow}
                </p>

                <h1
                  style={{ fontFamily: "Mango" }}
                  className="mt-4 text-[clamp(2.6rem,9vw,7rem)] uppercase leading-[0.9] tracking-[-0.03em] sm:mt-5"
                >
                  {title}
                </h1>

                <p className="mt-5 max-w-[680px] text-[14px] leading-7 text-black/62 sm:text-[15px] md:text-base">
                  {intro}
                </p>
              </div>

              <div className="flex flex-col justify-end">
                <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-black/10 pt-5 sm:grid-cols-3 lg:grid-cols-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      Brand
                    </p>
                    <p className="mt-2 text-lg leading-none tracking-[-0.03em] sm:text-2xl">
                      Petsaco
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      Support
                    </p>
                    <p className="mt-2 text-sm leading-none tracking-[-0.02em] sm:text-base">
                      sales@petsaco.com
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      Updated
                    </p>
                    <p className="mt-2 text-lg leading-none tracking-[-0.03em] sm:text-2xl">
                      2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-10 pt-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 lg:pt-12">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border border-black/10 bg-[#e6e2dc]">
                <div className="border-b border-black/10 px-5 py-5 sm:px-6">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-black/45">
                    Navigate
                  </p>
                </div>

                <nav className="flex flex-col px-5 py-4 sm:px-6">
                  <Link
                    href="/privacy"
                    className="border-b border-black/10 py-3 text-[11px] uppercase tracking-[0.18em] text-black/70 transition hover:text-black"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="border-b border-black/10 py-3 text-[11px] uppercase tracking-[0.18em] text-black/70 transition hover:text-black"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/refunds"
                    className="border-b border-black/10 py-3 text-[11px] uppercase tracking-[0.18em] text-black/70 transition hover:text-black"
                  >
                    Refund Policy
                  </Link>
                  <Link
                    href="/shipping"
                    className="border-b border-black/10 py-3 text-[11px] uppercase tracking-[0.18em] text-black/70 transition hover:text-black"
                  >
                    shipping{" "}
                  </Link>
                  <Link
                    href="/contact"
                    className="py-3 text-[11px] uppercase tracking-[0.18em] text-black/70 transition hover:text-black"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/about"
                    className="py-3 text-[11px] uppercase tracking-[0.18em] text-black/70 transition hover:text-black"
                  >
                    about
                  </Link>
                </nav>
              </div>
            </aside>

            <div className="border border-black/10 bg-[#e6e2dc]">
              <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
                <div className="space-y-10">{children}</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ScrollSection>
  );
}
