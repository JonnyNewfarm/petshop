"use client";

import { forwardRef, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import Link from "next/link";

gsap.registerPlugin(Observer);

type Slide = {
  label: "Dogs" | "Cats";
  leftImage: string;
  rightImage: string;
  title: string;
  text: string;
  cta: string;
  meta: string;
  bg: string;
  textColor: string;
};

const slides: Slide[] = [
  {
    label: "Dogs",
    leftImage: "/processed_dog-11.jpeg",
    rightImage: "/processed_dog-22.jpeg",
    title: "Dogs",
    text: "Walk, rest and play essentials for everyday dog life.",
    cta: "Shop dogs",
    meta: "Canine goods",
    bg: "#8f3a32",
    textColor: "#f1e9dc",
  },
  {
    label: "Cats",
    leftImage: "/processed_cat-11.jpeg",
    rightImage: "/processed_cat-22.jpeg",
    title: "Cats",
    text: "Soft, useful objects for sleep, scratch and sunlit corners.",
    cta: "Shop cats",
    meta: "Feline goods",
    bg: "#ded8cc",
    textColor: "#111111",
  },
];

const grainSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer>
      <feFuncA type="table" tableValues="0 0.85"/>
    </feComponentTransfer>
  </filter>
  <rect width="220" height="220" filter="url(#noise)" opacity="1"/>
</svg>
`;

const grainDataUrl = `url("data:image/svg+xml,${encodeURIComponent(grainSvg)}")`;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const introLeftBlankRef = useRef<HTMLDivElement | null>(null);
  const introRightBlankRef = useRef<HTMLDivElement | null>(null);

  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobileLandscape = () =>
        window.matchMedia("(orientation: landscape)").matches &&
        window.innerHeight <= 500;

      const isMobile = () => window.innerWidth < 768 || isMobileLandscape();

      const allPanels = [
        ...leftRefs.current,
        ...rightRefs.current,
        ...cardRefs.current,
        ...titleRefs.current,
        introLeftBlankRef.current,
        introRightBlankRef.current,
      ].filter(Boolean);

      gsap.set(allPanels, {
        force3D: true,
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      });

      const placeInactive = (index: number) => {
        const mobile = isMobile();

        gsap.set(leftRefs.current[index], {
          xPercent: mobile ? 100 : 0,
          yPercent: mobile ? 0 : 100,
          zIndex: 1,
          autoAlpha: 0,
          scale: 1,
        });

        gsap.set(rightRefs.current[index], {
          xPercent: mobile ? -100 : 0,
          yPercent: mobile ? 0 : -100,
          zIndex: 1,
          autoAlpha: 0,
          scale: 1,
        });

        gsap.set(cardRefs.current[index], {
          yPercent: 100,
          zIndex: 1,
          autoAlpha: 0,
        });

        gsap.set(titleRefs.current[index], {
          yPercent: 100,
          opacity: 0,
          zIndex: 1,
          autoAlpha: 0,
        });
      };

      const placeActive = (index: number) => {
        gsap.set(leftRefs.current[index], {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
          scale: 1,
        });

        gsap.set(rightRefs.current[index], {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
          scale: 1,
        });

        gsap.set(cardRefs.current[index], {
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
        });

        gsap.set(titleRefs.current[index], {
          yPercent: 0,
          opacity: 1,
          zIndex: 2,
          autoAlpha: 1,
        });
      };

      slides.forEach((_, index) => {
        if (index === currentIndexRef.current) {
          placeActive(index);
        } else {
          placeInactive(index);
        }
      });

      gsap.set(titleRefs.current[0], {
        y: 40,
        opacity: 0,
      });

      gsap.set(cardRefs.current[0], {
        y: 40,
        opacity: 0,
      });

      gsap.set([leftRefs.current[0], rightRefs.current[0]], {
        scale: 1.08,
      });

      gsap.set(introLeftBlankRef.current, {
        xPercent: 0,
        yPercent: 0,
        autoAlpha: 1,
      });

      gsap.set(introRightBlankRef.current, {
        xPercent: 0,
        yPercent: 0,
        autoAlpha: 1,
      });

      const introTl = gsap.timeline({
        defaults: {
          ease: "power4.inOut",
          force3D: true,
        },
      });

      introTl
        .to(
          introLeftBlankRef.current,
          {
            yPercent: -100,
            duration: 1.15,
          },
          0.15,
        )
        .to(
          introRightBlankRef.current,
          {
            yPercent: 100,
            duration: 1.15,
          },
          0.15,
        )
        .to(
          [leftRefs.current[0], rightRefs.current[0]],
          {
            scale: 1,
            duration: 1.35,
          },
          0.15,
        )
        .to(
          titleRefs.current[0],
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
          },
          0.72,
        )
        .to(
          cardRefs.current[0],
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
          },
          0.82,
        )
        .set([introLeftBlankRef.current, introRightBlankRef.current], {
          autoAlpha: 0,
        });

      const goToSlide = (direction: 1 | -1) => {
        if (isAnimatingRef.current) return;

        isAnimatingRef.current = true;

        const mobile = isMobile();
        const current = currentIndexRef.current;

        const next =
          direction === 1
            ? (current + 1) % slides.length
            : (current - 1 + slides.length) % slides.length;

        const currentLeft = leftRefs.current[current];
        const currentRight = rightRefs.current[current];
        const currentCard = cardRefs.current[current];
        const currentTitle = titleRefs.current[current];

        const nextLeft = leftRefs.current[next];
        const nextRight = rightRefs.current[next];
        const nextCard = cardRefs.current[next];
        const nextTitle = titleRefs.current[next];

        gsap.killTweensOf([
          currentLeft,
          currentRight,
          currentCard,
          currentTitle,
          nextLeft,
          nextRight,
          nextCard,
          nextTitle,
        ]);

        gsap.set(currentLeft, {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
          scale: 1,
        });

        gsap.set(currentRight, {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
          scale: 1,
        });

        gsap.set(currentCard, {
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
        });

        gsap.set(currentTitle, {
          yPercent: 0,
          opacity: 1,
          zIndex: 2,
          autoAlpha: 1,
        });

        if (mobile) {
          gsap.set(nextLeft, {
            xPercent: direction === 1 ? 100 : -100,
            yPercent: 0,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
          });

          gsap.set(nextRight, {
            xPercent: direction === 1 ? -100 : 100,
            yPercent: 0,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
          });
        } else {
          gsap.set(nextLeft, {
            xPercent: 0,
            yPercent: direction === 1 ? 100 : -100,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
          });

          gsap.set(nextRight, {
            xPercent: 0,
            yPercent: direction === 1 ? -100 : 100,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
          });
        }

        gsap.set(nextCard, {
          yPercent: direction === 1 ? 100 : -100,
          zIndex: 3,
          autoAlpha: 1,
        });

        gsap.set(nextTitle, {
          yPercent: direction === 1 ? 100 : -100,
          opacity: 1,
          zIndex: 3,
          autoAlpha: 1,
        });

        const tl = gsap.timeline({
          defaults: {
            duration: 1.1,
            ease: "power4.inOut",
            force3D: true,
          },
          onComplete: () => {
            currentIndexRef.current = next;

            gsap.set(currentLeft, {
              autoAlpha: 0,
              zIndex: 1,
            });

            gsap.set(currentRight, {
              autoAlpha: 0,
              zIndex: 1,
            });

            gsap.set(currentCard, {
              autoAlpha: 0,
              zIndex: 1,
            });

            gsap.set(currentTitle, {
              autoAlpha: 0,
              opacity: 0,
              zIndex: 1,
            });

            gsap.set(nextLeft, {
              xPercent: 0,
              yPercent: 0,
              zIndex: 2,
              autoAlpha: 1,
              scale: 1,
            });

            gsap.set(nextRight, {
              xPercent: 0,
              yPercent: 0,
              zIndex: 2,
              autoAlpha: 1,
              scale: 1,
            });

            gsap.set(nextCard, {
              yPercent: 0,
              zIndex: 2,
              autoAlpha: 1,
            });

            gsap.set(nextTitle, {
              yPercent: 0,
              opacity: 1,
              zIndex: 2,
              autoAlpha: 1,
            });

            isAnimatingRef.current = false;
          },
        });

        if (mobile) {
          tl.to(
            currentLeft,
            {
              xPercent: direction === 1 ? -100 : 100,
              yPercent: 0,
            },
            0,
          )
            .to(
              nextLeft,
              {
                xPercent: 0,
                yPercent: 0,
              },
              0,
            )
            .to(
              currentRight,
              {
                xPercent: direction === 1 ? 100 : -100,
                yPercent: 0,
              },
              0,
            )
            .to(
              nextRight,
              {
                xPercent: 0,
                yPercent: 0,
              },
              0,
            );
        } else {
          tl.to(
            currentLeft,
            {
              xPercent: 0,
              yPercent: direction === 1 ? -100 : 100,
            },
            0,
          )
            .to(
              nextLeft,
              {
                xPercent: 0,
                yPercent: 0,
              },
              0,
            )
            .to(
              currentRight,
              {
                xPercent: 0,
                yPercent: direction === 1 ? 100 : -100,
              },
              0,
            )
            .to(
              nextRight,
              {
                xPercent: 0,
                yPercent: 0,
              },
              0,
            );
        }

        tl.to(
          currentCard,
          {
            yPercent: direction === 1 ? -100 : 100,
          },
          0,
        )
          .to(
            nextCard,
            {
              yPercent: 0,
            },
            0,
          )
          .to(
            currentTitle,
            {
              yPercent: direction === 1 ? -100 : 100,
              opacity: 0,
            },
            0,
          )
          .to(
            nextTitle,
            {
              yPercent: 0,
              opacity: 1,
            },
            0,
          );
      };

      const observer = Observer.create({
        target: sectionRef.current,
        type: "wheel,touch,pointer",
        tolerance: 18,
        preventDefault: true,
        onDown: () => goToSlide(1),
        onUp: () => goToSlide(-1),
      });

      const handleResize = () => {
        if (isAnimatingRef.current) return;

        const current = currentIndexRef.current;

        slides.forEach((_, index) => {
          if (index === current) {
            placeActive(index);
          } else {
            placeInactive(index);
          }
        });
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);

      return () => {
        observer.kill();
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] overflow-hidden bg-black text-white"
    >
      <div className="grid h-full grid-rows-2 md:grid-cols-2 md:grid-rows-none [@media_(orientation:landscape)_and_(max-height:500px)]:grid-cols-2 [@media_(orientation:landscape)_and_(max-height:500px)]:grid-rows-none">
        <div className="relative h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={`left-${slide.label}`}
              ref={(el) => {
                leftRefs.current[index] = el;
              }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={slide.leftImage}
                alt={`${slide.label} top`}
                fill
                priority
                draggable={false}
                sizes="(max-width: 767px) 100vw, 50vw"
                className="select-none object-cover contrast-[1.08] saturate-[0.9] sepia-[0.12]"
              />

              <div className="absolute inset-0 bg-black/15" />

              <div className="absolute inset-0 hidden bg-[#b88a5f]/15 mix-blend-soft-light md:block" />
            </div>
          ))}

          <div
            ref={introLeftBlankRef}
            className="pointer-events-none absolute inset-0 z-20 will-change-transform"
            style={{
              backgroundColor: "#ded8cc",
            }}
          >
            <div
              className="absolute inset-0 hidden opacity-[0.26] mix-blend-multiply md:block"
              style={{
                backgroundImage: grainDataUrl,
                backgroundSize: "120px 120px",
              }}
            />
          </div>
        </div>

        <div className="relative h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={`right-${slide.label}`}
              ref={(el) => {
                rightRefs.current[index] = el;
              }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={slide.rightImage}
                alt={`${slide.label} bottom`}
                fill
                priority
                draggable={false}
                sizes="(max-width: 767px) 100vw, 50vw"
                className="select-none object-cover contrast-[1.08] saturate-[0.9] sepia-[0.12]"
              />

              <div className="absolute inset-0 bg-black/15" />

              <div className="absolute inset-0 hidden bg-[#b88a5f]/15 mix-blend-soft-light md:block" />
            </div>
          ))}

          <div
            ref={introRightBlankRef}
            className="pointer-events-none absolute inset-0 z-20 will-change-transform"
            style={{
              backgroundColor: "#ded8cc",
            }}
          >
            <div
              className="absolute inset-0 hidden opacity-[0.26] mix-blend-multiply md:block"
              style={{
                backgroundImage: grainDataUrl,
                backgroundSize: "120px 120px",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-[-20%] z-30 hidden opacity-[0.42] mix-blend-overlay md:block"
        style={{
          backgroundImage: grainDataUrl,
          backgroundSize: "180px 180px",
          animation: "petsaco-grain 0.45s steps(2) infinite",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-30 hidden opacity-[0.18] mix-blend-multiply md:block"
        style={{
          backgroundImage: grainDataUrl,
          backgroundSize: "90px 90px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-30 hidden bg-[#c79a6b]/10 mix-blend-soft-light md:block" />

      <div className="pointer-events-none absolute bottom-[calc(13rem+env(safe-area-inset-bottom))] left-4 z-40 h-[clamp(2.8rem,15vw,5.5rem)] overflow-hidden md:bottom-6 md:left-8 md:h-[clamp(4rem,15vw,16rem)] [@media_(orientation:landscape)_and_(max-height:500px)]:bottom-4 [@media_(orientation:landscape)_and_(max-height:500px)]:left-4 [@media_(orientation:landscape)_and_(max-height:500px)]:h-[3.5rem]">
        {slides.map((slide, index) => (
          <h1
            key={`title-${slide.label}`}
            ref={(el) => {
              titleRefs.current[index] = el;
            }}
            className="absolute left-0 top-0 text-[clamp(2.8rem,15vw,5.5rem)] font-semibold uppercase leading-[0.75] tracking-[-0.09em] will-change-transform md:text-[clamp(4rem,15vw,16rem)] [@media_(orientation:landscape)_and_(max-height:500px)]:text-[3.5rem]"
          >
            {slide.label}
          </h1>
        ))}
      </div>

      <div className="absolute bottom-[calc(2.8rem+env(safe-area-inset-bottom))] right-4 z-50 h-[115px] w-[250px] max-w-[calc(100%-2rem)] overflow-hidden md:bottom-8 md:right-8 md:h-[160px] md:w-[360px] [@media_(orientation:landscape)_and_(max-height:500px)]:bottom-4 [@media_(orientation:landscape)_and_(max-height:500px)]:right-4 [@media_(orientation:landscape)_and_(max-height:500px)]:h-[105px] [@media_(orientation:landscape)_and_(max-height:500px)]:w-[260px]">
        {slides.map((slide, index) => (
          <InfoCard
            key={`card-${slide.label}`}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            slide={slide}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute left-0 top-1/2 z-40 h-px w-full -translate-y-1/2 bg-white/20 md:left-1/2 md:top-0 md:h-full md:w-px md:-translate-x-1/2 md:translate-y-0 [@media_(orientation:landscape)_and_(max-height:500px)]:left-1/2 [@media_(orientation:landscape)_and_(max-height:500px)]:top-0 [@media_(orientation:landscape)_and_(max-height:500px)]:h-full [@media_(orientation:landscape)_and_(max-height:500px)]:w-px [@media_(orientation:landscape)_and_(max-height:500px)]:-translate-x-1/2 [@media_(orientation:landscape)_and_(max-height:500px)]:translate-y-0" />

      <style jsx global>{`
        @keyframes petsaco-grain {
          0% {
            transform: translate3d(0, 0, 0);
          }

          10% {
            transform: translate3d(-5%, -8%, 0);
          }

          20% {
            transform: translate3d(-12%, 6%, 0);
          }

          30% {
            transform: translate3d(8%, -10%, 0);
          }

          40% {
            transform: translate3d(-6%, 12%, 0);
          }

          50% {
            transform: translate3d(10%, 4%, 0);
          }

          60% {
            transform: translate3d(-14%, -4%, 0);
          }

          70% {
            transform: translate3d(6%, 10%, 0);
          }

          80% {
            transform: translate3d(12%, -6%, 0);
          }

          90% {
            transform: translate3d(-8%, 8%, 0);
          }

          100% {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}

const InfoCard = forwardRef<HTMLDivElement, { slide: Slide }>(function InfoCard(
  { slide },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: slide.bg,
        color: slide.textColor,
      }}
      className="absolute inset-0 overflow-hidden border border-black/10 px-3 py-3 backdrop-blur-[2px] will-change-transform md:px-5 md:py-4 [@media_(orientation:landscape)_and_(max-height:500px)]:px-3 [@media_(orientation:landscape)_and_(max-height:500px)]:py-2"
    >
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.22] mix-blend-multiply md:block"
        style={{
          backgroundImage: grainDataUrl,
          backgroundSize: "110px 110px",
        }}
      />

      <Link
        href={
          slide.label === "Dogs"
            ? "/shop?category=dogs&page=1"
            : "/shop?category=cats&page=1"
        }
        className="relative z-10 flex h-full flex-col justify-between"
      >
        <div className="flex items-start justify-between gap-3 md:gap-6 [@media_(orientation:landscape)_and_(max-height:500px)]:gap-3">
          <div>
            <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.18em] opacity-55 md:mb-2 md:text-[9px] md:tracking-[0.22em] [@media_(orientation:landscape)_and_(max-height:500px)]:mb-1 [@media_(orientation:landscape)_and_(max-height:500px)]:text-[7px]">
              Petsaco / {slide.meta}
            </p>

            <h2 className="text-2xl font-semibold uppercase leading-[0.85] tracking-[-0.07em] md:text-3xl [@media_(orientation:landscape)_and_(max-height:500px)]:text-xl">
              {slide.title}
            </h2>
          </div>

          <span className="hidden text-sm leading-none opacity-65 sm:block md:text-lg [@media_(orientation:landscape)_and_(max-height:500px)]:text-sm">
            ↗
          </span>
        </div>

        <div>
          <p className="mb-2 max-w-[13rem] text-[10px] font-medium leading-snug opacity-70 md:mb-3 md:max-w-[15rem] md:text-xs [@media_(orientation:landscape)_and_(max-height:500px)]:mb-1 [@media_(orientation:landscape)_and_(max-height:500px)]:max-w-[12rem] [@media_(orientation:landscape)_and_(max-height:500px)]:text-[9px]">
            {slide.text}
          </p>

          <div className="flex items-center justify-between border-t border-current/20 pt-2 md:pt-3 [@media_(orientation:landscape)_and_(max-height:500px)]:pt-1.5">
            <p className="text-[7px] font-semibold uppercase tracking-[0.18em] opacity-80 transition hover:opacity-50 md:text-[9px] md:tracking-[0.22em] [@media_(orientation:landscape)_and_(max-height:500px)]:text-[7px]">
              {slide.cta}
            </p>

            <span className="text-[7px] uppercase tracking-[0.18em] opacity-45 md:text-[9px] md:tracking-[0.22em] [@media_(orientation:landscape)_and_(max-height:500px)]:text-[7px]">
              {slide.label}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
});
