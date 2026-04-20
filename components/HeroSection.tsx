"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const imageStageRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const textWrapRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const line3Ref = useRef<HTMLSpanElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);

  const petRef = useRef<HTMLSpanElement | null>(null);
  const dogRef = useRef<HTMLSpanElement | null>(null);
  const catRef = useRef<HTMLSpanElement | null>(null);

  const shopWrapRef = useRef<HTMLDivElement | null>(null);
  const shopRef = useRef<HTMLSpanElement | null>(null);
  const nowRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          line1Ref.current,
          line2Ref.current,
          line3Ref.current,
          subRef.current,
          petRef.current,
          dogRef.current,
          catRef.current,
          shopRef.current,
          nowRef.current,
          textWrapRef.current,
          shopWrapRef.current,
        ],
        {
          force3D: true,
        },
      );

      gsap.set([petRef.current, dogRef.current, catRef.current], {
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
        backfaceVisibility: "hidden",
      });

      const intro = gsap.timeline({
        defaults: {
          force3D: true,
        },
      });

      intro
        .to(imageStageRef.current, {
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
        })
        .to(
          overlayRef.current,
          {
            opacity: 0.22,
            duration: 0.8,
            ease: "power2.out",
          },
          0.2,
        )
        .to(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.06,
            ease: "power3.out",
          },
          0.55,
        )
        .to(
          subRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          0.72,
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
        textWrapRef.current,
        {
          yPercent: -10,
          ease: "none",
          force3D: true,
        },
        0,
      )
        .to(
          line1Ref.current,
          {
            xPercent: 8,
            ease: "none",
            force3D: true,
          },
          0,
        )
        .to(
          line2Ref.current,
          {
            xPercent: -8,
            ease: "none",
            force3D: true,
          },
          0,
        )
        .to(
          subRef.current,
          {
            opacity: 0.6,
            yPercent: -18,
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
          0.38,
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
          0.38,
        )

        .to(
          shopRef.current,
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.22,
            ease: "none",
            force3D: true,
          },
          0.5,
        )
        .to(
          nowRef.current,
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.22,
            ease: "none",
            force3D: true,
          },
          0.56,
        )

        .to(
          line1Ref.current,
          {
            xPercent: 14,
            ease: "none",
            force3D: true,
          },
          0.48,
        )
        .to(
          line2Ref.current,
          {
            xPercent: -14,
            ease: "none",
            force3D: true,
          },
          0.48,
        )
        .to(
          textWrapRef.current,
          {
            yPercent: -16,
            ease: "none",
            force3D: true,
          },
          0.48,
        )
        .to(
          shopWrapRef.current,
          {
            yPercent: -18,
            ease: "none",
            force3D: true,
          },
          0.48,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#dddad5]">
      <div
        ref={heroRef}
        className="relative h-screen overflow-hidden bg-[#dddad5] sm:h-[120vh]"
      >
        <div className="absolute left-1/2 top-1/2 h-[180vh] w-[130vw] -translate-x-1/2 -translate-y-1/2">
          <div
            ref={imageStageRef}
            className="h-full w-full will-change-transform"
            style={{
              transform: "scale(0.28)",
              transformOrigin: "50% 50%",
            }}
          >
            <img
              src="/dogs.jpg"
              alt="Pets hero"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black will-change-[opacity]"
          style={{ opacity: 0.08 }}
        />

        <div
          ref={textWrapRef}
          className="relative z-10 flex min-h-screen items-center px-6 py-16 md:px-10 md:py-14"
        >
          <div className="w-full text-white">
            <div className="w-full overflow-hidden">
              <span
                ref={line1Ref}
                style={{
                  fontFamily: "Mango",
                  transform: "translate3d(0,110%,0)",
                  opacity: 0,
                }}
                className="block w-fit font-semibold uppercase text-[clamp(3.75rem,11vw,10rem)] will-change-[transform,opacity]"
              >
                Everything
              </span>
            </div>

            <div className="w-full overflow-hidden">
              <span
                ref={line2Ref}
                style={{
                  fontFamily: "Mango",
                  transform: "translate3d(0,110%,0)",
                  opacity: 0,
                }}
                className="ml-auto block w-fit text-right font-semibold uppercase text-[clamp(3.75rem,11vw,10rem)] will-change-[transform,opacity]"
              >
                for modern
              </span>
            </div>

            <div className="w-full overflow-hidden">
              <span
                ref={line3Ref}
                style={{
                  fontFamily: "Mango",
                  transform: "translate3d(0,110%,0)",
                  opacity: 0,
                }}
                className="block w-fit font-semibold uppercase text-[clamp(3.75rem,11vw,10rem)] will-change-[transform,opacity]"
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
                    pet
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
                    dog
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
                    cat
                  </span>
                </span>{" "}
                living
              </span>
            </div>

            <div
              ref={shopWrapRef}
              className="mt-3 flex w-full justify-end pr-2 md:pr-10"
            >
              <div className="flex flex-col items-end leading-none text-white">
                <span
                  ref={shopRef}
                  style={{
                    fontFamily: "Mango",
                    opacity: 0,
                    transform: "translate3d(28px,12px,0) rotate(2deg)",
                  }}
                  className="block text-[clamp(1.3rem,2.1vw,1.9rem)] uppercase tracking-[0.18em] will-change-[transform,opacity]"
                >
                  <Link href={"/shop"}>shop</Link>
                </span>

                <span
                  ref={nowRef}
                  style={{
                    fontFamily: "Mango",
                    opacity: 0,
                    transform: "translate3d(48px,18px,0) rotate(4deg)",
                  }}
                  className="mt-1 block text-[clamp(2.8rem,4.6vw,4.6rem)] font-medium uppercase tracking-[0.08em] will-change-[transform,opacity]"
                >
                  <Link href={"/shop"}> now</Link>
                </span>
              </div>
            </div>

            <div className="mt-8 w-full">
              <p
                ref={subRef}
                style={{
                  transform: "translate3d(0,110%,0)",
                  opacity: 0,
                }}
                className="ml-auto w-fit max-w-[34rem] text-right text-[11px] uppercase tracking-[0.2em] text-white/90 md:text-[12px]"
              >
                Curated essentials for dogs, cats and everyday life with pets
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
