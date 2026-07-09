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
  text: string;
  cta: string;
  meta: string;
};

const PRELOADER_STORAGE_KEY = "petsaco-hero-preloader-played";

const slides: Slide[] = [
  {
    label: "Dogs",
    leftImage: "/processed_dog-11.jpeg",
    rightImage: "/processed_dog-22.jpeg",
    text: "Walk, rest and play essentials for everyday dog life.",
    cta: "Shop dogs",
    meta: "Canine goods",
  },
  {
    label: "Cats",
    leftImage: "/processed_cat-11.jpeg",
    rightImage: "/processed_cat-22.jpeg",
    text: "Soft, useful objects for sleep, scratch and sunlit corners.",
    cta: "Shop cats",
    meta: "Feline goods",
  },
];

const grainSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
  <filter id="noise">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="1.15"
      numOctaves="5"
      stitchTiles="stitch"
    />
    <feColorMatrix type="saturate" values="0" />
    <feComponentTransfer>
      <feFuncR type="linear" slope="1" />
      <feFuncG type="linear" slope="1" />
      <feFuncB type="linear" slope="1" />
      <feFuncA type="table" tableValues="0 0.9" />
    </feComponentTransfer>
  </filter>
  <rect width="220" height="220" filter="url(#noise)" opacity="1"/>
