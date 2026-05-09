"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/config";
import { useLanguage } from "@/hooks/use-language";

interface SplashScreenProps {
  onComplete?: () => void;
}

// Custom easing for buttery smooth transitions
const customEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Keep exactly 5500ms before triggering unmount sequence
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, 5500);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50"
          initial={reduceMotion ? false : { opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 1.2, ease: customEase }}
        >
          {/* Animated Background Splice */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-slate-100 dark:bg-slate-900"
            initial={reduceMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1.2, ease: customEase }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-amber-50 dark:bg-amber-950/10"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 1.2, ease: customEase }}
          />

          {/* Clean 2D Geometric Elements */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Background minimal rings */}
            <motion.div
              className="absolute w-[40vmax] h-[40vmax] rounded-full border-[2px] border-amber-500/30 dark:border-amber-400/20"
              initial={reduceMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, ease: customEase, delay: 0.2 }}
            />
            <motion.div
              className="absolute w-[60vmax] h-[60vmax] rounded-full border-[1px] border-slate-300/80 dark:border-slate-700/80"
              initial={reduceMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.5, ease: customEase, delay: 0.1 }}
            />
            <motion.div
              className="absolute w-full h-[1px] bg-slate-300 dark:bg-slate-800"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.8, ease: customEase, delay: 0.4 }}
            />
            <motion.div
              className="absolute w-[1px] h-full bg-slate-300 dark:bg-slate-800"
              initial={reduceMotion ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.8, ease: customEase, delay: 0.4 }}
            />

            {/* Prominent Solid Core Shapes */}
            <motion.div
              className="absolute w-40 h-40 md:w-56 md:h-56 border-[12px] border-amber-400 dark:border-amber-500 shadow-2xl shadow-amber-500/20"
              initial={reduceMotion ? false : { rotate: -45, scale: 0 }}
              animate={{ rotate: 135, scale: 1 }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            />
            <motion.div
              className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full bg-amber-400 dark:bg-amber-500 shadow-xl shadow-amber-500/40"
              initial={reduceMotion ? false : { x: -80, y: -80, scale: 0 }}
              animate={{
                x: [80, -80],
                y: [80, -80],
                scale: 1,
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          {/* Typography Reveal Layout */}
          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center">
            {/* Small Label */}
            <div className="overflow-hidden mb-6">
              <motion.p
                className="font-mono text-sm tracking-[0.2em] text-slate-600 dark:text-slate-400 font-semibold"
                initial={reduceMotion ? false : { y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: customEase, delay: 0.5 }}
              >
                INITIALIZING
              </motion.p>
            </div>

            {/* Name Reveal */}
            <div className="overflow-hidden p-2">
              <motion.h1
                className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white"
                initial={reduceMotion ? false : { y: "110%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1, ease: customEase, delay: 0.6 }}
              >
                {siteConfig.name}
                <motion.span
                  className="text-amber-500"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  .
                </motion.span>
              </motion.h1>
            </div>

            {/* Role Reveal */}
            <div className="overflow-hidden mt-6">
              <motion.p
                className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-300"
                initial={reduceMotion ? false : { y: "-100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: customEase, delay: 0.8 }}
              >
                {lang(siteConfig.role)}
              </motion.p>
            </div>

            {/* Prominent Progress Line */}
            <motion.div
              className="mt-16 w-80 max-w-full h-2 bg-slate-200 dark:bg-slate-800 relative overflow-hidden rounded-full shadow-inner"
              initial={reduceMotion ? false : { opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.2, ease: customEase, delay: 1 }}
            >
              <motion.div
                className="absolute top-0 left-0 bottom-0 w-1/3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: "300%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
