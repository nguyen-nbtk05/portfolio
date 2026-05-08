"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Activity,
  Cpu,
  Database,
  LockKeyhole,
  Router,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "@/lib/motion";

const aboutIntro = {
  en: "I am shaping this space into a concise personal introduction about how I think, build, and solve problems across modern network systems. This placeholder is intentionally sized for a 70-100 word bio, so the full About section stays visible in one focused screen.",
  vi: "Tôi sẽ bổ sung phần giới thiệu bản thân tại đây, tập trung vào cách tôi tư duy, xây dựng và giải quyết vấn đề trong các hệ thống mạng hiện đại. Đoạn placeholder này được giữ ở kích thước phù hợp cho phần bio khoảng 70-100 từ, để toàn bộ section About vẫn nằm gọn trong một khung hình.",
};

const getHudTiles = (lang: (dict: { en: string; vi: string }) => string) => [
  {
    icon: Cpu,
    label: lang({ en: "Role", vi: "Vai trò" }),
    value: lang({ en: "Network Engineer", vi: "Kỹ sư mạng" }),
  },
  {
    icon: ShieldCheck,
    label: lang({ en: "Focus", vi: "Trọng tâm" }),
    value: lang({ en: "Secure infrastructure", vi: "Hạ tầng an toàn" }),
  },
  {
    icon: Activity,
    label: lang({ en: "Mode", vi: "Trạng thái" }),
    value: lang({ en: "Building quietly", vi: "Đang hoàn thiện" }),
  },
];

const getNetworkSignals = (lang: (dict: { en: string; vi: string }) => string) => [
  {
    id: "edge",
    icon: Router,
    label: lang({ en: "Edge", vi: "Edge" }),
    value: "12ms",
    detail: lang({ en: "Routing layer tuned for stable access.", vi: "Lớp định tuyến ưu tiên truy cập ổn định." }),
  },
  {
    id: "secure",
    icon: LockKeyhole,
    label: lang({ en: "Secure", vi: "Secure" }),
    value: "Zero Trust",
    detail: lang({ en: "Security posture stays close to the core.", vi: "Tư duy bảo mật luôn nằm sát lõi hệ thống." }),
  },
  {
    id: "data",
    icon: Database,
    label: lang({ en: "Data", vi: "Data" }),
    value: "Synced",
    detail: lang({ en: "Telemetry and documentation stay connected.", vi: "Telemetry và tài liệu được giữ liền mạch." }),
  },
  {
    id: "wireless",
    icon: Wifi,
    label: lang({ en: "Signal", vi: "Signal" }),
    value: "Stable",
    detail: lang({ en: "Wireless and endpoint experience stay smooth.", vi: "Trải nghiệm wireless và endpoint được giữ mượt." }),
  },
];

