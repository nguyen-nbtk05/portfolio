"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import type Lenis from "lenis";
import { useLenis } from "@/hooks/use-lenis";

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getDocumentProgress() {
  const scrollLimit = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollLimit <= 0) return 0;

  return clampProgress(window.scrollY / scrollLimit);
}

export function ScrollProgress() {
  const lenis = useLenis();
  const progress = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const isBlogArticle = /^\/blog\/[^/]+\/?$/.test(pathname);

  useEffect(() => {
    if (isBlogArticle) return;

    const updateFromDocument = () => {
      progress.set(getDocumentProgress());
    };

    const updateFromLenis = (instance: Lenis) => {
      progress.set(
        instance.limit > 0
          ? clampProgress(instance.progress)
          : getDocumentProgress(),
      );
    };

    updateFromDocument();

    const unsubscribe = lenis?.on("scroll", updateFromLenis);

    if (!lenis) {
      window.addEventListener("scroll", updateFromDocument, { passive: true });
    }

    window.addEventListener("resize", updateFromDocument);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateFromDocument);

    resizeObserver?.observe(document.documentElement);

    return () => {
      unsubscribe?.();
      window.removeEventListener("scroll", updateFromDocument);
      window.removeEventListener("resize", updateFromDocument);
      resizeObserver?.disconnect();
    };
  }, [isBlogArticle, lenis, progress]);

  if (isBlogArticle) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-3 z-40 hidden items-center sm:right-5 sm:flex md:right-6"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="h-32 w-2 overflow-hidden rounded-full bg-slate-900/15 shadow-inner dark:bg-slate-700/45"
      >
        <motion.div
          data-scroll-progress-fill
          className="h-full w-full origin-top rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.4)] dark:bg-teal-400"
          style={{ scaleY: progress }}
        />
      </motion.div>
    </div>
  );
}
