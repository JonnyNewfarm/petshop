"use client";

import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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

  const leftCurrentRef = useRef<HTMLDivElement | null>(null);
  const leftNextRef = useRef<HTMLDivElement | null>(null);

  const rightCurrentRef = useRef<HTMLDivElement | null>(null);
  const rightNextRef = useRef<HTMLDivElement | null>(null);

  const cardCurrentRef = useRef<HTMLDivElement | null>(null);
  const cardNextRef = useRef<HTMLDivElement | null>(null);

  const titleCurrentRef = useRef<HTMLHeadingElement | null>(null);
  const titleNextRef = useRef<HTMLHeadingElement | null>(null);

  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = () => window.innerWidth < 768;

      const setBaseStyles = () => {
        gsap.set(
          [
            introLeftBlankRef.current,
            introRightBlankRef.current,
            leftCurrentRef.current,
            leftNextRef.current,
            rightCurrentRef.current,
            rightNextRef.current,
            cardCurrentRef.current,
            cardNextRef.current,
            titleCurrentRef.current,
            titleNextRef.current,
          ],
          {
            force3D: true,
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          },
        );
      };

      const resetPanels = () => {
        const mobile = isMobile();

        gsap.set(leftCurrentRef.current, {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
          scale: 1,
        });

        gsap.set(rightCurrentRef.current, {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
          scale: 1,
        });

        if (mobile) {
          gsap.set(leftNextRef.current, {
            xPercent: 100,
            yPercent: 0,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
          });

          gsap.set(rightNextRef.current, {
            xPercent: -100,
            yPercent: 0,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
          });
        } else {
          gsap.set(leftNextRef.current, {
            xPercent: 0,
            yPercent: 100,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
          });

          gsap.set(rightNextRef.current, {
            xPercent: 0,
            yPercent: -100,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
          });
        }

        gsap.set(cardCurrentRef.current, {
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
        });

        gsap.set(cardNextRef.current, {
          yPercent: 100,
          zIndex: 3,
          autoAlpha: 1,
        });

        gsap.set(titleCurrentRef.current, {
          yPercent: 0,
          opacity: 1,
        });

        gsap.set(titleNextRef.current, {
          yPercent: 100,
          opacity: 1,
        });
      };

      setBaseStyles();
      resetPanels();

      gsap.set([titleCurrentRef.current, cardCurrentRef.current], {
        y: 40,
        opacity: 0,
      });

      gsap.set([leftCurrentRef.current, rightCurrentRef.current], {
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
          [leftCurrentRef.current, rightCurrentRef.current],
          {
            scale: 1,
            duration: 1.35,
          },
          0.15,
        )
        .to(
          titleCurrentRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
          },
          0.72,
        )
        .to(
          cardCurrentRef.current,
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

        flushSync(() => {
          setNextIndex(next);
        });

        gsap.set(leftCurrentRef.current, {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
        });

        gsap.set(rightCurrentRef.current, {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
        });

        if (mobile) {
          gsap.set(leftNextRef.current, {
            xPercent: direction === 1 ? 100 : -100,
            yPercent: 0,
            zIndex: 3,
            autoAlpha: 1,
          });

          gsap.set(rightNextRef.current, {
            xPercent: direction === 1 ? -100 : 100,
            yPercent: 0,
            zIndex: 3,
            autoAlpha: 1,
          });
        } else {
          gsap.set(leftNextRef.current, {
            xPercent: 0,
            yPercent: direction === 1 ? 100 : -100,
            zIndex: 3,
            autoAlpha: 1,
          });

          gsap.set(rightNextRef.current, {
            xPercent: 0,
            yPercent: direction === 1 ? -100 : 100,
            zIndex: 3,
            autoAlpha: 1,
          });
        }

        gsap.set(cardCurrentRef.current, {
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
        });

        gsap.set(cardNextRef.current, {
          yPercent: direction === 1 ? 100 : -100,
          zIndex: 3,
          autoAlpha: 1,
        });

        gsap.set(titleCurrentRef.current, {
          yPercent: 0,
          opacity: 1,
        });

        gsap.set(titleNextRef.current, {
          yPercent: direction === 1 ? 100 : -100,
          opacity: 1,
        });

        const tl = gsap.timeline({
          defaults: {
            duration: 1.1,
            ease: "power4.inOut",
            force3D: true,
          },
          onComplete: () => {
            currentIndexRef.current = next;

            flushSync(() => {
              setCurrentIndex(next);
              setNextIndex((next + 1) % slides.length);
            });

            resetPanels();

            isAnimatingRef.current = false;
          },
        });

        if (mobile) {
          tl.to(
            leftCurrentRef.current,
            {
              xPercent: direction === 1 ? -100 : 100,
              yPercent: 0,
            },
            0,
          )
            .to(
              leftNextRef.current,
              {
                xPercent: 0,
                yPercent: 0,
              },
              0,
            )
            .to(
              rightCurrentRef.current,
              {
                xPercent: direction === 1 ? 100 : -100,
                yPercent: 0,
              },
              0,
            )
            .to(
              rightNextRef.current,
              {
                xPercent: 0,
                yPercent: 0,
              },
              0,
            );
        } else {
          tl.to(
            leftCurrentRef.current,
            {
              xPercent: 0,
              yPercent: direction === 1 ? -100 : 100,
            },
            0,
          )
            .to(
              leftNextRef.current,
              {
                xPercent: 0,
                yPercent: 0,
              },
              0,
            )
            .to(
              rightCurrentRef.current,
              {
                xPercent: 0,
                yPercent: direction === 1 ? 100 : -100,
              },
              0,
            )
            .to(
              rightNextRef.current,
              {
                xPercent: 0,
                yPercent: 0,
              },
              0,
            );
        }

        tl.to(
          cardCurrentRef.current,
          {
            yPercent: direction === 1 ? -100 : 100,
          },
          0,
        )
          .to(
            cardNextRef.current,
            {
              yPercent: 0,
            },
            0,
          )
          .to(
            titleCurrentRef.current,
            {
              yPercent: direction === 1 ? -100 : 100,
              opacity: 0,
            },
            0,
          )
          .to(
            titleNextRef.current,
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
        resetPanels();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        observer.kill();
        window.removeEventListener("resize", handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const current = slides[currentIndex];
  const next = slides[nextIndex];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-black text-white"
    >
      <div className="grid h-full grid-rows-2 md:grid-cols-2 md:grid-rows-none">
        <div className="relative h-full overflow-hidden  md:h-screen ">
          <div
            ref={leftCurrentRef}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={current.leftImage}
              alt={`${current.label} top`}
              fill
              priority
              draggable={false}
              sizes="(max-width: 767px) 100vw, 50vw"
              className="select-none object-cover contrast-[1.08] saturate-[0.9] sepia-[0.12]"
            />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 bg-[#b88a5f]/15 mix-blend-soft-light" />
          </div>

          <div
            ref={leftNextRef}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={next.leftImage}
              alt={`${next.label} top`}
              fill
              priority
              draggable={false}
              sizes="(max-width: 767px) 100vw, 50vw"
              className="select-none object-cover contrast-[1.08] saturate-[0.9] sepia-[0.12]"
            />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 bg-[#b88a5f]/15 mix-blend-soft-light" />
          </div>

          <div
            ref={introLeftBlankRef}
            className="pointer-events-none absolute inset-0 z-20 will-change-transform"
            style={{
              backgroundColor: "#ded8cc",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.26] mix-blend-multiply"
              style={{
                backgroundImage: grainDataUrl,
                backgroundSize: "120px 120px",
              }}
            />
          </div>
        </div>

        <div className="relative h-full overflow-hidden md:h-screen">
          <div
            ref={rightCurrentRef}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={current.rightImage}
              alt={`${current.label} bottom`}
              fill
              priority
              draggable={false}
              sizes="(max-width: 767px) 100vw, 50vw"
              className="select-none object-cover contrast-[1.08] saturate-[0.9] sepia-[0.12]"
            />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 bg-[#b88a5f]/15 mix-blend-soft-light" />
          </div>

          <div
            ref={rightNextRef}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={next.rightImage}
              alt={`${next.label} bottom`}
              fill
              priority
              draggable={false}
              sizes="(max-width: 767px) 100vw, 50vw"
              className="select-none object-cover contrast-[1.08] saturate-[0.9] sepia-[0.12]"
            />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 bg-[#b88a5f]/15 mix-blend-soft-light" />
          </div>

          <div
            ref={introRightBlankRef}
            className="pointer-events-none absolute inset-0 z-20 will-change-transform"
            style={{
              backgroundColor: "#ded8cc",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.26] mix-blend-multiply"
              style={{
                backgroundImage: grainDataUrl,
                backgroundSize: "120px 120px",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-[-20%] z-30 opacity-[0.42] mix-blend-overlay"
        style={{
          backgroundImage: grainDataUrl,
          backgroundSize: "180px 180px",
          animation: "petsaco-grain 0.45s steps(2) infinite",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.18] mix-blend-multiply"
        style={{
          backgroundImage: grainDataUrl,
          backgroundSize: "90px 90px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-30 bg-[#c79a6b]/10 mix-blend-soft-light" />

      <div className="pointer-events-none absolute bottom-[9rem] left-4 z-40 h-[clamp(2.8rem,15vw,5.5rem)] overflow-hidden md:bottom-6 md:left-8 md:h-[clamp(4rem,15vw,16rem)]">
        <h1
          ref={titleCurrentRef}
          className="absolute left-0 top-0 text-[clamp(2.8rem,15vw,5.5rem)] font-semibold uppercase leading-[0.75] tracking-[-0.09em] will-change-transform md:text-[clamp(4rem,15vw,16rem)]"
        >
          {current.label}
        </h1>

        <h1
          ref={titleNextRef}
          className="absolute left-0 top-0 text-[clamp(2.8rem,15vw,5.5rem)] font-semibold uppercase leading-[0.75] tracking-[-0.09em] will-change-transform md:text-[clamp(4rem,15vw,16rem)]"
        >
          {next.label}
        </h1>
      </div>

      <div className="absolute bottom-4 right-4 z-50 h-[115px] w-[250px] max-w-[calc(100%-2rem)] overflow-hidden md:bottom-8 md:right-8 md:h-[160px] md:w-[360px]">
        <InfoCard ref={cardCurrentRef} slide={current} />
        <InfoCard ref={cardNextRef} slide={next} />
      </div>

      <div className="pointer-events-none absolute left-0 top-1/2 z-40 h-px w-full -translate-y-1/2 bg-white/20 md:left-1/2 md:top-0 md:h-full md:w-px md:-translate-x-1/2 md:translate-y-0" />

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
      className="absolute inset-0 overflow-hidden border border-black/10 px-3 py-3 backdrop-blur-[2px] will-change-transform md:px-5 md:py-4"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
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
        <div className="flex items-start justify-between gap-3 md:gap-6">
          <div>
            <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.18em] opacity-55 md:mb-2 md:text-[9px] md:tracking-[0.22em]">
              Petsaco / {slide.meta}
            </p>

            <h2 className="text-2xl font-semibold uppercase leading-[0.85] tracking-[-0.07em] md:text-3xl">
              {slide.title}
            </h2>
          </div>

          <span className="text-sm leading-none opacity-65 md:text-lg">↗</span>
        </div>

        <div>
          <p className="mb-2 max-w-[13rem] text-[10px] font-medium leading-snug opacity-70 md:mb-3 md:max-w-[15rem] md:text-xs">
            {slide.text}
          </p>

          <div className="flex items-center justify-between border-t border-current/20 pt-2 md:pt-3">
            <p className="text-[7px] font-semibold uppercase tracking-[0.18em] opacity-80 transition hover:opacity-50 md:text-[9px] md:tracking-[0.22em]">
              {slide.cta}
            </p>

            <span className="text-[7px] uppercase tracking-[0.18em] opacity-45 md:text-[9px] md:tracking-[0.22em]">
              {slide.label}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
});
