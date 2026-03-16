"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const videoWrapRef = useRef<HTMLDivElement | null>(null);

  const l1 = useRef<HTMLDivElement | null>(null);
  const l2 = useRef<HTMLDivElement | null>(null);
  const l3 = useRef<HTMLDivElement | null>(null);
  const l4 = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lines = [l1.current, l2.current, l3.current, l4.current];

      gsap.set(lines, {
        yPercent: 18,
        opacity: 0,
      });

      gsap.set(videoWrapRef.current, {
        scale: 0.72,
        opacity: 1,
        yPercent: 0,
        transformOrigin: "100% 50%",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(videoWrapRef.current, {
        scale: 1,
        duration: 1.15,
        ease: "power3.out",
      })
        .to(
          lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.65",
        )
        .to(
          l1.current,
          {
            xPercent: 5,
            yPercent: -8,
            duration: 1.15,
            ease: "power2.out",
          },
          "-=0.15",
        )
        .to(
          l2.current,
          {
            xPercent: -3,
            yPercent: -10,
            duration: 1.15,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          l3.current,
          {
            xPercent: 7,
            yPercent: -12,
            duration: 1.15,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          l4.current,
          {
            xPercent: -4,
            yPercent: -14,
            duration: 1.15,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          videoWrapRef.current,
          {
            yPercent: -4,
            scale: 1.03,
            duration: 1.15,
            ease: "power2.out",
          },
          "<",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#dddad5]">
      <div className="relative min-h-screen overflow-hidden">
        <div
          ref={videoWrapRef}
          className="absolute right-0 top-1/3 z-10 h-[80vh] w-[62vw] min-w-[320px] -translate-y-1/2 "
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover object-[65%_center]"
          >
            <source src="/dogs8.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 flex min-h-screen items-center px-4 sm:px-6 md:px-10">
          <div className="w-full">
            <div
              ref={l1}
              style={{ fontFamily: "Mango" }}
              className="text-black text-[clamp(4.3rem,13vw,11.5rem)] uppercase leading-[0.8]"
            >
              Better
            </div>

            <div
              ref={l2}
              style={{ fontFamily: "Mango" }}
              className="text-black text-[clamp(4.3rem,13vw,11.5rem)] uppercase leading-[0.8]"
            >
              things for pets
            </div>

            <div
              ref={l3}
              style={{ fontFamily: "Mango" }}
              className="text-black text-[clamp(4.3rem,13vw,11.5rem)] uppercase leading-[0.8]"
            >
              made for
            </div>

            <div
              ref={l4}
              style={{ fontFamily: "Mango" }}
              className="ml-[28vw] text-black text-[clamp(4.3rem,13vw,11.5rem)] uppercase leading-[0.8]"
            >
              calm living
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
