"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const l1 = useRef<HTMLDivElement | null>(null);
  const l2 = useRef<HTMLDivElement | null>(null);
  const l3 = useRef<HTMLDivElement | null>(null);
  const l4 = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lines = [l1.current, l2.current, l3.current, l4.current];

      gsap.set(lines, {
        y: 120,
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });

      tl.to(lines, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.08,
        ease: "power4.out",
      })
        .to(
          l1.current,
          {
            x: 24,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.9",
        )
        .to(
          l2.current,
          {
            x: -12,
            duration: 1.2,
            ease: "power3.out",
          },
          "<",
        )
        .to(
          l3.current,
          {
            x: 36,
            duration: 1.2,
            ease: "power3.out",
          },
          "<",
        )
        .to(
          l4.current,
          {
            x: -20,
            duration: 1.2,
            ease: "power3.out",
          },
          "<",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#dddad5] text-black"
    >
      <div className="relative flex min-h-[50vh] sm:min-h-screen items-center px-4 sm:px-6 md:px-10">
        <div className="w-full">
          <div
            ref={l1}
            style={{ fontFamily: "Mango" }}
            className="text-[clamp(4rem,12vw,10rem)] uppercase leading-[0.8] tracking-[0.01em]"
          >
            Better
          </div>

          <div
            ref={l2}
            style={{ fontFamily: "Mango" }}
            className="text-[clamp(4rem,12vw,10rem)] uppercase leading-[0.8] tracking-[0.01em]"
          >
            things for pets
          </div>

          <div
            ref={l3}
            style={{ fontFamily: "Mango" }}
            className="text-[clamp(4.3rem,13vw,11.5rem)] uppercase leading-[0.8] tracking-[0.01em]"
          >
            made for
          </div>

          <div
            ref={l4}
            style={{ fontFamily: "Mango" }}
            className="ml-[18vw] text-[clamp(4.3rem,13vw,11.5rem)] uppercase leading-[0.8] tracking-[0.01em] md:ml-[28vw]"
          >
            happy homes
          </div>
        </div>
      </div>
    </section>
  );
}
