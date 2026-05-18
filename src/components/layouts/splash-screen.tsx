"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/hooks/use-language";

interface SplashScreenProps {
  onComplete?: () => void;
}

const totalDuration = 5500;
const exitDuration = 500;
const hideAt = totalDuration - exitDuration;
const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const telemetryStates = [
  {
    en: "SYNC",
    vi: "DONG BO",
    toneClass: "text-amber-600 dark:text-amber-300",
    dotClass: "bg-amber-400 dark:bg-amber-300",
  },
  {
    en: "HEALTH",
    vi: "ON DINH",
    toneClass: "text-emerald-600 dark:text-emerald-300",
    dotClass: "bg-emerald-400 dark:bg-emerald-300",
  },
  {
    en: "ROUTE OK",
    vi: "TUYEN TOT",
    toneClass: "text-cyan-600 dark:text-cyan-300",
    dotClass: "bg-cyan-400 dark:bg-cyan-300",
  },
  {
    en: "SHIELD ON",
    vi: "LA CHAN ON",
    toneClass: "text-rose-600 dark:text-rose-300",
    dotClass: "bg-rose-400 dark:bg-rose-300",
  },
];

const throughputSeries = [2.4, 2.7, 2.5, 2.9];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getGridOpacity(phase: number) {
  if (phase <= 0.16) return 0.24 + (phase / 0.16) * 0.12;
  if (phase <= 0.9)
    return 0.36 + Math.sin(((phase - 0.16) / 0.74) * Math.PI) * 0.07;
  return 0.36 - ((phase - 0.9) / 0.1) * 0.12;
}

