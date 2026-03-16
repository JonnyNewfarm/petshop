"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function EditorialShopSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const titleRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLAnchorElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [titleRef.current, listRef.current, textRef.current, btnRef.current],
        {
          y: 80,
          opacity: 0,
        },
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      })
        .to(
          listRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.7",
        )
        .to(
          textRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.7",
        )
        .to(
          btnRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5",
        );

      // subtle drift
      gsap.to(titleRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#dddad5] text-black px-6 md:px-10 py-36"
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* LEFT */}
        <div>
          <div
            ref={titleRef}
            style={{ fontFamily: "Mango" }}
            className="max-w-[10ch] uppercase leading-[0.8] text-[clamp(4.8rem,12vw,11rem)]"
          >
            essentials
            <br />
            for wild
            <br />
            little lives
          </div>

          <ul ref={listRef} className="mt-16 space-y-3 text-sm uppercase">
            <li>
              <Link className="underline" href="/shop?category=dogs">
                life with dogs
              </Link>
            </li>
            <li>
              <Link className="underline" href="/shop?category=cats">
                living with cats
              </Link>
            </li>
            <li>
              <Link className="underline" href="/shop?category=birds">
                for curious birds
              </Link>
            </li>
            <li>
              <Link className="underline" href="/shop?category=small-pets">
                small companions
              </Link>
            </li>
            <li>
              <Link className="underline" href="/shop?category=fish">
                Aquarium life
              </Link>
            </li>
          </ul>
        </div>

        {/* RIGHT */}
        <div ref={textRef} className="max-w-[520px]">
          <p className="text-sm leading-relaxed uppercase">
            Toys, treats, walk gear, bowls, soft beds and everyday favorites for
            pets with big personalities.
          </p>

          <p className="mt-8 text-sm leading-relaxed uppercase">
            Practical things, playful things and pieces that make life at home a
            little better for everyone.
          </p>

          <a
            ref={btnRef}
            href="/shop"
            className="inline-block mt-14 border border-black px-10 py-4 text-sm uppercase hover:bg-black hover:text-white transition-colors"
          >
            shop now
          </a>
        </div>
      </div>
    </section>
  );
}
