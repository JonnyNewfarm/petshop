"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import CartButton from "@/components/CartButton";

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const drawerVariants = {
  hidden: {
    x: "100%",
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.08 + i * 0.06,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: { opacity: 0, x: 12 },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-0 z-50 w-full"
      >
        <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between px-6 py-6 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="text-lg font-semibold uppercase tracking-[0.25em] text-black"
          >
            Petsaco
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            <nav className="flex items-center gap-10 text-[13px] uppercase tracking-[0.18em] text-black/70">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <CartButton />
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center text-black md:hidden"
          >
            Menu
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              onClick={() => setIsOpen(false)}
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]"
            />

            <motion.aside
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 z-[70] flex h-screen w-[88vw] max-w-[420px] flex-col border-l border-black/10 bg-[#f6f1e8] p-6 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="text-lg font-semibold uppercase tracking-[0.25em] text-black"
                >
                  Petsaco
                </Link>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setIsOpen(false)}
                  className="text-black"
                >
                  Close
                </button>
              </div>

              <div className="mt-16 flex flex-col">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block border-b border-black/10 py-5 text-[15px] uppercase tracking-[0.16em] text-black/80 transition hover:text-black"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  custom={navItems.length}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="block border-b border-black/10 py-5 text-[15px] uppercase tracking-[0.16em] text-black/80 transition hover:text-black"
                  >
                    Cart
                  </Link>
                </motion.div>
              </div>

              <motion.div
                custom={navItems.length + 1}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="mt-8 inline-flex items-center justify-center border border-black bg-black px-6 py-4 text-sm uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
                >
                  Shop now
                </Link>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
