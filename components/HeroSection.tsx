"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DogLineBg from "./DogLineBg";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);

  const topLineRef = useRef<HTMLSpanElement | null>(null);
  const hugeLineRef = useRef<HTMLSpanElement | null>(null);
  const livingRef = useRef<HTMLSpanElement | null>(null);

  const sideTextRef = useRef<HTMLParagraphElement | null>(null);
  const bottomTextRef = useRef<HTMLParagraphElement | null>(null);
  const indexRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);

  const dogArtRef = useRef<HTMLDivElement | null>(null);

  const petRef = useRef<HTMLSpanElement | null>(null);
  const dogRef = useRef<HTMLSpanElement | null>(null);
  const catRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const revealItems = [
        topLineRef.current,
        hugeLineRef.current,
        livingRef.current,
        sideTextRef.current,
        bottomTextRef.current,
        indexRef.current,
        labelRef.current,
        dogArtRef.current,
      ];

      gsap.set(revealItems, {
        force3D: true,
      });

      gsap.set([petRef.current, dogRef.current, catRef.current], {
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
        backfaceVisibility: "hidden",
      });

      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
          force3D: true,
        },
      });

      intro
        .to([topLineRef.current, hugeLineRef.current, livingRef.current], {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
        })
        .to(
          [
            sideTextRef.current,
            bottomTextRef.current,
            indexRef.current,
            labelRef.current,
          ],
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.06,
          },
          0.14,
        )
        .to(
          dogArtRef.current,
          {
            opacity: 1,
            duration: 0.9,
          },
          0.18,
        );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1200",
          scrub: 1.1,
          pin: heroRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        stageRef.current,
        {
          yPercent: -8,
          ease: "none",
          force3D: true,
        },
        0,
      )
        .to(
          topLineRef.current,
          {
            xPercent: 4,
            ease: "none",
            force3D: true,
          },
          0,
        )
        .to(
          hugeLineRef.current,
          {
            xPercent: -5,
            ease: "none",
            force3D: true,
          },
          0,
        )
        .to(
          livingRef.current,
          {
            xPercent: 3,
            ease: "none",
            force3D: true,
          },
          0,
        )
        .to(
          dogArtRef.current,
          {
            yPercent: -4,
            scale: 1.04,
            ease: "none",
            force3D: true,
          },
          0,
        )
        .to(
          [sideTextRef.current, bottomTextRef.current, labelRef.current],
          {
            opacity: 0.62,
            yPercent: -12,
            ease: "none",
            force3D: true,
          },
          0.08,
        )
        .to(
          petRef.current,
          {
            rotateX: 90,
            yPercent: -24,
            opacity: 0,
            duration: 0.22,
            ease: "none",
            force3D: true,
          },
          0.18,
        )
        .to(
          dogRef.current,
          {
            rotateX: 0,
            yPercent: 0,
            opacity: 1,
            duration: 0.22,
            ease: "none",
            force3D: true,
          },
          0.18,
        )
        .to(
          dogRef.current,
          {
            rotateX: 90,
            yPercent: -24,
            opacity: 0,
            duration: 0.22,
            ease: "none",
            force3D: true,
          },
          0.4,
        )
        .to(
          catRef.current,
          {
            rotateX: 0,
            yPercent: 0,
            opacity: 1,
            duration: 0.22,
            ease: "none",
            force3D: true,
          },
          0.4,
        )
        .to(
          topLineRef.current,
          {
            xPercent: 7,
            ease: "none",
            force3D: true,
          },
          0.5,
        )
        .to(
          hugeLineRef.current,
          {
            xPercent: -8,
            ease: "none",
            force3D: true,
          },
          0.5,
        )
        .to(
          livingRef.current,
          {
            xPercent: 5,
            ease: "none",
            force3D: true,
          },
          0.5,
        )
        .to(
          stageRef.current,
          {
            yPercent: -13,
            ease: "none",
            force3D: true,
          },
          0.5,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#dddad5]">
      <div
        ref={heroRef}
        className="relative h-screen overflow-hidden bg-[#dddad5] text-[#101010] sm:h-[120vh]"
      >
        <div
          ref={dogArtRef}
          style={{
            opacity: 0,
          }}
          className="pointer-events-none absolute inset-0 z-0 will-change-[transform,opacity]"
        >
          <DogLineBg />
        </div>

        <div
          ref={stageRef}
          className="relative z-10 flex min-h-screen flex-col justify-between px-6 pb-8 pt-10 md:px-12 md:pb-10 md:pt-12"
        >
          <div className="grid grid-cols-12 items-start">
            <div
              ref={indexRef}
              style={{
                transform: "translate3d(0,28px,0)",
                opacity: 0,
              }}
              className="col-span-5 hidden text-[11px] uppercase tracking-[0.24em] text-[#101010]/55 md:block"
            >
              01 / Petsaco
            </div>

            <p
              ref={labelRef}
              style={{
                transform: "translate3d(0,28px,0)",
                opacity: 0,
              }}
              className="col-span-7 ml-auto hidden max-w-[24rem] text-right text-[11px] uppercase leading-relaxed tracking-[0.22em] text-[#101010]/55 md:block"
            >
              Curated objects for animals and homes
            </p>
          </div>

          <div className="grid grid-cols-12 items-center gap-y-26 mt-20 sm:mt-5 md:gap-y-20 lg:gap-y-24">
            <div className="col-span-14 overflow-hidden md:col-span-8">
              <span
                ref={topLineRef}
                style={{
                  transform: "translate3d(0,115%,0)",
                  opacity: 0,
                }}
                className="block w-fit text-[clamp(1rem,5.7vw,6.2rem)]   font-semibold uppercase leading-[0.82] tracking-[-0.035em] text-red-900/80 will-change-[transform,opacity]"
              >
                Everything
              </span>
              <p className="text-[9px] absolute md:hidden uppercase leading-relaxed tracking-[0.22em] text-[#101010] ">
                Objects for pets,
                <br />
                chosen with the same care
                <br />
                as the rest of your home.
              </p>
            </div>

            <div className="col-span-12 overflow-hidden md:col-span-6 md:col-start-7">
              <span
                ref={hugeLineRef}
                style={{
                  transform: "translate3d(0,115%,0)",
                  opacity: 0,
                }}
                className="ml-auto block w-fit text-right text-[clamp(2rem,6.2vw,6.7rem)] font-semibold uppercase leading-[0.82] tracking-[-0.035em] text-red-900/80 will-change-[transform,opacity] sm:text-[clamp(2.8rem,7vw,7.5rem)]"
              >
                <span className="block">For</span>
                <span className="block">modern</span>
              </span>
            </div>

            <div className="relative col-span-12 overflow-visible md:col-span-7">
              <div className="absolute bottom-full hidden md:block left-0 z-20 mb-5 max-w-[18rem] md:mb-7">
                <p className="mb-5 hidden text-[11px] uppercase leading-relaxed tracking-[0.22em] text-[#101010]/55 md:block">
                  Objects for pets,
                  <br />
                  chosen with the same care
                  <br />
                  as the rest of your home.
                </p>

                <a
                  href="#products"
                  className="inline-flex items-center  bg-stone-600 px-2 py-1 text-[14px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-60 md:bg-transparent md:p-0 md:text-red-900"
                >
                  View curated objects →
                </a>
              </div>

              <span
                ref={livingRef}
                style={{
                  transform: "translate3d(0,115%,0)",
                  opacity: 0,
                }}
                className="relative z-10 block w-fit text-[clamp(2.5rem,7.7vw,8.2rem)] font-semibold uppercase leading-[0.82] tracking-[-0.035em] text-red-900/80 will-change-[transform,opacity]"
              >
                <span className="relative inline-grid [perspective:1200px]">
                  <span
                    ref={petRef}
                    style={{
                      opacity: 1,
                      transform: "rotateX(0deg) translate3d(0,0,0)",
                      backfaceVisibility: "hidden",
                    }}
                    className="col-start-1 row-start-1 inline-block will-change-[transform,opacity]"
                  >
                    Pet
                  </span>

                  <span
                    ref={dogRef}
                    style={{
                      opacity: 0,
                      transform: "rotateX(-90deg) translate3d(0,30%,0)",
                      backfaceVisibility: "hidden",
                    }}
                    className="col-start-1 row-start-1 inline-block will-change-[transform,opacity]"
                  >
                    Dog
                  </span>

                  <span
                    ref={catRef}
                    style={{
                      opacity: 0,
                      transform: "rotateX(-90deg) translate3d(0,30%,0)",
                      backfaceVisibility: "hidden",
                    }}
                    className="col-start-1 row-start-1 inline-block will-change-[transform,opacity]"
                  >
                    Cat
                  </span>
                </span>{" "}
                Living
              </span>
            </div>

            <p
              ref={sideTextRef}
              style={{
                transform: "translate3d(0,38px,0)",
                opacity: 0,
              }}
              className="invisible col-span-12 max-w-[23rem] text-[16px] font-semibold leading-relaxed text-[#101010]/70 md:visible md:col-span-3 md:col-start-10 md:self-end"
            >
              <span>
                A playful shop experience built around comfort, clean design and
                useful products for modern pet owners.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-12 items-end">
            <a
              href="#products"
              className="inline-flex absolute md:hidden left-6 bottom-20 items-center bg-stone-700 px-2 py-2 text-[14px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-60 md:bg-transparent md:p-0 md:text-red-900"
            >
              View curated objects →
            </a>
            <p
              ref={bottomTextRef}
              style={{
                transform: "translate3d(0,34px,0)",
                opacity: 0,
              }}
              className="col-span-12 max-w-[32rem] text-[11px] uppercase leading-relaxed tracking-[0.22em] text-[#101010]/90 md:col-span-5 md:text-[12px]"
            >
              Thoughtfully selected essentials for dogs, cats and everyday life
              with pets.
            </p>

            <div className="col-span-12 mt-6 hidden justify-end md:col-span-4 md:col-start-9 md:flex">
              <div className="flex gap-8 text-[11px] uppercase tracking-[0.2em] text-[#101010]/50">
                <span>Comfort</span>
                <span>Utility</span>
                <span>Personality</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
