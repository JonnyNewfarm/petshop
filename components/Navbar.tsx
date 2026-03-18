"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartButton from "@/components/CartButton";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

function getCurrentPageLabel(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname.startsWith("/shop")) return "Shop";
  if (pathname.startsWith("/about")) return "About";
  if (pathname.startsWith("/contact")) return "Contact";
  if (pathname.startsWith("/cart")) return "Cart";
  return "Menu";
}

const panelVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.4,
        ease: [0.76, 0, 0.24, 1] as const,
      },
      opacity: {
        duration: 0.25,
        ease: "linear" as const,
      },
      when: "afterChildren",
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
      opacity: {
        duration: 0.3,
        ease: "linear" as const,
      },
      when: "beforeChildren",
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.35,
      ease: [0.76, 0, 0.24, 1] as const,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const currentPage = getCurrentPageLabel(pathname);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 z-50 w-full"
    >
      <div className="relative mx-auto flex w-full max-w-[1700px] items-start justify-center px-4 py-6 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2">
          <div ref={wrapperRef} className="pointer-events-auto relative">
            <motion.div
              layout
              transition={{
                layout: {
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="min-w-[230px] overflow-hidden border border-black/10 bg-white/70 text-black backdrop-blur-md sm:min-w-[270px]"
            >
              <div className="flex items-center justify-between gap-2 px-5 py-2 sm:px-7">
                <Link
                  href="/"
                  className="shrink-0 text-lg font-semibold tracking-[-0.04em] text-black"
                >
                  Petsaco
                </Link>

                <div className="flex-1 text-center">
                  <span className="text-sm font-medium text-black">
                    {currentPage}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center"
                >
                  <span className="relative block h-4 w-5 overflow-hidden">
                    <motion.span
                      animate={
                        isOpen
                          ? { top: "50%", y: "-50%", width: "20px", x: 0 }
                          : { top: "3px", y: "0%", width: "20px", x: 0 }
                      }
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-0 h-[1.5px] bg-black"
                    />

                    <motion.span
                      animate={
                        isOpen
                          ? {
                              top: "50%",
                              y: "-50%",
                              width: "12px",
                              x: 4,
                              opacity: 0,
                            }
                          : {
                              top: "11px",
                              y: "0%",
                              width: "20px",
                              x: 0,
                              opacity: 1,
                            }
                      }
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-0 h-[1.5px] bg-black"
                    />
                  </span>
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="menu"
                    variants={panelVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="overflow-hidden border-t border-black/10"
                  >
                    <motion.nav className="flex flex-col">
                      {navItems.map((item, index) => {
                        const isActive =
                          item.href === "/"
                            ? pathname === "/"
                            : item.href.startsWith("#")
                              ? false
                              : pathname.startsWith(item.href);

                        return (
                          <motion.div
                            key={item.label}
                            variants={itemVariants}
                            className="overflow-hidden"
                          >
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className="group relative flex items-center justify-between border-b border-black/10 px-5 py-4 last:border-b-0"
                            >
                              <span
                                className={`text-lg font-semibold tracking-[-0.03em] transition-colors duration-300 ${
                                  isActive
                                    ? "text-black"
                                    : "text-black/65 group-hover:text-black"
                                }`}
                              >
                                {item.label}
                              </span>

                              <span className="text-xs text-black/35">
                                0{index + 1}
                              </span>

                              <motion.span
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{
                                  duration: 0.45,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className="absolute bottom-0 left-0 h-px w-full origin-left bg-black"
                              />
                            </Link>
                          </motion.div>
                        );
                      })}

                      <motion.div
                        variants={itemVariants}
                        className="border-t border-black/10 px-5 py-4"
                      >
                        <CartButton />
                      </motion.div>
                    </motion.nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
