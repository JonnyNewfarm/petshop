"use client";

import {
  useEffect,
  useContext,
  createContext,
  useState,
  useCallback,
} from "react";
import Lenis from "lenis";

type SmoothScrollerContextValue = {
  lenis: Lenis | null;
  stop: () => void;
  start: () => void;
};

const SmoothScrollerContext = createContext<SmoothScrollerContextValue>({
  lenis: null,
  stop: () => {},
  start: () => {},
});

export const useSmoothScroller = () => useContext(SmoothScrollerContext);

export default function ScrollSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenisRef, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const scroller = new Lenis({
      allowNestedScroll: true,
    });

    setLenis(scroller);

    let rafId = 0;

    function raf(time: number) {
      scroller.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      scroller.destroy();
    };
  }, []);

  const stop = useCallback(() => {
    lenisRef?.stop();
  }, [lenisRef]);

  const start = useCallback(() => {
    lenisRef?.start();
  }, [lenisRef]);

  return (
    <SmoothScrollerContext.Provider value={{ lenis: lenisRef, stop, start }}>
      {children}
    </SmoothScrollerContext.Provider>
  );
}