export function AboutSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";
  const hudTiles = getHudTiles(lang);
  const networkSignals = getNetworkSignals(lang);
  const [activeSignalId, setActiveSignalId] = useState(networkSignals[0].id);
  const activeSignal =
    networkSignals.find((signal) => signal.id === activeSignalId) ?? networkSignals[0];

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 130, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 130, damping: 24 });
  const rotateX = useTransform(smoothY, [-1, 1], [4, -4]);
  const rotateY = useTransform(smoothX, [-1, 1], [-5, 5]);
  const avatarX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const avatarY = useTransform(smoothY, [-1, 1], [-8, 8]);

  const handleBoardPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    pointerX.set(x * 2 - 1);
    pointerY.set(y * 2 - 1);
    event.currentTarget.style.setProperty("--glow-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--glow-y", `${y * 100}%`);
  };

  const handleBoardPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    pointerX.set(0);
    pointerY.set(0);
    event.currentTarget.style.setProperty("--glow-x", "50%");
    event.currentTarget.style.setProperty("--glow-y", "42%");
  };

  return (
    <section
      id="about"
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-slate-50 py-6 dark:bg-slate-950 sm:py-8 lg:py-10"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_22%,rgba(234,179,8,0.2),transparent_30%),radial-gradient(circle_at_82%_58%,rgba(100,116,139,0.2),transparent_34%),linear-gradient(135deg,rgba(100,116,139,0.16)_0_1px,transparent_1px_36px)] dark:bg-[radial-gradient(circle_at_18%_22%,rgba(234,179,8,0.14),transparent_30%),radial-gradient(circle_at_82%_58%,rgba(148,163,184,0.11),transparent_34%),linear-gradient(135deg,rgba(148,163,184,0.1)_0_1px,transparent_1px_36px)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-yellow-500/45 to-transparent"
      />

      <motion.div
        initial={initial}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.1)}
        className="container mx-auto grid w-full items-center gap-6 px-[1cm] lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.82fr)] lg:gap-10 xl:gap-12"
      >
        <motion.div variants={fadeUp} className="max-w-3xl">
          <motion.div
            variants={scaleIn}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-100/70 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-yellow-700 shadow-sm backdrop-blur dark:border-yellow-400/30 dark:bg-yellow-500/10 dark:text-yellow-300"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-yellow-500 shadow-[0_0_16px_rgba(234,179,8,0.8)]"
              animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            {lang({ en: "Profile console", vi: "Profile console" })}
          </motion.div>

          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
            {lang({ en: "About Me", vi: "Giới Thiệu" })}
            <span className="text-yellow-500">.</span>
          </h2>

          <p className="mt-4 max-w-2xl rounded-xl border border-slate-200/80 bg-white/65 p-4 text-sm leading-6 text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 sm:text-base sm:leading-7">
            {lang(aboutIntro)}
          </p>

          <motion.div
            variants={staggerContainer(0.08, 0.08)}
            className="mt-4 grid gap-3 sm:grid-cols-3"
          >
            {hudTiles.map((tile) => (
              <motion.div
                key={tile.label}
                variants={scaleIn}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white/75 p-4 shadow-md shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/20"
              >
                <div className="mb-3 h-0.5 w-10 rounded-full bg-yellow-500 transition-all group-hover:w-16" />
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <tile.icon className="h-4 w-4 text-yellow-500 transition-transform group-hover:scale-110" />
                  {tile.label}
                </div>
                <div className="mt-2 text-sm font-bold text-slate-950 dark:text-slate-50">
                  {tile.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="mx-auto w-full max-w-[430px]">
          <motion.div
            onPointerMove={handleBoardPointerMove}
            onPointerLeave={handleBoardPointerLeave}
            style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-2xl shadow-slate-200/70 backdrop-blur-xl [--glow-x:50%] [--glow-y:42%] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_var(--glow-x)_var(--glow-y),rgba(234,179,8,0.24),transparent_34%)] before:transition-[background] before:duration-300 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/30 dark:before:bg-[radial-gradient(circle_at_var(--glow-x)_var(--glow-y),rgba(234,179,8,0.16),transparent_36%)]"
          >
            <div className="relative z-10 flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3 dark:border-slate-800">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {lang({ en: "Interactive network", vi: "Interactive network" })}
                </div>
                <div className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-50">
                  {activeSignal.label} / {activeSignal.value}
                </div>
              </div>
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/40 bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300"
                animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <activeSignal.icon className="h-5 w-5" />
              </motion.div>
            </div>

            <div className="relative z-10 mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/45">
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full text-slate-300 dark:text-slate-800"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M18 76 C28 48 36 42 50 50 C64 58 74 38 84 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.7"
                />
                <motion.path
                  d="M18 76 C28 48 36 42 50 50 C64 58 74 38 84 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="4 16"
                  className="text-yellow-500/80"
                  animate={reduceMotion ? undefined : { strokeDashoffset: [0, -40] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </svg>

              <motion.div
                style={reduceMotion ? undefined : { x: avatarX, y: avatarY }}
                className="relative mx-auto aspect-square w-[64%] max-w-[250px]"
              >
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-[-8%] rounded-full border border-dashed border-yellow-500/35"
                  animate={reduceMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative h-full overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-100 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                  <Image
                    src="/cover.jpg"
                    alt={lang({ en: "Nora profile avatar", vi: "Avatar hồ sơ của Nora" })}
                    fill
                    sizes="(min-width: 1024px) 250px, 64vw"
                    priority={false}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,0.07)_1px,transparent_1px)] bg-[size:22px_22px] mix-blend-multiply dark:mix-blend-screen" />
                </div>
              </motion.div>

              <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {networkSignals.map((signal) => {
                  const isActive = signal.id === activeSignal.id;

                  return (
                    <motion.button
                      key={signal.id}
                      type="button"
                      onPointerEnter={() => setActiveSignalId(signal.id)}
                      onFocus={() => setActiveSignalId(signal.id)}
                      whileHover={reduceMotion ? undefined : { y: -4 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                      className={`group flex min-h-20 flex-col items-start justify-between rounded-xl border p-3 text-left transition-colors ${
                        isActive
                          ? "border-yellow-400/70 bg-yellow-100/80 text-slate-950 shadow-md shadow-yellow-500/15 dark:bg-yellow-500/15 dark:text-slate-50"
                          : "border-slate-200/80 bg-white/80 text-slate-700 hover:border-yellow-300 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-yellow-700"
                      }`}
                    >
                      <signal.icon className="h-4 w-4 text-yellow-500 transition-transform group-hover:scale-110" />
                      <span className="mt-3 text-xs font-bold uppercase tracking-wide">
                        {signal.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.div
              key={activeSignal.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
              className="relative z-10 mt-4 rounded-xl border border-slate-200/80 bg-slate-950 px-4 py-3 text-sm text-slate-100 shadow-lg dark:border-slate-800"
            >
              <span className="font-mono text-yellow-300">{activeSignal.value}</span>
              <span className="mx-2 text-slate-500">/</span>
              <span className="text-slate-300">{activeSignal.detail}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
