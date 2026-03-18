"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TrainCardsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);

  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const line3Ref = useRef<HTMLSpanElement | null>(null);

  const railRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
        yPercent: 110,
        opacity: 0,
      });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      intro.to(line1Ref.current, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
      });

      intro.to(
        line2Ref.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.72",
      );

      intro.to(
        line3Ref.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.72",
      );

      const rail = railRef.current;
      const section = sectionRef.current;

      if (!rail || !section) return;

      const createAnimation = () => {
        const viewportW = window.innerWidth;
        const railW = rail.scrollWidth;

        let startX;

        if (viewportW >= 1200) {
          startX = viewportW * 0.72;
        } else if (viewportW >= 768) {
          startX = viewportW * 0.85;
        } else {
          startX = viewportW;
        }

        const endX = -(railW - viewportW + viewportW * 0.12);

        gsap.set(rail, { x: startX });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1600",
            scrub: 1,
            pin: pinRef.current,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          line1Ref.current,
          {
            x: -90,
            y: -26,
            rotation: -3,
            opacity: 0,
            ease: "power2.out",
          },
          0,
        )
          .to(
            line2Ref.current,
            {
              x: 70,
              y: -12,
              rotation: 2,
              opacity: 0,
              ease: "power2.out",
            },
            0,
          )
          .to(
            line3Ref.current,
            {
              x: -50,
              y: 18,
              rotation: -2,
              opacity: 0,
              ease: "power2.out",
            },
            0,
          )
          .to(
            rail,
            {
              x: endX,
              ease: "none",
            },
            0.04,
          );
      };

      createAnimation();
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#dddad5] text-black">
      <div ref={pinRef} className="relative h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <div className="text-left">
            <div className="">
              <span
                ref={line1Ref}
                style={{ fontFamily: "Mango" }}
                className="block translate-x-[-0.15em] font-semibold uppercase text-[clamp(6rem,12vw,12rem)] leading-[0.82] will-change-transform"
              >
                Everything
              </span>
            </div>

            <div className="">
              <span
                ref={line2Ref}
                style={{ fontFamily: "Mango" }}
                className="block translate-x-[0.28em] font-semibold uppercase text-[clamp(5rem,12vw,12rem)] leading-[0.82] will-change-transform"
              >
                you need
              </span>
            </div>

            <div className="">
              <span
                ref={line3Ref}
                style={{ fontFamily: "Mango" }}
                className="block translate-x-[0.05em] font-semibold uppercase text-[clamp(5rem,12vw,12rem)] leading-[0.82] will-change-transform"
              >
                for pets
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex items-center">
          <div
            ref={railRef}
            className="flex w-max gap-4 pl-[6vw] will-change-transform sm:gap-6 sm:pl-[10vw]"
          >
            <TrainCard
              title="Dogs"
              text="Walks, sleep and everyday essentials."
              image="/dogs.jpg"
              href="/shop?category=dogs&page=1"
            />
            <TrainCard
              title="Cats"
              text="Comfort, play and indoor living."
              image="/cat.jpg"
              href="/shop?category=cats&page=1"
            />
            <TrainCard
              title="All Products"
              text="Explore the full collection."
              image="/all.jpg"
              href="/shop"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrainCard({
  title,
  text,
  image,
  href,
}: {
  title: string;
  text: string;
  image: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group relative h-[64vh] w-[78vw] min-w-0 shrink-0 overflow-hidden border border-black/10 bg-[#e7e3de] sm:w-[58vw] sm:min-w-[320px] lg:h-[70vh] lg:w-[34vw] lg:min-w-[380px]"
    >
      <div className="absolute inset-0">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative flex h-full flex-col justify-end p-8 text-white">
        <h3
          style={{ fontFamily: "Mango" }}
          className="text-[clamp(2.2rem,4vw,4.5rem)] uppercase leading-[0.9]"
        >
          {title}
        </h3>

        <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-white/85">
          {text}
        </p>
      </div>
    </a>
  );
}
