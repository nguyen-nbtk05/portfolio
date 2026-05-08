"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { siteConfig } from "@/data/config";
import { useLanguage } from "@/hooks/use-language";

interface SplashScreenProps {
  onComplete?: () => void;
}

const bootLines = ["Loading profile", "Syncing projects", "Warming up motion", "Ready"];

const orbitNodes = [
  { className: "left-4 top-10 h-2.5 w-2.5 bg-yellow-300", delay: 0 },
  { className: "right-8 top-5 h-3 w-3 bg-amber-400", delay: 0.25 },
  { className: "bottom-8 left-10 h-2 w-2 bg-yellow-500", delay: 0.5 },
  { className: "bottom-4 right-12 h-2.5 w-2.5 bg-orange-400", delay: 0.75 },
];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, reduceMotion ? 500 : 6000);

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
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02, filter: "blur(10px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="network-grid absolute inset-0 opacity-70 dark:opacity-35" aria-hidden="true" />
          <motion.div
            className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-yellow-300/30 blur-3xl dark:bg-yellow-400/18"
            animate={reduceMotion ? undefined : { x: [0, 56, 8], y: [0, -28, 16], scale: [1, 1.18, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-amber-400/25 blur-3xl dark:bg-amber-400/15"
            animate={reduceMotion ? undefined : { x: [0, -48, -8], y: [0, 24, -18], scale: [1, 1.12, 1] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"
            initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: reduceMotion ? 0.35 : [0.25, 0.75, 0.25] }}
            transition={{ duration: reduceMotion ? 0.4 : 1.7, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.div
            className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative mb-8 h-40 w-40 sm:h-48 sm:w-48"
              initial={reduceMotion ? false : { scale: 0.78, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            >
              <motion.div
                className="absolute inset-0 rounded-full border border-amber-300/45 bg-gradient-to-br from-white/70 via-yellow-100/45 to-amber-200/45 shadow-[0_0_90px_rgba(251,191,36,0.35)] backdrop-blur-xl dark:border-amber-300/30 dark:from-slate-900/85 dark:via-amber-950/35 dark:to-yellow-950/25"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        boxShadow: [
                          "0 0 42px rgba(251,191,36,0.24)",
                          "0 0 90px rgba(245,158,11,0.32)",
                          "0 0 62px rgba(234,179,8,0.34)",
                          "0 0 42px rgba(251,191,36,0.24)",
                        ],
                      }
                }
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border border-dashed border-slate-400/45 dark:border-slate-500/45"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-7 rounded-full border border-yellow-300/70 dark:border-yellow-300/40"
                animate={reduceMotion ? undefined : { rotate: -360, scale: [1, 1.06, 1] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,transparent,rgba(250,204,21,0.72),transparent,rgba(245,158,11,0.58),transparent)] opacity-60 blur-sm" />
              {orbitNodes.map((node) => (
                <motion.span
                  key={node.className}
                  className={`absolute rounded-full shadow-[0_0_20px_currentColor] ${node.className}`}
                  animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.85, 1.25, 0.85] }}
                  transition={{ duration: 1.35, repeat: Infinity, delay: node.delay, ease: "easeInOut" }}
                />
              ))}
              <motion.div
                className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-amber-300/60 bg-slate-950 text-amber-300 shadow-2xl dark:bg-slate-50 dark:text-slate-950"
                animate={reduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
              >
                <Terminal className="h-9 w-9" />
              </motion.div>
            </motion.div>

            <motion.p
              className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-amber-600 dark:text-amber-300 sm:text-sm"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.25 }}
            >
              Initializing creative interface
            </motion.p>
            <motion.h1
              className="text-5xl font-black tracking-tight sm:text-6xl md:text-8xl"
              initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="bg-gradient-to-r from-slate-950 via-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-white dark:via-amber-300 dark:to-yellow-200">
                {siteConfig.name}
              </span>
              <span className="text-yellow-500">.</span>
            </motion.h1>
            <motion.p
              className="mt-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-lg font-semibold text-transparent sm:text-xl md:text-2xl"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.55 }}
            >
              {lang(siteConfig.role)}
            </motion.p>

            <motion.div
              className="mt-8 grid w-full max-w-md gap-2 rounded-2xl border border-slate-200/70 bg-white/55 p-3 text-left font-mono text-xs text-slate-600 shadow-2xl shadow-amber-500/10 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/55 dark:text-slate-300"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.7 }}
            >
              {bootLines.map((line, index) => (
                <motion.div
                  key={line}
                  className="flex items-center gap-3"
                  initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.85 + index * 0.16 }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.75)]" />
                  <span>{line}</span>
                  <span className="ml-auto text-emerald-500 dark:text-emerald-300">ok</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-slate-200/90 shadow-inner dark:bg-slate-800"
              aria-hidden="true"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500"
                initial={{ x: "-100%", scaleX: 0.65 }}
                animate={{ x: reduceMotion ? "0%" : "100%", scaleX: reduceMotion ? 1 : [0.65, 1, 0.65] }}
                transition={{ duration: reduceMotion ? 0.4 : 1.25, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
