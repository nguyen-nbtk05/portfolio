"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { siteConfig } from "@/data/config";
import { useLanguage } from "@/hooks/use-language";

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, reduceMotion ? 450 : 1900);

    return () => window.clearTimeout(timeoutId);
  }, [reduceMotion]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50"
          initial={reduceMotion ? false : { opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="network-grid absolute inset-0 opacity-65 dark:opacity-35" aria-hidden="true" />
          <motion.div
            className="relative z-10 flex flex-col items-center px-[1cm] text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-400/40 bg-yellow-100/80 text-yellow-600 shadow-[0_0_40px_rgba(234,179,8,0.18)] backdrop-blur dark:bg-yellow-900/20 dark:text-yellow-300"
              animate={reduceMotion ? undefined : { boxShadow: [
                "0 0 24px rgba(234,179,8,0.16)",
                "0 0 48px rgba(234,179,8,0.34)",
                "0 0 24px rgba(234,179,8,0.16)",
              ] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              <Terminal className="h-8 w-8" />
            </motion.div>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Initializing session
            </p>
            <h1 className="text-5xl font-bold tracking-tighter md:text-7xl">
              {siteConfig.name}
              <span className="text-yellow-500">.</span>
            </h1>
            <p className="mt-4 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-xl font-semibold text-transparent md:text-2xl">
              {lang(siteConfig.role)}
            </p>
            <motion.div
              className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
              aria-hidden="true"
            >
              <motion.div
                className="h-full rounded-full bg-yellow-500"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: reduceMotion ? 0.4 : 1.2, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
