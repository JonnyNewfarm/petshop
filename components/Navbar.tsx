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

type NavbarTheme = {
  bg: string;
  text: string;
  logo: string;
  border: string;
};

const defaultTheme: NavbarTheme = {
  bg: "rgba(247, 244, 238, 0.65)",
  text: "#101010",
  logo: "#963d3a",
  border: "rgba(16, 16, 16, 0.1)",
};

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
  const [theme, setTheme] = useState<NavbarTheme>(defaultTheme);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const currentPage = getCurrentPageLabel(pathname);

  useEffect(() => {
    function handleTheme(event: Event) {
      const customEvent = event as CustomEvent<NavbarTheme>;

      if (!customEvent.detail) return;

      setTheme(customEvent.detail);
    }

    window.addEventListener("petsaco:nav-theme", handleTheme);

    return () => {
      window.removeEventListener("petsaco:nav-theme", handleTheme);
    };
  }, []);

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
              animate={{
                backgroundColor: theme.bg,
                color: theme.text,
              }}
              transition={{
                backgroundColor: {
                  duration: 1.1,
                  ease: [0.76, 0, 0.24, 1],
                },
                color: {
                  duration: 1.1,
                  ease: [0.76, 0, 0.24, 1],
                },
                layout: {
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="
                w-[310px] overflow-hidden
                backdrop-blur-xl
                md:w-[350px]
              "
            >
              <div className="grid h-[58px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-6">
                <motion.div
                  animate={{
                    color: theme.logo,
                  }}
                  transition={{
                    duration: 1.1,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  className="justify-self-start"
                >
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="
                      text-[20px] font-semibold
                      tracking-[-0.055em]
                    "
                  >
                    Petsaco
                  </Link>
                </motion.div>

                <motion.div
                  animate={{
                    color: theme.text,
                    opacity: 0.8,
                  }}
                  transition={{
                    duration: 1.1,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  className="justify-self-center"
                >
                  <Link
                    href={pathname === "/" ? "#top" : "/"}
                    onClick={() => setIsOpen(false)}
                    className="
                      text-[13px] font-medium
                      tracking-[-0.02em]
                      transition-opacity duration-300
                      hover:opacity-100
                    "
                  >
                    {currentPage}
                  </Link>
                </motion.div>

                <button
                  type="button"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="
                    group relative
                    inline-flex h-9 w-9
                    items-center justify-center
                    justify-self-end
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
                              backgroundColor: theme.text,
                            }
                          : {
                              top: "4px",
                              y: "0%",
                              rotate: 0,
                              width: "24px",
                              backgroundColor: theme.text,
                            }
                      }
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-0 h-px"
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
                              backgroundColor: theme.text,
                            }
                          : {
                              top: "12px",
                              y: "0%",
                              opacity: 1,
                              x: 0,
                              width: "24px",
                              backgroundColor: theme.text,
                            }
                      }
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-0 h-px"
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
                    style={{
                      borderColor: theme.border,
                    }}
                    className="overflow-hidden border-t"
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
                              style={{
                                borderColor: theme.border,
                              }}
                              className="
                                group relative grid grid-cols-[auto_1fr_auto]
                                items-center gap-5
                                border-b
                                px-5 py-5
                                last:border-b-0
                                md:px-6
                              "
                            >
                              <span
                                style={{
                                  color: theme.text,
                                  opacity: 0.35,
                                }}
                                className="text-[10px] uppercase tracking-[0.24em]"
                              >
                                0{index + 1}
                              </span>

                              <motion.span
                                animate={{
                                  color: isActive ? theme.logo : theme.text,
                                  opacity: isActive ? 1 : 0.75,
                                }}
                                transition={{
                                  duration: 0.6,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className="text-[30px] font-semibold leading-none tracking-[-0.065em]"
                              >
                                {item.label}
                              </motion.span>

                              <motion.span
                                animate={{
                                  backgroundColor: theme.logo,
                                }}
                                transition={{
                                  duration: 0.6,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className="
                                  absolute bottom-0 left-0 h-px w-full
                                  origin-left scale-x-0
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
                        style={{
                          borderColor: theme.border,
                        }}
                        className="border-t px-5 py-5 md:px-6"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span
                            style={{
                              color: theme.text,
                              opacity: 0.35,
                            }}
                            className="text-[10px] uppercase tracking-[0.24em]"
                          >
                            Cart
                          </span>

                          <span
                            style={{
                              color: theme.text,
                              opacity: 0.35,
                            }}
                            className="text-[10px] uppercase tracking-[0.24em]"
                          >
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
