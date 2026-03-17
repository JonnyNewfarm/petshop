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

      intro.to([line1Ref.current, line2Ref.current, line3Ref.current], {
        yPercent: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.08,
        ease: "power3.out",
      });

      const rail = railRef.current;
      const section = sectionRef.current;

      if (!rail || !section) return;

      const createAnimation = () => {
        const viewportW = window.innerWidth;
        const railW = rail.scrollWidth;

        // start helt utenfor høyre side
        let startX;

        if (viewportW >= 1200) {
          startX = viewportW * 0.72; // stor desktop
        } else if (viewportW >= 768) {
          startX = viewportW * 0.85; // tablet litt tidligere
        } else {
          startX = viewportW; // mobil som før
        } // hvor langt railen må flyttes for at siste card skal komme helt gjennom
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
          [line1Ref.current, line2Ref.current, line3Ref.current],
          {
            opacity: 0,
            yPercent: -55,
            ease: "none",
            stagger: 0.015,
          },
          0,
        ).to(
          rail,
          {
            x: endX,
            ease: "none",
          },
          0,
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
        {/* FØRSTE TEKST */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <div className="text-left">
            <div className="overflow-hidden">
              <span
                ref={line1Ref}
                style={{ fontFamily: "Mango" }}
                className="block font-semibold uppercase text-[clamp(6rem,12vw,12rem)] leading-[0.85] will-change-transform"
              >
                Everything
              </span>
            </div>

            <div className="overflow-hidden">
              <span
                ref={line2Ref}
                style={{ fontFamily: "Mango" }}
                className="block font-semibold uppercase text-[clamp(5rem,12vw,12rem)] leading-[0.85] will-change-transform"
              >
                you need
              </span>
            </div>

            <div className="overflow-hidden">
              <span
                ref={line3Ref}
                style={{ fontFamily: "Mango" }}
                className="block font-semibold uppercase text-[clamp(5rem,12vw,12rem)] leading-[0.85] will-change-transform"
              >
                for pets
              </span>
            </div>
          </div>
        </div>

        {/* 3 CARDS FRA HØYRE MOT VENSTRE */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div
            ref={railRef}
            className="flex w-max gap-4 sm:gap-6 pl-[6vw] sm:pl-[10vw] will-change-transform"
          >
            <TrainCard
              title="Dogs"
              text="Walks, sleep and everyday essentials."
              image="/dogs.jpg"
              href="/dogs"
            />
            <TrainCard
              title="Cats"
              text="Comfort, play and indoor living."
              image="/dogs.jpg"
              href="/cats"
            />
            <TrainCard
              title="All Products"
              text="Explore the full collection."
              image="/dogs.jpg"
              href="/products"
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
      className="group relative h-[64vh] w-[78vw] sm:w-[58vw] lg:w-[34vw] min-w-0 sm:min-w-[320px] lg:min-w-[380px] shrink-0 overflow-hidden border border-black/10 bg-[#e7e3de]"
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
