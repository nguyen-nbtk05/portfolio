"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import { useLanguage } from "@/hooks/use-language";

interface SplashScreenProps {
  onComplete?: () => void;
}

type SplashPhase = "loading" | "ready_for_interaction" | "exiting";

const LOADING_DURATION_MS = 3400;
const PROGRESS_TICK_MS = 72;
const EXIT_DURATION_SECONDS = 0.5;
const ENTRANCE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ILLUSTRATION_NODES = [
  { top: "14%", left: "18%", delay: 0, duration: 4.8, size: 8 },
  { top: "24%", left: "76%", delay: 0.8, duration: 5.2, size: 6 },
  { top: "38%", left: "10%", delay: 1.2, duration: 4.6, size: 10 },
  { top: "48%", left: "82%", delay: 0.4, duration: 5.4, size: 7 },
  { top: "68%", left: "16%", delay: 1.1, duration: 5.1, size: 8 },
  { top: "76%", left: "72%", delay: 0.2, duration: 4.4, size: 7 },
];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<SplashPhase>("loading");
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (phase !== "loading") return;

    const startedAt = performance.now();
    const updateProgress = () => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = Math.min(
        100,
        Math.round((elapsed / LOADING_DURATION_MS) * 100),
      );

      setProgress((current) =>
        current === nextProgress ? current : nextProgress,
      );

      if (nextProgress >= 100) {
        setProgress(100);
        setPhase("ready_for_interaction");
        window.clearInterval(intervalId);
      }
    };

    const intervalId = window.setInterval(updateProgress, PROGRESS_TICK_MS);
    updateProgress();

    return () => window.clearInterval(intervalId);
  }, [phase]);

  const handleEnterApp = () => {
    if (phase !== "ready_for_interaction") return;

    setPhase("exiting");
    setIsVisible(false);
  };

  const progressScale = progress / 100;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label={lang({
            en: "Loading portfolio",
            vi: "Äang táº£i portfolio",
          })}
          data-phase={phase}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-amber-50 text-slate-900 dark:bg-slate-950 dark:text-amber-100"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: EXIT_DURATION_SECONDS } }
              : {
                  opacity: 0,
                  scale: 0.99,
                  transition: {
                    duration: EXIT_DURATION_SECONDS,
                    ease: ENTRANCE_EASE,
                  },
                }
          }
          transition={{
            duration: reduceMotion ? 0.28 : 0.58,
            ease: ENTRANCE_EASE,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(251,191,36,0.42),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(251,146,60,0.3),transparent_42%),radial-gradient(circle_at_50%_86%,rgba(245,158,11,0.24),transparent_48%)] dark:bg-[radial-gradient(circle_at_20%_16%,rgba(245,158,11,0.3),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(249,115,22,0.22),transparent_42%),radial-gradient(circle_at_50%_86%,rgba(234,88,12,0.18),transparent_48%)]" />
          <div className="pointer-events-none absolute inset-0 splash-v2-noise opacity-70 dark:opacity-45" />
          <div className="pointer-events-none absolute inset-0 splash-v2-starfield opacity-65 dark:opacity-60" />

          <div className="pointer-events-none absolute inset-0">
            <div className="splash-v2-beam absolute -left-[24%] top-[4%] h-[40%] w-[72%]" />
            <div className="splash-v2-beam splash-v2-beam-alt absolute -right-[22%] bottom-[4%] h-[42%] w-[70%]" />
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className="splash-v2-orb splash-v2-orb-a splash-v2-float-a absolute left-[10%] top-[18%] h-44 w-44" />
            <div className="splash-v2-orb splash-v2-orb-b splash-v2-float-b absolute right-[8%] top-[8%] h-52 w-52" />
            <div className="splash-v2-orb splash-v2-orb-c splash-v2-float-c absolute bottom-[6%] left-[34%] h-56 w-56" />
          </div>

          <div className="pointer-events-none absolute inset-0">
            {ILLUSTRATION_NODES.map((node) => (
              <span
                key={`${node.top}-${node.left}`}
                className="absolute rounded-full bg-amber-100/90 shadow-[0_0_0_1px_rgba(251,191,36,0.6),0_0_18px_rgba(249,115,22,0.5)] dark:bg-amber-200/80 splash-v2-node-pulse"
                style={
                  {
                    top: node.top,
                    left: node.left,
                    width: node.size,
                    height: node.size,
                    "--node-delay": `${node.delay}s`,
                    "--node-duration": `${node.duration}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <div className="relative z-10 w-full max-w-4xl px-5 sm:px-8">
            <motion.div
              className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-amber-100/75 bg-white/58 p-6 shadow-[0_28px_84px_-48px_rgba(120,53,15,0.48)] backdrop-blur-xl sm:p-8 dark:border-amber-300/20 dark:bg-slate-900/48"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0.22 : 0.56,
                ease: ENTRANCE_EASE,
                delay: reduceMotion ? 0 : 0.06,
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-300/35 via-orange-200/10 to-transparent dark:from-amber-400/14 dark:via-orange-500/8" />

              <div className="relative z-10">
                <motion.div
                  className="mx-auto flex max-w-2xl flex-col items-center text-center"
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: reduceMotion ? 0.2 : 0.58,
                    ease: ENTRANCE_EASE,
                    delay: reduceMotion ? 0 : 0.04,
                  }}
                >
                  <p className="splash-v2-code-font text-[10px] font-bold uppercase tracking-[0.34em] text-amber-700/85 dark:text-amber-200/80">
                    {lang({
                      en: "Portfolio Skills",
                      vi: "Trải Nghiệm Portfolio",
                    })}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/75 bg-white/60 px-4 py-1.5 shadow-[0_12px_28px_-20px_rgba(146,64,14,0.7)] backdrop-blur-md dark:border-amber-300/25 dark:bg-amber-200/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.75)]" />
                    <span className="splash-v2-code-font text-[11px] font-bold uppercase tracking-[0.22em] text-orange-600 dark:text-amber-100">
                      {lang({ en: "Welcome", vi: "Chào Mừng" })}
                    </span>
                  </div>

                  <h1 className="splash-v2-title-lockup splash-v2-title-font relative mt-4 whitespace-nowrap text-[clamp(1.6rem,3.85vw,3rem)] font-semibold leading-none tracking-[-0.035em] text-slate-950 dark:text-amber-50">
                    <span className="splash-v2-title-word inline-block text-slate-900/90 dark:text-amber-50">
                      Entering My
                    </span>{" "}
                    <span className="splash-v2-title-word splash-v2-title-word-alt relative inline-block font-black tracking-[-0.045em]">
                      <span className="splash-v2-title-gradient relative z-10 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-amber-200 dark:via-orange-400 dark:to-amber-300">
                        Creative Space
                      </span>
                      <span
                        aria-hidden="true"
                        className="splash-v2-title-swoosh"
                      />
                    </span>
                  </h1>

                  <p className="splash-v2-subtitle-pill mt-5 max-w-xl px-4 py-1.5 text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-200 sm:text-[15px]">
                    {lang({
                      en: "A warm little space where code, motion, and ideas come together.",
                      vi: "Một không gian nhỏ nơi ý tưởng, chuyển động và mã nguồn gặp nhau.",
                    })}
                  </p>
                </motion.div>

                <motion.div
                  className="mx-auto mt-8 w-full max-w-[42rem]"
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    ease: ENTRANCE_EASE,
                    delay: reduceMotion ? 0 : 0.18,
                  }}
                >
                  <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-200">
                    <span>{lang({ en: "Loading", vi: "Äang táº£i" })}</span>
                    <span>{progress}%</span>
                  </div>

                  <div
                    className="relative h-3 w-full overflow-hidden rounded-full border border-amber-300/70 bg-amber-100/45 shadow-[inset_0_2px_4px_rgba(120,53,15,0.16)] dark:border-amber-300/25 dark:bg-amber-950/30 dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.45)]"
                    role="progressbar"
                    aria-label={lang({
                      en: "Splash loading progress",
                      vi: "Tiáº¿n trÃ¬nh táº£i splash",
                    })}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 right-0 origin-left rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]"
                      initial={false}
                      animate={{ scaleX: progressScale }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : {
                              type: "spring",
                              stiffness: 160,
                              damping: 24,
                              mass: 0.6,
                            }
                      }
                    />
                  </div>
                </motion.div>

                <div className="mt-8 flex min-h-20 items-center justify-center">
                  <AnimatePresence mode="wait">
                    {phase === "ready_for_interaction" ? (
                      <motion.div
                        key="cta-ready"
                        className="splash-v2-cta-shell relative"
                        initial={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: 14, scale: 0.88 }
                        }
                        animate={
                          reduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, y: 0, scale: 1 }
                        }
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: -10, scale: 0.96 }
                        }
                        transition={{
                          duration: reduceMotion ? 0.2 : 0.42,
                          ease: ENTRANCE_EASE,
                        }}
                      >
                        <motion.button
                          type="button"
                          onClick={handleEnterApp}
                          aria-label={lang({
                            en: "Enter portfolio",
                            vi: "VÃ o portfolio",
                          })}
                          className="splash-v2-pro-button group relative inline-flex items-center gap-3.5 overflow-hidden rounded-full border border-amber-500 bg-white py-2.5 pl-6 pr-3.5 text-[15px] font-extrabold uppercase tracking-[0.17em] text-amber-700 shadow-[0_16px_34px_-20px_rgba(251,146,60,0.72)] transition-[color,border-color] duration-200 hover:border-amber-500 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 dark:border-amber-500 dark:bg-white dark:text-amber-700 dark:hover:text-white dark:focus-visible:text-white"
                          whileHover={
                            reduceMotion
                              ? undefined
                              : {
                                  y: -5,
                                  scale: 1.025,
                                  boxShadow:
                                    "0 22px 44px -16px rgba(251,146,60,0.92)",
                                }
                          }
                          whileTap={
                            reduceMotion
                              ? undefined
                              : {
                                  scale: 0.975,
                                  rotate: -0.3,
                                }
                          }
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : {
                                  type: "spring",
                                  stiffness: 650,
                                  damping: 34,
                                  mass: 0.42,
                                }
                          }
                        >
                          <span className="relative z-20 transition-colors duration-500">
                            {lang({
                              en: "Launch",
                              vi: "Báº¯t Äáº§u",
                            })}
                          </span>
                          <span className="relative z-20 inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-amber-500 text-white shadow-[0_10px_22px_-12px_rgba(120,53,15,0.8)] transition-[background-color,color] duration-500 group-hover:bg-white group-hover:text-amber-600 group-focus-visible:bg-white group-focus-visible:text-amber-600">
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45 group-focus-visible:rotate-45"
                              fill="none"
                              focusable="false"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M6.5 17.5 17.5 6.5M9 6.5h8.5V15"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.8"
                              />
                            </svg>
                          </span>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="cta-loading-state"
                        className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-amber-700/85 dark:text-amber-300/75"
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={
                          reduceMotion
                            ? { opacity: 1 }
                            : { opacity: [0.5, 1, 0.5], y: [0, -1, 0] }
                        }
                        transition={
                          reduceMotion
                            ? { duration: 0.2 }
                            : {
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }
                        }
                      >
                        {lang({
                          en: "Preparing interactive entrance...",
                          vi: "Äang chuáº©n bá»‹ lá»‘i vÃ o tÆ°Æ¡ng tÃ¡c...",
                        })}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
