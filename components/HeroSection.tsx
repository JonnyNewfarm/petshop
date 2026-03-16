"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(imageStageRef.current, {
        scale: 0.28,
        transformOrigin: "50% 50%",
      });

      gsap.set(overlayRef.current, {
        opacity: 0.08,
      });

      gsap.set(
        [line1Ref.current, line2Ref.current, line3Ref.current, subRef.current],
        {
          yPercent: 110,
          opacity: 0,
        },
      );

      gsap.set(petRef.current, {
        opacity: 1,
        rotateX: 0,
        yPercent: 0,
        filter: "blur(0px)",
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
        force3D: true,
      });

      gsap.set([dogRef.current, catRef.current], {
        opacity: 0,
        rotateX: -90,
        yPercent: 30,
        filter: "blur(8px)",
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
        force3D: true,
      });

      const intro = gsap.timeline();

      intro
        .to(imageStageRef.current, {
          scale: 1,
          duration: 1.8,
          ease: "power3.inOut",
        })
        .to(
          overlayRef.current,
          {
            opacity: 0.22,
            duration: 1.1,
            ease: "power2.out",
          },
          0.35,
        )
        .to(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.95,
        )
        .to(
          subRef.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
          },
          1.15,
        );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2200",
          scrub: 1,
          pin: heroRef.current,
          anticipatePin: 1,
          snap: {
            snapTo: [0, 0.22, 0.42, 1],
            duration: { min: 0.2, max: 0.4 },
            ease: "power2.inOut",
          },
        },
      });

      tl.to(
        textWrapRef.current,
        {
          yPercent: -10,
          ease: "none",
        },
        0,
      )
        .to(
          line1Ref.current,
          {
            xPercent: 8,
            ease: "none",
          },
          0,
        )
        .to(
          line2Ref.current,
          {
            xPercent: -8,
            ease: "none",
          },
          0,
        )
        .to(
          subRef.current,
          {
            opacity: 0.6,
            yPercent: -18,
            ease: "none",
          },
          0.12,
        )

        // PET -> DOG
        .to(
          petRef.current,
          {
            rotateX: 90,
            yPercent: -30,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.16,
            ease: "power2.inOut",
          },
          0.18,
        )
        .to(
          dogRef.current,
          {
            rotateX: 0,
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.16,
            ease: "power2.inOut",
          },
          0.18,
        )

        // DOG -> CAT
        .to(
          dogRef.current,
          {
            rotateX: 90,
            yPercent: -30,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.16,
            ease: "power2.inOut",
          },
          0.38,
        )
        .to(
          catRef.current,
          {
            rotateX: 0,
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.16,
            ease: "power2.inOut",
          },
          0.38,
        )

        // videre scroll etter cat
        .to(
          line1Ref.current,
          {
            xPercent: 14,
            ease: "none",
          },
          0.52,
        )
        .to(
          line2Ref.current,
          {
            xPercent: -14,
            ease: "none",
          },
          0.52,
        )
        .to(
          textWrapRef.current,
          {
            yPercent: -16,
            ease: "none",
          },
          0.52,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-[#dddad5]">
      <div
        ref={heroRef}
        className="relative h-screen sm:h-[120vh] overflow-hidden bg-[#dddad5]"
      >
        <div
          ref={imageStageRef}
          className="absolute left-1/2 top-1/2 h-[180vh] w-[130vw] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <img
            src="/dogs.jpg"
            alt="Pets hero"
            className="h-full w-full object-cover"
          />
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black will-change-[opacity]"
        />

        <div
          ref={textWrapRef}
          className="relative z-10 flex min-h-screen items-center px-6 py-16 md:px-10 md:py-20"
        >
          <div className="w-full text-white">
            <div className="w-full overflow-hidden">
              <span
                style={{ fontFamily: "Mango" }}
                ref={line1Ref}
                className="block w-fit font-semibold uppercase text-[clamp(3.75rem,11vw,10rem)] will-change-transform"
              >
                Everything
              </span>
            </div>

            <div className="w-full overflow-hidden">
              <span
                style={{ fontFamily: "Mango" }}
                ref={line2Ref}
                className="ml-auto block w-fit text-right font-semibold uppercase text-[clamp(3.75rem,11vw,10rem)] will-change-transform"
              >
                for modern
              </span>
            </div>

            <div className="w-full overflow-hidden">
              <span
                style={{ fontFamily: "Mango" }}
                ref={line3Ref}
                className="block w-fit font-semibold uppercase text-[clamp(3.75rem,11vw,10rem)]"
              >
                <span className="relative inline-grid [perspective:1200px]">
                  <span
                    ref={petRef}
                    className="col-start-1 row-start-1 inline-block will-change-transform"
                  >
                    pet
                  </span>
                  <span
                    ref={dogRef}
                    className="col-start-1 row-start-1 inline-block will-change-transform"
                  >
                    dog
                  </span>
                  <span
                    ref={catRef}
                    className="col-start-1 row-start-1 inline-block will-change-transform"
                  >
                    cat
                  </span>
                </span>{" "}
                living
              </span>
            </div>

            <div className="mt-8 w-full overflow-hidden">
              <p
                ref={subRef}
                className="ml-auto w-fit max-w-[34rem] text-right text-[11px] uppercase tracking-[0.2em] text-white/75 md:text-[12px]"
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
