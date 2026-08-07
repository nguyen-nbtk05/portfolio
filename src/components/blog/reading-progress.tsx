"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function ReadingProgress({ targetId }: { targetId: string }) {
  const progress = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const update = () => {
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const targetHeight = target.offsetHeight;
      const end = Math.max(targetTop + targetHeight - window.innerHeight, targetTop + 1);
      progress.set(clamp((window.scrollY - targetTop) / (end - targetTop)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(target);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [progress, targetId]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-slate-200/50 dark:bg-slate-800/50"
    >
      <motion.div
        className="h-full origin-left bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.55)] dark:bg-teal-400"
        style={{ scaleX: progress }}
        transition={{ duration: reduceMotion ? 0 : 0.08 }}
      />
    </div>
  );
}
