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

const signalBars = [0.28, 0.54, 0.35, 0.77, 0.48, 0.9, 0.62, 0.4, 0.81, 0.51, 0.72, 0.44];

const accentOrbs = [
  { top: "8%", left: "12%", size: "18rem", delay: 0, duration: 6.8, className: "bg-amber-400/35" },
  { top: "18%", left: "74%", size: "14rem", delay: 0.7, duration: 7.4, className: "bg-cyan-300/28 dark:bg-cyan-500/22" },
  { top: "64%", left: "68%", size: "17rem", delay: 1.2, duration: 8.2, className: "bg-amber-500/25" },
  { top: "72%", left: "18%", size: "12rem", delay: 1.9, duration: 7.1, className: "bg-rose-300/20 dark:bg-rose-500/16" },
];

const tickerMessages = [
  {
    en: "Routing TLS handshake through edge gateway and policy mesh.",
    vi: "Dang dinh tuyen TLS handshake qua edge gateway va policy mesh.",
  },
  {
    en: "Synchronizing ACL tables across core router and switch cluster.",
    vi: "Dang dong bo bang ACL giua core router va switch cluster.",
  },
  {
    en: "Stabilizing packet jitter and validating failover heartbeat.",
    vi: "Dang on dinh packet jitter va xac thuc failover heartbeat.",
  },
  {
    en: "Calibrating traffic priorities for interactive workloads.",
    vi: "Dang hieu chinh uu tien luong cho interactive workloads.",
  },
];

const telemetryStates = [
  {
    en: "SYNC",
    vi: "DONG BO",
    toneClass: "text-amber-600 dark:text-amber-300",
    dotClass: "bg-amber-400 dark:bg-amber-300",
    ringClass: "border-amber-400/55 dark:border-amber-300/45",
    centerClass: "bg-amber-400 dark:bg-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.8)]",
    sweepClass: "splash-radar-sweep-amber",
  },
  {
    en: "HEALTH",
    vi: "ON DINH",
    toneClass: "text-emerald-600 dark:text-emerald-300",
    dotClass: "bg-emerald-400 dark:bg-emerald-300",
    ringClass: "border-emerald-400/55 dark:border-emerald-300/45",
    centerClass: "bg-emerald-400 dark:bg-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.7)]",
    sweepClass: "splash-radar-sweep-emerald",
  },
  {
    en: "ROUTE OK",
    vi: "TUYEN TOT",
    toneClass: "text-cyan-600 dark:text-cyan-300",
    dotClass: "bg-cyan-400 dark:bg-cyan-300",
    ringClass: "border-cyan-400/55 dark:border-cyan-300/45",
    centerClass: "bg-cyan-400 dark:bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.7)]",
    sweepClass: "splash-radar-sweep-cyan",
  },
  {
    en: "SHIELD ON",
    vi: "LA CHAN ON",
    toneClass: "text-rose-600 dark:text-rose-300",
    dotClass: "bg-rose-400 dark:bg-rose-300",
    ringClass: "border-rose-400/55 dark:border-rose-300/45",
    centerClass: "bg-rose-400 dark:bg-rose-300 shadow-[0_0_16px_rgba(251,113,133,0.66)]",
    sweepClass: "splash-radar-sweep-rose",
  },
];

