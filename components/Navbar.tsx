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

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.16,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function getCurrentPageLabel(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname.startsWith("/shop")) return "Shop";
  if (pathname.startsWith("/about")) return "About";
  if (pathname.startsWith("/contact")) return "Contact";
  if (pathname.startsWith("/cart")) return "Cart";
  return "Menu";
}

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
            <div className="flex min-w-[230px] sm:min-w-[270px] items-center justify-between gap-2 border border-black/10 bg-white/65 px-5 py-1.5 text-black backdrop-blur-md  sm:px-7">
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
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center"
              >
                <span className="relative block h-4 w-5">
                  <span
                    className={`absolute left-0 h-[1.5px] bg-black transition-all duration-300 ${
                      isOpen ? "top-1/2 w-5 -translate-y-1/2" : "top-[3px] w-5"
                    }`}
                  />
                  <span
                    className={`absolute left-0 h-[1.5px] bg-black transition-all duration-300 ${
                      isOpen
                        ? "top-1/2 w-0 opacity-0"
                        : "top-[11px] w-5 opacity-100"
                    }`}
                  />
                </span>
              </button>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute left-0 top-[calc(100%+10px)] w-full overflow-hidden border border-black/10 bg-white/90 shadow-lg backdrop-blur-md"
                >
                  <nav className="flex flex-col">
                    {navItems.map((item) => {
                      const isActive =
                        item.href === "/"
                          ? pathname === "/"
                          : item.href.startsWith("#")
                            ? false
                            : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`border-b border-black/10 px-5 py-4 text-lg font-semibold transition last:border-b-0 ${
                            isActive
                              ? "ml-2 text-black"
                              : "text-black/70 hover:text-black"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}

                    <div className="border-t border-black/10 px-5 py-4">
                      <CartButton />
                    </div>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
