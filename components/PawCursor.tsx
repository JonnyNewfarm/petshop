"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PawCursor() {
  const pawRef = useRef<HTMLDivElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop || !pawRef.current) return;

    const xTo = gsap.quickTo(pawRef.current, "x", {
      duration: 0.5,
      ease: "power3",
    });

    const yTo = gsap.quickTo(pawRef.current, "y", {
      duration: 0.5,
      ease: "power3",
    });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      ref={pawRef}
      className="fixed left-0 top-0 z-[9999] pointer-events-none will-change-transform"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <img src="/paw.svg" className="w-4 h-4" />
    </div>
  );
}