</svg>
`;

const grainDataUrl = `url("data:image/svg+xml,${encodeURIComponent(grainSvg)}")`;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const preloaderRef = useRef<HTMLDivElement | null>(null);

  const introBrandRef = useRef<HTMLDivElement | null>(null);
  const introBrandTextRef = useRef<HTMLHeadingElement | null>(null);
  const introLeftBlankRef = useRef<HTMLDivElement | null>(null);
  const introRightBlankRef = useRef<HTMLDivElement | null>(null);

  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobileLandscape = () =>
        window.matchMedia("(orientation: landscape)").matches &&
        window.innerHeight <= 500;

      const isMobile = () => window.innerWidth < 768 || isMobileLandscape();

      const shouldPlayPreloader = (() => {
        try {
          return sessionStorage.getItem(PRELOADER_STORAGE_KEY) !== "true";
        } catch {
          return true;
        }
      })();

      const markPreloaderAsPlayed = () => {
        try {
          sessionStorage.setItem(PRELOADER_STORAGE_KEY, "true");
        } catch {}
      };

      const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const SCRAMBLE_DURATION = 1.65;
      const SCRAMBLE_TICK = 0.085;

      const getRandomChar = () =>
        SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];

      const scrambleText = (element: HTMLElement | null, finalText: string) => {
        if (!element) return gsap.timeline();

        const letters = finalText.split("");
        const randomLetters = letters.map(() => getRandomChar());

        const state = {
          progress: 0,
        };

        let lastTick = -1;

        element.textContent = randomLetters.join("");

        return gsap.to(state, {
          progress: 1,
          duration: SCRAMBLE_DURATION,
          ease: "power2.out",
          onUpdate: () => {
            const currentTime = state.progress * SCRAMBLE_DURATION;
            const currentTick = Math.floor(currentTime / SCRAMBLE_TICK);

            if (currentTick !== lastTick) {
              lastTick = currentTick;

              for (let i = 0; i < randomLetters.length; i += 1) {
                randomLetters[i] = getRandomChar();
              }
            }

            const output = letters
              .map((letter, index) => {
                const lockStart = 0.38;
                const lockEnd = 0.88;
                const letterProgress =
                  letters.length === 1 ? 1 : index / (letters.length - 1);

                const lockAt =
                  lockStart + (lockEnd - lockStart) * letterProgress;

                if (state.progress >= lockAt) {
                  return letter;
                }

                return randomLetters[index];
              })
              .join("");

            element.textContent = output;
          },
          onComplete: () => {
            element.textContent = finalText;
          },
        });
      };

      const allPanels = [
        ...leftRefs.current,
        ...rightRefs.current,
        ...cardRefs.current,
        introBrandRef.current,
        introBrandTextRef.current,
        introLeftBlankRef.current,
        introRightBlankRef.current,
        preloaderRef.current,
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
          filter: "blur(0px)",
        });

        gsap.set(rightRefs.current[index], {
          xPercent: mobile ? -100 : 0,
          yPercent: mobile ? 0 : -100,
          zIndex: 1,
          autoAlpha: 0,
          scale: 1,
          filter: "blur(0px)",
        });

        gsap.set(cardRefs.current[index], {
          y: 24,
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
          filter: "blur(0px)",
        });

        gsap.set(rightRefs.current[index], {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
        });

        gsap.set(cardRefs.current[index], {
          y: 0,
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

      if (shouldPlayPreloader) {
        markPreloaderAsPlayed();

        gsap.set(cardRefs.current[0], {
          y: 30,
          opacity: 0,
          autoAlpha: 0,
        });

        gsap.set([leftRefs.current[0], rightRefs.current[0]], {
          scale: 1.12,
          filter: "blur(8px)",
        });

        gsap.set(introLeftBlankRef.current, {
          xPercent: 0,
          yPercent: 0,
          autoAlpha: 1,
          display: "block",
        });

        gsap.set(introRightBlankRef.current, {
          xPercent: 0,
          yPercent: 0,
          autoAlpha: 1,
          display: "block",
        });

        gsap.set(preloaderRef.current, {
          autoAlpha: 1,
          display: "block",
        });

        gsap.set(introBrandRef.current, {
          y: 30,
          autoAlpha: 0,
        });

        gsap.set(introBrandTextRef.current, {
          autoAlpha: 1,
        });

        if (introBrandTextRef.current) {
          introBrandTextRef.current.textContent = "XXXXXXX";
        }

        const introTl = gsap.timeline({
          defaults: {
            ease: "power4.inOut",
            force3D: true,
          },
        });

        introTl
          .add(() => {
            scrambleText(introBrandTextRef.current, "Petsaco");
          })
          .to(introBrandRef.current, {
            y: 0,
            autoAlpha: 1,
            duration: 0.22,
            ease: "power3.out",
          })
          .to(
            {},
            {
              duration: 1.55,
            },
          );

        introTl
          .to(
            preloaderRef.current,
            {
              autoAlpha: 0,
              duration: 0.22,
              ease: "power2.out",
            },
            "+=0.02",
          )
          .to(
            introLeftBlankRef.current,
            {
              yPercent: -100,
              duration: 0.82,
              ease: "expo.inOut",
            },
            "-=0.08",
          )
          .to(
            introRightBlankRef.current,
            {
              yPercent: 100,
              duration: 0.82,
              ease: "expo.inOut",
            },
            "<",
          )
          .to(
            [leftRefs.current[0], rightRefs.current[0]],
            {
              scale: 1,
              filter: "blur(0px)",
              duration: 0.95,
              ease: "expo.out",
            },
            "<",
          )
          .to(
            cardRefs.current[0],
            {
              y: 0,
              opacity: 1,
              autoAlpha: 1,
              duration: 0.72,
              ease: "power4.out",
            },
            "-=0.62",
          )
          .set([introLeftBlankRef.current, introRightBlankRef.current], {
            autoAlpha: 0,
            display: "none",
          })
          .set(preloaderRef.current, {
            autoAlpha: 0,
            display: "none",
          });
      } else {
        gsap.set(preloaderRef.current, {
          autoAlpha: 0,
          display: "none",
        });

        gsap.set([introLeftBlankRef.current, introRightBlankRef.current], {
          autoAlpha: 0,
          display: "none",
        });

        gsap.set(introBrandRef.current, {
          y: 0,
          autoAlpha: 0,
        });

        if (introBrandTextRef.current) {
          introBrandTextRef.current.textContent = "Petsaco";
        }

        placeActive(currentIndexRef.current);
      }

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

        const nextLeft = leftRefs.current[next];
        const nextRight = rightRefs.current[next];
        const nextCard = cardRefs.current[next];

        gsap.killTweensOf([
          currentLeft,
          currentRight,
          currentCard,
          nextLeft,
          nextRight,
          nextCard,
        ]);

        gsap.set(currentLeft, {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
        });

        gsap.set(currentRight, {
          xPercent: 0,
          yPercent: 0,
          zIndex: 2,
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
        });

        gsap.set(currentCard, {
          y: 0,
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
            filter: "blur(0px)",
          });

          gsap.set(nextRight, {
            xPercent: direction === 1 ? -100 : 100,
            yPercent: 0,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
          });
        } else {
          gsap.set(nextLeft, {
            xPercent: 0,
            yPercent: direction === 1 ? 100 : -100,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
          });

          gsap.set(nextRight, {
            xPercent: 0,
            yPercent: direction === 1 ? -100 : 100,
            zIndex: 3,
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
          });
        }

        gsap.set(nextCard, {
          y: direction === 1 ? 24 : -24,
          opacity: 0,
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
              opacity: 0,
              zIndex: 1,
            });

            gsap.set(nextLeft, {
              xPercent: 0,
              yPercent: 0,
              zIndex: 2,
              autoAlpha: 1,
              scale: 1,
              filter: "blur(0px)",
            });

            gsap.set(nextRight, {
              xPercent: 0,
              yPercent: 0,
              zIndex: 2,
              autoAlpha: 1,
              scale: 1,
              filter: "blur(0px)",
            });

            gsap.set(nextCard, {
              y: 0,
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
            y: direction === 1 ? -24 : 24,
            opacity: 0,
            duration: 0.45,
            ease: "power3.out",
          },
          0,
        ).to(
          nextCard,
          {
            y: 0,
            opacity: 1,
            duration: 0.68,
            ease: "power3.out",
          },
          0.34,
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
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden will-change-transform"
            style={{
              backgroundColor: "#ded8cc",
            }}
          >
            <div
              className="absolute inset-[-30%] opacity-[0.52] mix-blend-multiply"
              style={{
                backgroundImage: grainDataUrl,
                backgroundSize: "82px 82px",
                animation: "petsaco-grain 0.38s steps(2) infinite",
              }}
            />

            <div
              className="absolute inset-[-20%] opacity-[0.34] mix-blend-overlay"
              style={{
                backgroundImage: grainDataUrl,
                backgroundSize: "38px 38px",
              }}
            />

            <div
              className="absolute inset-0 opacity-[0.14] mix-blend-soft-light"
              style={{
                backgroundImage: grainDataUrl,
                backgroundSize: "18px 18px",
              }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3)_0%,rgba(0,0,0,0.1)_100%)]" />

            <div
              ref={introBrandRef}
              className="invisible absolute bottom-4 left-4 z-20 max-w-[calc(100%-2rem)] translate-y-[30px] opacity-0 will-change-transform md:bottom-8 md:left-8 md:max-w-[42vw]"
            >
              <h2
                ref={introBrandTextRef}
                className="text-[clamp(3.8rem,11vw,9rem)] font-semibold uppercase leading-[0.78] tracking-[-0.035em] text-[#963d3a]"
              >
                XXXXXXX
              </h2>
            </div>
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
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden will-change-transform"
            style={{
              backgroundColor: "#ded8cc",
            }}
          >
            <div
              className="absolute inset-[-30%] opacity-[0.52] mix-blend-multiply"
              style={{
                backgroundImage: grainDataUrl,
                backgroundSize: "82px 82px",
                animation: "petsaco-grain 0.38s steps(2) infinite",
              }}
            />

            <div
              className="absolute inset-[-20%] opacity-[0.34] mix-blend-overlay"
              style={{
                backgroundImage: grainDataUrl,
                backgroundSize: "38px 38px",
              }}
            />

            <div
              className="absolute inset-0 opacity-[0.14] mix-blend-soft-light"
              style={{
                backgroundImage: grainDataUrl,
                backgroundSize: "18px 18px",
              }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3)_0%,rgba(0,0,0,0.1)_100%)]" />
          </div>
        </div>
      </div>

      <div
        ref={preloaderRef}
        className="pointer-events-none absolute inset-0 z-[80] overflow-hidden text-black"
      />

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

      <div className="absolute bottom-[calc(2.2rem+env(safe-area-inset-bottom))] right-4 z-50 h-[185px] w-[315px] max-w-[calc(100%-2rem)] overflow-hidden md:bottom-8 md:right-8 md:h-[220px] md:w-[455px] [@media_(orientation:landscape)_and_(max-height:500px)]:bottom-4 [@media_(orientation:landscape)_and_(max-height:500px)]:right-4 [@media_(orientation:landscape)_and_(max-height:500px)]:h-[145px] [@media_(orientation:landscape)_and_(max-height:500px)]:w-[320px]">
        {slides.map((slide, index) => (
          <InfoCard
            key={`card-${slide.label}`}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            slide={slide}
            index={index}
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

const InfoCard = forwardRef<
  HTMLDivElement,
  {
    slide: Slide;
    index: number;
  }
>(function InfoCard({ slide, index }, ref) {
  const href =
    slide.label === "Dogs"
      ? "/shop?category=dogs&page=1"
      : "/shop?category=cats&page=1";

  return (
    <div
      ref={ref}
      className="invisible absolute inset-0 overflow-hidden opacity-0 will-change-transform"
    >
      <Link
        href={href}
        className="group flex h-full flex-col items-end justify-end text-right text-white"
      >
        <div className="flex w-full max-w-[315px] flex-col items-end gap-3 md:max-w-[455px] md:gap-4 [@media_(orientation:landscape)_and_(max-height:500px)]:max-w-[320px] [@media_(orientation:landscape)_and_(max-height:500px)]:gap-2">
          <div className="flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.08em] text-white/80 md:text-[10px] md:tracking-[0.1em]">
            <span className="block h-[2px] w-12 shrink-0 bg-white/80 transition-all duration-500 group-hover:w-20 md:w-16 md:group-hover:w-28" />
          </div>
          <h1 className="text-[clamp(2.6rem,8vw,5rem)] font-semibold uppercase leading-[0.85] tracking-[-0.04em] text-white md:text-[clamp(4rem,6vw,7rem)] [@media_(orientation:landscape)_and_(max-height:500px)]:text-[3rem]">
            {slide.label}
          </h1>

          <div className="w-full border-t border-white/30 pt-3 md:pt-4 [@media_(orientation:landscape)_and_(max-height:500px)]:pt-2">
            <p className="ml-auto max-w-[15rem] text-[13px] font-medium leading-[1.12] tracking-[-0.025em] text-white/82 md:max-w-[18rem] md:text-[16px] [@media_(orientation:landscape)_and_(max-height:500px)]:max-w-[13rem] [@media_(orientation:landscape)_and_(max-height:500px)]:text-[10px]">
              {slide.text}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-white md:text-[11px] md:tracking-[0.16em] [@media_(orientation:landscape)_and_(max-height:500px)]:text-[7px]">
            <span className="text-white/50">{slide.meta}</span>

            <span className="h-px w-6 bg-white/35" />

            <span className="opacity-75 transition-opacity duration-300 group-hover:opacity-100">
              {slide.cta}
            </span>

            <span className="inline-flex h-7 w-7 items-center justify-center  text-[13px] leading-none transition duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-white md:h-9 md:w-9 md:text-[16px] [@media_(orientation:landscape)_and_(max-height:500px)]:h-6 [@media_(orientation:landscape)_and_(max-height:500px)]:w-6 [@media_(orientation:landscape)_and_(max-height:500px)]:text-[11px]">
              ↗
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
});