function getWaveOpacity(phase: number) {
  if (phase <= 0.16) return 0.28 + (phase / 0.16) * 0.12;
  if (phase <= 0.9)
    return 0.4 + Math.sin(((phase - 0.16) / 0.74) * Math.PI) * 0.06;
  return 0.4 - ((phase - 0.9) / 0.1) * 0.18;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [latencyMs, setLatencyMs] = useState(11);
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [throughputTarget, setThroughputTarget] = useState(throughputSeries[0]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setProgress(100);
      setIsVisible(false);
    }, hideAt);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const startedAt = performance.now();
    const updateProgress = () => {
      const elapsed = performance.now() - startedAt;
      const next = Math.min(100, Math.round((elapsed / hideAt) * 100));
      setProgress((current) => (current === next ? current : next));
      if (next >= 100) window.clearInterval(intervalId);
    };

    const intervalId = window.setInterval(updateProgress, 72);
    updateProgress();
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const latencyLoop = [11, 10, 12, 9, 11, 13, 10, 12];
    let cursor = 0;

    const latencyId = window.setInterval(() => {
      cursor = (cursor + 1) % latencyLoop.length;
      setLatencyMs(latencyLoop[cursor]);
    }, 840);

    return () => window.clearInterval(latencyId);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const telemetryId = window.setInterval(() => {
      setTelemetryIndex((current) => (current + 1) % telemetryStates.length);
    }, 1350);
    return () => window.clearInterval(telemetryId);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    let cursor = 0;
    const throughputId = window.setInterval(() => {
      cursor = (cursor + 1) % throughputSeries.length;
      setThroughputTarget(throughputSeries[cursor]);
    }, 1550);
    return () => window.clearInterval(throughputId);
  }, [reduceMotion]);

  const phase = progress / 100;
  const crescendo = reduceMotion ? 0 : clamp((phase - 0.96) / 0.04, 0, 1);
  const gridOpacity = reduceMotion
    ? 0.34
    : clamp(getGridOpacity(phase), 0.22, 0.5);
  const beamOpacity = reduceMotion
    ? 0.28
    : clamp(getWaveOpacity(phase), 0.2, 0.48);
  const volumetricOpacity = reduceMotion
    ? 0.2
    : clamp(beamOpacity + 0.02, 0.18, 0.5);
  const throughputValue = throughputTarget;
  const progressScale = progress / 100;

  const statusMetrics = useMemo(
    () => [
      {
        label: lang({ en: "NODES", vi: "NUT" }),
        value: "12",
        detail: lang({ en: "active nodes", vi: "nut hoat dong" }),
        dotClass: "bg-amber-400 dark:bg-amber-300",
        tintClass:
          "from-amber-300/20 via-amber-100/10 to-transparent dark:from-amber-300/10 dark:via-amber-300/5",
        valueClass: "text-amber-700 dark:text-amber-200",
        lineClass: "from-amber-300 via-amber-400 to-transparent",
      },
      {
        label: lang({ en: "SECURITY", vi: "BAO MAT" }),
        value: "0",
        detail: lang({ en: "intrusion alerts", vi: "canh bao xam nhap" }),
        dotClass: "bg-emerald-400 dark:bg-emerald-300",
        tintClass:
          "from-emerald-300/20 via-emerald-100/10 to-transparent dark:from-emerald-300/10 dark:via-emerald-300/5",
        valueClass: "text-emerald-700 dark:text-emerald-200",
        lineClass: "from-emerald-300 via-emerald-400 to-transparent",
      },
      {
        label: lang({ en: "LATENCY", vi: "DO TRE" }),
        value: `${latencyMs} ms`,
        detail: lang({ en: "stable", vi: "on dinh" }),
        dotClass: "bg-cyan-400 dark:bg-cyan-300",
        tintClass:
          "from-cyan-300/20 via-cyan-100/10 to-transparent dark:from-cyan-300/10 dark:via-cyan-300/5",
        valueClass: "text-cyan-700 dark:text-cyan-200",
        lineClass: "from-cyan-300 via-cyan-400 to-transparent",
      },
      {
        label: lang({ en: "UPTIME", vi: "UPTIME" }),
        value: "99.99%",
        detail: lang({ en: "target", vi: "muc tieu" }),
        dotClass: "bg-rose-400 dark:bg-rose-300",
        tintClass:
          "from-rose-300/20 via-rose-100/10 to-transparent dark:from-rose-300/10 dark:via-rose-300/5",
        valueClass: "text-rose-700 dark:text-rose-200",
        lineClass: "from-rose-300 via-rose-400 to-transparent",
      },
    ],
    [lang, latencyMs],
  );

  const telemetryState =
    telemetryStates[telemetryIndex % telemetryStates.length];
  const telemetryLabel = lang(telemetryState);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.02 }
          }
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1 }
          }
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: exitDuration / 1000 } }
              : {
                  opacity: 0,
                  scale: 0.98,
                  transition: {
                    duration: exitDuration / 1000,
                    ease: entranceEase,
                  },
                }
          }
          transition={{
            duration: reduceMotion ? 0.35 : 0.8,
            ease: entranceEase,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(245,158,11,0.22),transparent_42%),radial-gradient(circle_at_74%_20%,rgba(34,211,238,0.16),transparent_45%),radial-gradient(circle_at_88%_34%,rgba(148,163,184,0.2),transparent_50%),radial-gradient(circle_at_50%_84%,rgba(251,113,133,0.1),transparent_52%)] dark:bg-[radial-gradient(circle_at_18%_16%,rgba(251,191,36,0.24),transparent_42%),radial-gradient(circle_at_74%_20%,rgba(34,211,238,0.14),transparent_45%),radial-gradient(circle_at_88%_34%,rgba(100,116,139,0.28),transparent_50%),radial-gradient(circle_at_50%_84%,rgba(251,113,133,0.12),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-0 splash-accent-prisms opacity-70 dark:opacity-56" />
          <div className="pointer-events-none absolute inset-[-14%] splash-aurora-field opacity-70 dark:opacity-60" />
          <div
            className="pointer-events-none absolute inset-[-18%] splash-volumetric-band transition-opacity duration-300"
            style={{ opacity: volumetricOpacity }}
          />
          <div className="pointer-events-none absolute inset-[-8%] splash-routing-field opacity-[0.55] dark:opacity-[0.45]" />
          <div className="pointer-events-none absolute inset-0 splash-soft-grain opacity-[0.18] dark:opacity-[0.12]" />

          <div
            className="absolute inset-0 network-grid network-grid-strong network-grid-splash transition-opacity duration-300"
            style={{ opacity: gridOpacity }}
          />
          <div
            className="pointer-events-none absolute inset-[-12%] splash-beam-layer transition-opacity duration-300"
            style={{ opacity: beamOpacity }}
          />
          <div
            className="pointer-events-none absolute inset-[-12%] splash-beam-layer splash-beam-layer-alt transition-opacity duration-300"
            style={{ opacity: beamOpacity * 0.62 }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(15,23,42,0.25)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_34%,rgba(2,6,23,0.5)_100%)]" />

          <div className="relative z-10 w-full max-w-4xl px-5 sm:px-8">
            <motion.div
              className="splash-panel-type relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-300/80 bg-white/60 p-5 shadow-[0_35px_120px_-45px_rgba(15,23,42,0.85)] backdrop-blur-xl sm:p-7 dark:border-slate-700/75 dark:bg-slate-900/58"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 24 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0 }
              }
              transition={{
                duration: reduceMotion ? 0.3 : 0.8,
                ease: entranceEase,
                delay: reduceMotion ? 0 : 0.08,
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-amber-500/0 via-transparent to-slate-950/30 transition-opacity duration-200 dark:to-slate-950/50"
                style={{ opacity: crescendo * 0.2 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="relative mb-5 flex flex-col gap-2 overflow-hidden rounded-lg border border-cyan-200/70 bg-white/50 px-3 py-2 shadow-[0_18px_42px_-34px_rgba(8,145,178,0.8)] sm:flex-row sm:items-center sm:justify-between dark:border-cyan-300/20 dark:bg-slate-950/35"
                  initial={reduceMotion ? false : { opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: entranceEase,
                    delay: reduceMotion ? 0 : 0.15,
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 splash-rail-glint" />
                  <div className="relative z-10 flex min-w-0 items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    <span
                      className={`splash-signal-pulse inline-flex h-1.5 w-1.5 shrink-0 rounded-full ${telemetryState.dotClass}`}
                    />
                    <span className="shrink-0">
                      {lang({ en: "STATUS", vi: "TRANG THAI" })}
                    </span>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={telemetryLabel}
                        className={`truncate ${telemetryState.toneClass}`}
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }
                        }
                        transition={{ duration: 0.28, ease: entranceEase }}
                      >
                        {telemetryLabel}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="relative z-10 flex items-center justify-between gap-2 sm:justify-end">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {lang({ en: "THROUGHPUT", vi: "LUU LUONG" })}
                    </span>
                    <motion.span
                      key={throughputTarget}
                      className="font-mono text-xs font-semibold tracking-[0.06em] text-cyan-700 dark:text-cyan-200"
                      initial={reduceMotion ? false : { opacity: 0.65, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.34, ease: entranceEase }}
                    >
                      {throughputValue.toFixed(1)} Tb/s
                    </motion.span>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-wrap items-center justify-between gap-4"
                  initial={reduceMotion ? false : { opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: entranceEase,
                    delay: reduceMotion ? 0 : 0.25,
                  }}
                >
                  <div className="max-w-xl">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.28em] text-slate-500 dark:text-slate-400">
                      {lang({
                        en: "COMMAND CENTER INITIALIZATION",
                        vi: "KHOI DONG TRUNG TAM DIEU PHOI",
                      })}
                    </p>
                    <h2 className="splash-display-type mt-2 text-xl font-semibold leading-tight text-slate-900 sm:text-3xl dark:text-slate-50">
                      {lang({
                        en: "Synchronizing digital network fabric",
                        vi: "Dong bo nen tang mang so",
                      })}
                    </h2>
                  </div>
                </motion.div>

                <div className="mt-6 grid overflow-hidden rounded-lg border border-slate-300/70 bg-white/45 sm:grid-cols-4 dark:border-slate-700/70 dark:bg-slate-950/30">
                  {statusMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      className={`relative min-w-0 bg-gradient-to-br px-4 py-3 ${metric.tintClass} ${
                        index < statusMetrics.length - 1
                          ? "border-b border-slate-300/60 sm:border-b-0 sm:border-r dark:border-slate-700/60"
                          : ""
                      }`}
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        ease: entranceEase,
                        delay: reduceMotion ? 0 : 0.15 + index * 0.08,
                      }}
                    >
                      <span
                        className={`pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r ${metric.lineClass}`}
                      />
                      <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        <span
                          className={`splash-signal-pulse inline-flex h-1.5 w-1.5 shrink-0 rounded-full ${metric.dotClass}`}
                          style={{ animationDelay: `${index * 0.2}s` }}
                        />
                        <span className="truncate">{metric.label}</span>
                      </div>
                      <p
                        className={`splash-display-type mt-2 truncate text-lg font-semibold ${metric.valueClass}`}
                      >
                        {metric.value}
                      </p>
                      <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                        {metric.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="relative mt-5 overflow-hidden rounded-lg border border-amber-200/80 bg-white/50 p-4 shadow-[0_20px_55px_-45px_rgba(245,158,11,0.85)] dark:border-amber-300/20 dark:bg-slate-950/35"
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: entranceEase,
                    delay: reduceMotion ? 0 : 0.45,
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 splash-panel-glow" />
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      {lang({
                        en: "SYSTEM BOOTSTRAP",
                        vi: "KHOI TAO HE THONG",
                      })}
                    </p>
                    <span className="font-mono text-xs font-semibold tracking-[0.16em] text-slate-600 dark:text-slate-300">
                      {progress}%
                    </span>
                  </div>
                  <div
                    className="relative z-10 mt-5 h-2 w-full overflow-hidden rounded-full border border-amber-400/30 bg-amber-500/5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] backdrop-blur-sm dark:border-amber-500/20 dark:bg-amber-950/20 dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 right-0 origin-left rounded-full bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)] will-change-transform dark:from-amber-400 dark:to-amber-200"
                      initial={false}
                      animate={{ scaleX: progressScale }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : {
                              type: "spring",
                              stiffness: 200,
                              damping: 25,
                              mass: 0.5,
                            }
                      }
                    />
                    {!reduceMotion && (
                      <motion.div
                        className="absolute inset-y-0 -left-20 w-24 bg-gradient-to-r from-transparent via-white/30 to-white/90 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] mix-blend-overlay"
                        style={{ skewX: -25 }}
                        animate={{ x: ["-100%", "1000%"] }}
                        transition={{
                          duration: 2.2,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 0.5,
                        }}
                      />
                    )}
                  </div>
                  <p className="relative z-10 mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    {lang({
                      en: "Calibrating modules and preparing live interface.",
                      vi: "Dang hieu chinh module va san sang giao dien truc tiep.",
                    })}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
