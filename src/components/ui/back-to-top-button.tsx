"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/hooks/use-lenis";
import { useLanguage } from "@/hooks/use-language";

const SHOW_AFTER_PX = 560;

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollYRef = useRef(0);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const { lang } = useLanguage();

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;
      const isScrollingUp = currentScrollY < lastScrollYRef.current;

      if (currentScrollY <= SHOW_AFTER_PX || isScrollingUp) {
        setIsVisible(false);
      } else if (isScrollingDown) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const moveToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: reduceMotion ? 0 : 1.2,
        force: true,
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  }, [lenis, reduceMotion]);

  const label = lang({ en: "Move to top", vi: "Lên đầu trang" });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={moveToTop}
          initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.92 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
          aria-label={label}
          title={label}
          className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-teal-400/50 bg-white/85 text-teal-700 shadow-lg shadow-slate-900/15 backdrop-blur-xl transition-colors hover:border-teal-500 hover:bg-teal-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 sm:bottom-7 sm:right-7 sm:h-12 sm:w-12 dark:border-teal-400/40 dark:bg-slate-950/85 dark:text-teal-300 dark:shadow-black/35 dark:hover:bg-teal-500 dark:hover:text-slate-950"
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
