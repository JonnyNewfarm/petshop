"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f6f1e8] text-neutral-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#e8d8bd]/50 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[550px] w-[550px] rounded-full bg-[#d8c2a6]/40 blur-3xl" />
      </div>

      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='black' fill-opacity='1'%3E%3Ccircle cx='8' cy='12' r='1'/%3E%3Ccircle cx='38' cy='52' r='1'/%3E%3Ccircle cx='72' cy='18' r='1'/%3E%3Ccircle cx='110' cy='35' r='1'/%3E%3Ccircle cx='25' cy='100' r='1'/%3E%3Ccircle cx='60' cy='88' r='1'/%3E%3Ccircle cx='95' cy='120' r='1'/%3E%3Ccircle cx='125' cy='92' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10  flex min-h-screen w-full max-w-[1200px] items-center px-6 pb-12 pt-28 sm:px-8 lg:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative"
        >
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2 border border-black/10 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-black/70"
          >
            <span className="block h-2 w-2 rounded-full bg-black" />
            Premium essentials for modern pet owners
          </motion.div>

          <motion.h1
            variants={item}
            className="max-w-[8ch] text-[clamp(4rem,10vw,9rem)] font-semibold uppercase leading-[0.86] tracking-[-0.07em]"
          >
            Everything for your pet
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-[560px] text-base leading-7 text-black/70 sm:text-lg sm:leading-8"
          >
            Discover refined essentials for dogs, cats and small pets —
            thoughtfully selected for everyday comfort, play and care.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#shop"
              className="group inline-flex items-center justify-center gap-2 border border-black bg-black px-7 py-4 text-sm font-medium uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
            >
              Shop now
            </a>

            <a
              href="#categories"
              className="inline-flex items-center justify-center border border-black/15 px-7 py-4 text-sm font-medium uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8]"
            >
              Browse categories
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[12px] uppercase tracking-[0.18em] text-black/55"
          >
            <span>Fast delivery</span>
            <span>Secure checkout</span>
            <span>Curated collections</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f6f1e8] to-transparent" />
    </section>
  );
}