const protocolTokens = ["BGP", "TLS 1.3", "ACL", "QOS", "WAF", "IDS", "VXLAN", "MPLS"];
const throughputSeries = [2.4, 2.7, 2.5, 2.9];
const packetBlips = [
  { duration: 2.3, delay: 0, top: "38%", className: "bg-amber-400 dark:bg-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.75)]" },
  { duration: 2.9, delay: 0.65, top: "54%", className: "bg-cyan-400 dark:bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.66)]" },
  { duration: 3.4, delay: 1.15, top: "68%", className: "bg-rose-400 dark:bg-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.62)]" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getGridOpacity(phase: number) {
  if (phase <= 0.16) return 0.24 + (phase / 0.16) * 0.12;
  if (phase <= 0.9) return 0.36 + Math.sin(((phase - 0.16) / 0.74) * Math.PI) * 0.07;
  return 0.36 - ((phase - 0.9) / 0.1) * 0.12;
}

function getWaveOpacity(phase: number) {
  if (phase <= 0.16) return 0.28 + (phase / 0.16) * 0.12;
  if (phase <= 0.9) return 0.4 + Math.sin(((phase - 0.16) / 0.74) * Math.PI) * 0.06;
  return 0.4 - ((phase - 0.9) / 0.1) * 0.18;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
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
    const tickerId = window.setInterval(() => {
      setTickerIndex((current) => (current + 1) % tickerMessages.length);
    }, 980);
    return () => window.clearInterval(tickerId);
  }, [reduceMotion]);

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
  const gridOpacity = reduceMotion ? 0.34 : clamp(getGridOpacity(phase), 0.22, 0.5);
  const beamOpacity = reduceMotion ? 0.28 : clamp(getWaveOpacity(phase), 0.2, 0.48);
  const volumetricOpacity = reduceMotion ? 0.2 : clamp(beamOpacity + 0.02, 0.18, 0.5);
  const throughputValue = throughputTarget;

  const statusCards = useMemo(
    () => [
      {
        label: lang({ en: "ONLINE", vi: "TRUC TUYEN" }),
        value: lang({ en: "12 active nodes", vi: "12 nut dang hoat dong" }),
        dotClass: "bg-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.8)] dark:bg-amber-300",
      },
      {
        label: lang({ en: "SECURE", vi: "AN TOAN" }),
        value: lang({ en: "Zero intrusion alerts", vi: "Khong co canh bao xam nhap" }),
        dotClass: "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.7)] dark:bg-emerald-300",
      },
      {
        label: lang({ en: "LATENCY", vi: "DO TRE" }),
        value: lang({
          en: `${latencyMs} ms stable`,
          vi: `${latencyMs} ms on dinh`,
        }),
        dotClass: "bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.7)] dark:bg-cyan-300",
      },
    ],
    [lang, latencyMs],
  );

  const activeTicker = lang(tickerMessages[tickerIndex % tickerMessages.length]);
  const telemetryState = telemetryStates[telemetryIndex % telemetryStates.length];
  const telemetryLabel = lang(telemetryState);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02, filter: "blur(12px)" }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: exitDuration / 1000 } }
              : {
                  opacity: 0,
                  scale: 0.985,
                  filter: "blur(8px)",
                  transition: { duration: exitDuration / 1000, ease: entranceEase },
                }
          }
          transition={{ duration: reduceMotion ? 0.35 : 0.8, ease: entranceEase }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(245,158,11,0.22),transparent_42%),radial-gradient(circle_at_74%_20%,rgba(34,211,238,0.16),transparent_45%),radial-gradient(circle_at_88%_34%,rgba(148,163,184,0.2),transparent_50%),radial-gradient(circle_at_50%_84%,rgba(251,113,133,0.1),transparent_52%)] dark:bg-[radial-gradient(circle_at_18%_16%,rgba(251,191,36,0.24),transparent_42%),radial-gradient(circle_at_74%_20%,rgba(34,211,238,0.14),transparent_45%),radial-gradient(circle_at_88%_34%,rgba(100,116,139,0.28),transparent_50%),radial-gradient(circle_at_50%_84%,rgba(251,113,133,0.12),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-0 splash-accent-prisms opacity-70 dark:opacity-56" />
          <div
            className="pointer-events-none absolute inset-[-18%] splash-volumetric-band transition-opacity duration-300"
            style={{ opacity: volumetricOpacity }}
          />
          <div className="pointer-events-none absolute inset-0 splash-soft-grain opacity-[0.18] dark:opacity-[0.12]" />

          {!reduceMotion &&
            accentOrbs.map((orb) => (
              <span
                key={`${orb.top}-${orb.left}`}
                className={`pointer-events-none absolute rounded-full blur-[110px] splash-orb-float ${orb.className}`}
                style={{
                  top: orb.top,
                  left: orb.left,
                  width: orb.size,
                  height: orb.size,
                  animationDuration: `${orb.duration}s`,
                  animationDelay: `${orb.delay}s`,
                }}
              />
            ))}

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
              className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-300/80 bg-white/60 p-5 shadow-[0_35px_120px_-45px_rgba(15,23,42,0.85)] backdrop-blur-2xl sm:p-7 dark:border-slate-700/75 dark:bg-slate-900/58"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(10px)" }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: reduceMotion ? 0.3 : 0.8, ease: entranceEase, delay: reduceMotion ? 0 : 0.08 }}
            >
              <div className="pointer-events-none absolute right-4 top-4 hidden h-14 w-14 sm:block">
                <div className="relative h-full w-full overflow-hidden rounded-full border border-slate-300/80 bg-slate-100/65 dark:border-slate-600/70 dark:bg-slate-800/55">
                  <span className={`absolute inset-[20%] rounded-full ${telemetryState.ringClass}`} />
                  <span className={`splash-radar-ring absolute inset-[8%] rounded-full ${telemetryState.ringClass}`} />
                  <span
                    className={`splash-radar-ring absolute inset-[8%] rounded-full ${telemetryState.ringClass}`}
                    style={{ animationDelay: "1.25s" }}
                  />
                  <span className={`absolute inset-[12%] rounded-full ${telemetryState.sweepClass}`} />
                  <span className={`absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${telemetryState.centerClass}`} />
                </div>
              </div>

              <div
                className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-amber-500/0 via-transparent to-slate-950/30 transition-opacity duration-200 dark:to-slate-950/50"
                style={{ opacity: crescendo * 0.2 }}
              />

              <div className="relative z-10">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-full border border-slate-300/75 bg-slate-100/70 px-3 py-1.5 dark:border-slate-700/70 dark:bg-slate-900/55">
                  <div className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    <span className={`splash-signal-pulse inline-flex h-2 w-2 rounded-full ${telemetryState.dotClass}`} />
                    <span>{lang({ en: "TELEMETRY", vi: "TELEMETRY" })}</span>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={telemetryLabel}
                        className={telemetryState.toneClass}
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.28, ease: entranceEase }}
                      >
                        {telemetryLabel}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {lang({ en: "THROUGHPUT", vi: "LUU LUONG" })}
                    </span>
                    <motion.span
                      key={throughputTarget}
                      className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text font-mono text-xs font-bold tracking-[0.08em] text-transparent dark:from-amber-300 dark:via-orange-300 dark:to-rose-300"
                      initial={reduceMotion ? false : { opacity: 0.65, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.34, ease: entranceEase }}
                    >
                      {throughputValue.toFixed(1)} Tb/s
                    </motion.span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.28em] text-slate-500 dark:text-slate-400">
                      {lang({
                        en: "COMMAND CENTER INITIALIZATION",
                        vi: "KHOI DONG TRUNG TAM DIEU PHOI",
                      })}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold leading-tight text-slate-900 sm:text-3xl dark:text-slate-50">
                      {lang({
                        en: "Synchronizing digital network fabric",
                        vi: "Dong bo nen tang mang so",
                      })}
                    </h2>
                  </div>

                  <div className="rounded-2xl border border-amber-400/40 bg-amber-100/60 px-4 py-3 shadow-[0_0_30px_rgba(245,158,11,0.14)] dark:border-amber-300/35 dark:bg-amber-400/10">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-amber-700 dark:text-amber-300">
                      {lang({ en: "UPTIME TARGET", vi: "MUC UPTIME" })}
                    </p>
                    <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-300">99.99%</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {statusCards.map((card, index) => (
                    <motion.div
                      key={card.label}
                      className="rounded-2xl border border-slate-300/75 bg-slate-100/75 px-4 py-3 dark:border-slate-700/75 dark:bg-slate-800/70"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: entranceEase, delay: 0.15 + index * 0.08 }}
                    >
                      <div className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        <span
                          className={`splash-signal-pulse inline-flex h-2 w-2 rounded-full ${card.dotClass}`}
                          style={{ animationDelay: `${index * 0.2}s` }}
                        />
                        {card.label}
                      </div>
                      <p className="mt-2 text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {card.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 grid items-start gap-4 lg:grid-cols-[1.45fr_1fr]">
                  <div className="min-w-0 rounded-2xl border border-slate-300/75 bg-white/70 p-4 dark:border-slate-700/75 dark:bg-slate-900/55">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {lang({ en: "SIGNAL MATRIX", vi: "MA TRAN TIN HIEU" })}
                    </p>
                    <div className="relative mt-3 h-32 overflow-hidden rounded-xl border border-slate-300/80 bg-slate-100/70 dark:border-slate-700/70 dark:bg-slate-900/70">
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/8 via-transparent to-slate-200/30 dark:from-amber-400/12 dark:to-slate-700/25" />
                      <div className="absolute inset-x-0 bottom-0 h-px bg-slate-400/70 dark:bg-slate-600/70" />
                      <div className="relative z-10 flex h-full items-end gap-[4px] px-3 pb-3 pt-2">
                        {signalBars.map((bar, index) => (
                          <span
                            key={`${bar}-${index}`}
                            className={`splash-signal-bar min-w-[4px] flex-1 rounded-full ${
                              index % 5 === 0
                                ? "bg-gradient-to-t from-cyan-500 via-cyan-400 to-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.42)] dark:from-cyan-400 dark:via-cyan-300 dark:to-cyan-100"
                                : index % 7 === 0
                                  ? "bg-gradient-to-t from-rose-500 via-rose-400 to-rose-200 shadow-[0_0_14px_rgba(251,113,133,0.42)] dark:from-rose-400 dark:via-rose-300 dark:to-rose-100"
                                  : "bg-gradient-to-t from-amber-500 via-amber-400 to-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.45)] dark:from-amber-400 dark:via-amber-300 dark:to-amber-100"
                            }`}
                            style={{
                              height: `${Math.round(22 + bar * 56)}px`,
                              opacity: 0.3 + bar * 0.7,
                              animationDelay: `${index * 0.08}s`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="splash-signal-sweep pointer-events-none absolute inset-y-0 left-[-36%] w-[40%]" />
                      <div className="pointer-events-none absolute inset-0 splash-signal-fog" />
                    </div>
                  </div>

                  <div className="min-w-0 rounded-2xl border border-slate-300/75 bg-white/70 p-4 dark:border-slate-700/75 dark:bg-slate-900/55">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {lang({ en: "PACKET STREAM", vi: "LUONG PACKET" })}
                    </p>
                    <div className="relative mt-3 w-full overflow-hidden rounded-lg border border-slate-300/80 bg-slate-100/70 dark:border-slate-700/70 dark:bg-slate-900/70">
                      <div className="splash-ticker-track px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {[...protocolTokens, ...protocolTokens].map((token, index) => (
                          <span
                            key={`${token}-${index}`}
                            className={`mr-8 inline-flex shrink-0 ${
                              index % 6 === 0
                                ? "text-cyan-600 dark:text-cyan-300"
                                : index % 4 === 0
                                  ? "text-rose-600 dark:text-rose-300"
                                  : ""
                            }`}
                          >
                            {token}
                          </span>
                        ))}
                      </div>
                      {!reduceMotion && (
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                          {packetBlips.map((blip, index) => (
                            <motion.span
                              key={`${blip.duration}-${blip.delay}`}
                              className={`absolute left-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${blip.className}`}
                              style={{ top: blip.top }}
                              initial={{ x: "-10%", opacity: 0, scale: 0.6 }}
                              animate={{
                                x: ["-10%", "110%"],
                                opacity: [0, 1, 1, 0],
                                scale: [0.6, 1, 0.9, 0.6],
                              }}
                              transition={{
                                duration: blip.duration,
                                delay: blip.delay + index * 0.05,
                                ease: "linear",
                                repeat: Infinity,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 min-h-[3.8rem] rounded-xl border border-slate-300/80 bg-slate-100/75 p-3 dark:border-slate-700/70 dark:bg-slate-900/75">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                          key={`${tickerIndex}-${activeTicker}`}
                          className="font-mono text-sm font-medium leading-relaxed tracking-[0.01em] text-slate-700 dark:text-slate-200"
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                          transition={{ duration: reduceMotion ? 0.2 : 0.35, ease: entranceEase }}
                        >
                          {activeTicker}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      {lang({ en: "SYSTEM BOOTSTRAP", vi: "KHOI TAO HE THONG" })}
                    </p>
                    <span className="font-mono text-xs font-semibold tracking-[0.16em] text-slate-600 dark:text-slate-300">
                      {String(progress).padStart(3, "0")}%
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full border border-slate-300/80 bg-slate-200/80 dark:border-slate-700 dark:bg-slate-800/80">
                    <motion.div
                      className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600"
                      style={{ scaleX: Math.max(0.02, progress / 100) }}
                      transition={{ duration: 0.14, ease: "linear" }}
                    />
                    <div className="pointer-events-none absolute inset-0 splash-progress-shine" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                    {lang({
                      en: "Calibrating modules and preparing live interface.",
                      vi: "Dang hieu chinh module va san sang giao dien truc tiep.",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
