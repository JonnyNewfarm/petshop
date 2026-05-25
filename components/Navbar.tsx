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
    y: -8,
    transition: {
      height: {
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1] as const,
      },
      opacity: {
        duration: 0.25,
        ease: "linear" as const,
      },
      y: {
        duration: 0.35,
        ease: [0.76, 0, 0.24, 1] as const,
      },
      when: "afterChildren",
      staggerChildren: 0.035,
      staggerDirection: -1,
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    y: 0,
    transition: {
      height: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
      opacity: {
        duration: 0.25,
        ease: "linear" as const,
      },
      y: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
      when: "beforeChildren",
      staggerChildren: 0.075,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  closed: {
    opacity: 0,
    y: 18,
    filter: "blur(6px)",
    transition: {
      duration: 0.35,
      ease: [0.76, 0, 0.24, 1] as const,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
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
      initial={{ opacity: 0, y: -22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 z-50 w-full"
    >
      <div className="relative mx-auto flex w-full max-w-[1760px] items-start justify-center px-4 py-5 sm:px-6 md:py-7 lg:px-10">
        <div className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 md:top-7">
          <div ref={wrapperRef} className="pointer-events-auto relative">
            <motion.div
              layout
              transition={{
                layout: {
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="
                w-[310px] overflow-hidden
                border border-black/10
                bg-[#f7f4ee]/72
                text-[#101010]
                backdrop-blur-xl
                md:w-[350px]
              "
            >
              <div className="grid h-[58px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-6">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="
                    justify-self-start
                    text-[20px] font-semibold
                    tracking-[-0.055em]
                    text-[#101010]
                  "
                >
                  Petsaco
                </Link>

                <Link
                  href={pathname === "/" ? "#top" : "/"}
                  onClick={() => setIsOpen(false)}
                  className="
                    justify-self-center
                    text-[13px] font-medium
                    tracking-[-0.02em]
                    text-[#101010]/80
                    transition-colors duration-300
                    hover:text-[#101010]
                  "
                >
                  {currentPage}
                </Link>

                <button
                  type="button"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="
                    group relative
                    inline-flex h-9 w-9
                    justify-self-end
                    items-center justify-center
                  "
                >
                  <span className="relative block h-4 w-6 overflow-hidden">
                    <motion.span
                      animate={
                        isOpen
                          ? {
                              top: "50%",
                              y: "-50%",
                              rotate: 0,
                              width: "24px",
                            }
                          : {
                              top: "4px",
                              y: "0%",
                              rotate: 0,
                              width: "24px",
                            }
                      }
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-0 h-px bg-[#101010]"
                    />

                    <motion.span
                      animate={
                        isOpen
                          ? {
                              top: "50%",
                              y: "-50%",
                              opacity: 0,
                              x: 8,
                              width: "14px",
                            }
                          : {
                              top: "12px",
                              y: "0%",
                              opacity: 1,
                              x: 0,
                              width: "24px",
                            }
                      }
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-0 h-px bg-[#101010]"
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
                              className="
                                group relative grid grid-cols-[auto_1fr_auto]
                                items-center gap-5
                                border-b border-black/10
                                px-5 py-5
                                last:border-b-0
                                md:px-6
                              "
                            >
                              <span className="text-[10px] uppercase tracking-[0.24em] text-[#101010]/35">
                                0{index + 1}
                              </span>

                              <span
                                className={`text-[30px] font-semibold leading-none tracking-[-0.065em] transition-colors duration-300 ${
                                  isActive
                                    ? "text-[#963d3a]"
                                    : "text-[#101010]/75 group-hover:text-[#101010]"
                                }`}
                              >
                                {item.label}
                              </span>

                              <span
                                className="
                                  absolute bottom-0 left-0 h-px w-full
                                  origin-left scale-x-0
                                  bg-[#963d3a]
                                  transition-transform duration-500
                                  group-hover:scale-x-100
                                "
                              />
                            </Link>
                          </motion.div>
                        );
                      })}

                      <motion.div
                        variants={itemVariants}
                        className="border-t border-black/10 px-5 py-5 md:px-6"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-[0.24em] text-[#101010]/35">
                            Cart
                          </span>

                          <span className="text-[10px] uppercase tracking-[0.24em] text-[#101010]/35">
                            Petsaco
                          </span>
                        </div>

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
