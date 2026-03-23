"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import MagneticComp from "./MagneticComp";

const items = [
  {
    id: "01",
    title: "For Dogs",
    image: "/dogs.jpg",
    label: "Premium Essentials",
    description:
      "Thoughtfully selected products for play, comfort and everyday care — designed for dogs and the people who love them.",
    href: "/shop?category=dogs",
  },
  {
    id: "02",
    title: "For Cats",
    image: "/cat.jpg",
    label: "Curated Daily Care",
    description:
      "A refined selection of cat essentials, from soft resting pieces to playful details and functional everyday favorites.",
    href: "/shop?category=cats",
  },
  {
    id: "03",
    title: "For Every Pet",
    image: "/all.jpg",
    label: "Shop The Collection",
    description:
      "Explore a complete universe of elevated pet products with a focus on quality, comfort and considered design.",
    href: "/shop",
  },
];

export default function AnimalsPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen w-full bg-[#dddad5]">
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 px-5 pb-24 pt-20 md:grid-cols-[360px_1fr] md:px-8 xl:px-12">
        <div className="md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-between md:py-10">
          <div>
            <div className="mb-8 flex items-start gap-3">
              <span className="text-[11px] uppercase tracking-[0.18em] text-color/45">
                03
              </span>
              <p
                style={{ fontFamily: "Mango" }}
                className="text-[20px] uppercase tracking-[0.22em] text-color/70 md:text-[26px]"
              >
                Pet Collections
              </p>
            </div>

            <div className="max-w-[280px] space-y-5">
              <p
                style={{ fontFamily: "Mango" }}
                className="text-[clamp(2.9rem,5.3vw,5.4rem)] uppercase leading-[0.9] tracking-[-0.01em] text-color"
              >
                Curated
                <br />
                for modern
                <br />
                pet living
              </p>

              <p className="max-w-[260px] text-sm uppercase leading-[1.7] tracking-[0.14em] text-color/50">
                Elevated essentials for pets, presented through a refined and
                editorial shopping experience.
              </p>
            </div>
          </div>

          <div className="mt-14 md:mt-0">
            <Link
              href="/shop"
              className="inline-block text-[13px] uppercase tracking-[0.18em] text-color/55 transition hover:text-color"
            >
              View — Shop
            </Link>
          </div>
        </div>

        <div className="mt-14 space-y-12 md:mt-0 md:space-y-6">
          {items.map((item, index) => (
            <StoreImageBlock
              key={item.id}
              item={item}
              index={index}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoreImageBlock({
  item,
  index,
  hoveredId,
  setHoveredId,
}: {
  item: {
    id: string;
    title: string;
    image: string;
    label: string;
    description: string;
    href: string;
  };
  index: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}) {
  const alignClass =
    index % 2 === 0 ? "md:ml-0 md:mr-auto" : "md:ml-auto md:mr-0";

  const isActive = hoveredId === item.id;
  const isDimmed = hoveredId !== null && hoveredId !== item.id;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      animate={{
        y:
          typeof window !== "undefined" && window.innerWidth < 768
            ? index === 1
              ? 55
              : -55
            : 0,
      }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        opacity: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        filter: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        y: {
          duration:
            typeof window !== "undefined" && window.innerWidth < 768
              ? 2.2
              : 0.8,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className={`relative w-full max-w-[820px] ${alignClass}`}
      onHoverStart={() => setHoveredId(item.id)}
      onHoverEnd={() => setHoveredId(null)}
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-color/40">
            {item.id}
          </p>
        </div>

        <p className="hidden max-w-[220px] text-right text-[11px] uppercase leading-[1.7] tracking-[0.16em] text-color/40 md:block">
          {item.label}
        </p>
      </div>

      <MagneticComp>
        <Link href={item.href} className="group block">
          <motion.div
            animate={{
              scale: isDimmed ? 0.9 : 1,
              filter: isDimmed ? "blur(5px)" : "blur(0px)",
              opacity: isDimmed ? 0.38 : 1,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="will-change-transform"
          >
            <div className="relative overflow-hidden border border-white/8">
              <div className="relative aspect-[16/10] w-full min-h-[240px] md:min-h-0">
                <motion.div
                  animate={{
                    scale: isActive ? 1.018 : 1,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 820px"
                  />
                </motion.div>

                <motion.div
                  animate={{
                    opacity: isActive ? 0.08 : 0.16,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 bg-black"
                />
              </div>
            </div>

            <div className="mt-4 border-b border-white/10 pb-5 md:pb-6">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_150px] md:items-start md:gap-8">
                <div className="min-h-[88px] md:min-h-[96px]">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-color/42 md:hidden">
                    {item.label}
                  </p>

                  <p
                    style={{ fontFamily: "Mango" }}
                    className="text-[27px] uppercase  tracking-[0.19em] "
                  >
                    {item.title}
                  </p>

                  <AnimatePresence initial={false} mode="wait">
                    {isActive && (
                      <motion.p
                        key={`description-${item.id}`}
                        initial={{
                          opacity: 0,
                          y: 10,
                          filter: "blur(8px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          y: 8,
                          filter: "blur(6px)",
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mt-3 max-w-[560px] text-sm leading-[1.7] text-color/70 md:text-[14px]"
                      >
                        {item.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="hidden md:block md:text-right">
                  <motion.p
                    animate={{
                      opacity: isActive ? 1 : 0,
                      x: isActive ? 0 : -8,
                      filter: isActive ? "blur(0px)" : "blur(6px)",
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-[11px] uppercase tracking-[0.18em] text-color/55"
                  >
                    Discover →
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </MagneticComp>
    </motion.article>
  );
}
