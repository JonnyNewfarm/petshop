"use client";

import { motion } from "framer-motion";

export default function PageTransitionOverlay({
  pathname,
}: {
  pathname: string;
}) {
  return (
    <motion.div
      key={pathname}
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{
        duration: 0.9,
        ease: [0.83, 0, 0.17, 1],
      }}
      className="pointer-events-none fixed inset-0 z-[9999] origin-top bg-black will-change-transform"
    />
  );
}
