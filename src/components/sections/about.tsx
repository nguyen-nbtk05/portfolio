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
  CalendarCheck,
  Cpu,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "@/lib/motion";
import { SectionBackground } from "@/components/ui/section-background";
import { Github } from "@/components/ui/icons";
import { siteConfig } from "@/data/config";

const aboutIntro = {
  en: "I am shaping this space into a concise personal introduction about how I think, build, and solve problems across modern network systems. This placeholder is intentionally sized for a 70-100 word bio, so the full About section stays visible in one focused screen.",
  vi: "TÃ´i sáº½ bá»• sung pháº§n giá»›i thiá»‡u báº£n thÃ¢n táº¡i Ä‘Ã¢y, táº­p trung vÃ o cÃ¡ch tÃ´i tÆ° duy, xÃ¢y dá»±ng vÃ  giáº£i quyáº¿t váº¥n Ä‘á» trong cÃ¡c há»‡ thá»‘ng máº¡ng hiá»‡n Ä‘áº¡i. Äoáº¡n placeholder nÃ y Ä‘Æ°á»£c giá»¯ á»Ÿ kÃ­ch thÆ°á»›c phÃ¹ há»£p cho pháº§n bio khoáº£ng 70-100 tá»«, Ä‘á»ƒ toÃ n bá»™ section About váº«n náº±m gá»n trong má»™t khung hÃ¬nh.",
};

const getHudTiles = (lang: (dict: { en: string; vi: string }) => string) => [
  {
    icon: Cpu,
    label: lang({ en: "Role", vi: "Vai trÃ²" }),
    value: lang({ en: "Network Engineer", vi: "Ká»¹ sÆ° máº¡ng" }),
  },
  {
    icon: ShieldCheck,
    label: lang({ en: "Focus", vi: "Trá»ng tÃ¢m" }),
    value: lang({ en: "Secure infrastructure", vi: "Háº¡ táº§ng an toÃ n" }),
  },
  {
    icon: Activity,
    label: lang({ en: "Mode", vi: "Tráº¡ng thÃ¡i" }),
    value: lang({ en: "Building quietly", vi: "Äang hoÃ n thiá»‡n" }),
  },
];

const getNetworkSignals = (lang: (dict: { en: string; vi: string }) => string) => [
  {
    id: "name",
    icon: UserRound,
    label: lang({ en: "Name", vi: "Tên" }),
    value: siteConfig.name,
    detail: lang({
      en: `${siteConfig.name} is the identity behind this portfolio.`,
      vi: `${siteConfig.name} là tên hiển thị chính trên portfolio này.`,
    }),
  },
  {
    id: "github",
    icon: Github,
    label: "GitHub",
    value: siteConfig.github.replace(/^https?:\/\//, ""),
    detail: lang({
      en: "A place for my code, project notes, and technical experiments.",
      vi: "Nơi lưu mã nguồn, ghi chú dự án và các thử nghiệm kỹ thuật của tôi.",
    }),
  },
  {
    id: "email",
    icon: Mail,
    label: lang({ en: "Email", vi: "Email" }),
    value: siteConfig.email,
    detail: lang({
      en: "The main channel for collaboration and contact.",
      vi: "Kênh chính để trao đổi công việc và liên hệ.",
    }),
  },
  {
    id: "availability",
    icon: CalendarCheck,
    label: lang({ en: "Status", vi: "Trạng thái" }),
    value: lang({ en: "Ready", vi: "Sẵn sàng" }),
    detail: lang({
      en: "Ready for network projects and collaboration.",
      vi: "Sẵn sàng cho dự án mạng và cộng tác.",
    }),
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
      className="relative isolate flex min-h-[100vh] items-center overflow-hidden py-6 sm:py-8 lg:py-10"
    >
      <SectionBackground variant="about" />

      <motion.div
        initial={initial}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.1)}
        className="container mx-auto grid w-full items-center gap-6 px-[1cm] lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.82fr)] lg:gap-10 xl:gap-12"
      >
        <motion.div variants={fadeUp} className="max-w-3xl lg:ml-8 xl:ml-12">
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
            {lang({ en: "About Me", vi: "Giá»›i Thiá»‡u" })}
            <span className="text-yellow-500">.</span>
          </h2>

          <p className="mt-4 max-w-2xl text-justify rounded-xl border border-slate-200/80 bg-white/65 p-4 text-sm leading-6 text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 sm:text-base sm:leading-7">
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
                  {lang({ en: "Personal profile", vi: "Hồ sơ cá nhân" })}
                </div>
                <div className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-50">
                  {activeSignal.label.toUpperCase()}
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

            <div className="relative z-10 mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/45">
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        boxShadow: [
                          "inset 0 0 0 1px rgba(234,179,8,0.08)",
                          "inset 0 0 0 1px rgba(234,179,8,0.24)",
                          "inset 0 0 0 1px rgba(234,179,8,0.08)",
                        ],
                      }
                }
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 z-20 rounded-[1rem]"
              >
                <motion.span
                  className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-[3px] border-t-[3px] border-yellow-400/60"
                  animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-[3px] border-t-[3px] border-yellow-400/60"
                  animate={reduceMotion ? undefined : { opacity: [1, 0.45, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="absolute left-1/2 top-0 h-[2px] w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent" />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl"
              >
                <motion.span
                  className="absolute left-0 top-0 h-[2px] w-28 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_16px_rgba(234,179,8,0.75)]"
                  animate={reduceMotion ? undefined : { x: ["-8rem", "34rem"] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
                />
                <motion.span
                  className="absolute bottom-0 right-0 h-[2px] w-24 bg-gradient-to-r from-transparent via-yellow-300 to-transparent shadow-[0_0_16px_rgba(234,179,8,0.6)]"
                  animate={reduceMotion ? undefined : { x: ["8rem", "-34rem"] }}
                  transition={{
                    duration: 4.2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.9,
                  }}
                />
              </div>

              <motion.div
                style={reduceMotion ? undefined : { x: avatarX, y: avatarY }}
                className="relative mx-auto aspect-square w-[64%] max-w-[250px]"
              >
                <div className="relative h-full overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-100 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                  <Image
                    src="/cover.jpg"
                    alt={lang({ en: "Nora profile avatar", vi: "Avatar há»“ sÆ¡ cá»§a Nora" })}
                    fill
                    sizes="(min-width: 1024px) 250px, 64vw"
                    priority={false}
                    className="object-cover"
                  />
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
                      className={`group flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-colors ${
                        isActive
                          ? "border-yellow-400/70 bg-yellow-100/80 text-slate-950 shadow-md shadow-yellow-500/15 dark:bg-yellow-500/15 dark:text-slate-50"
                          : "border-slate-200/80 bg-white/80 text-slate-700 hover:border-yellow-300 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-yellow-700"
                      }`}
                    >
                      <signal.icon className="h-5 w-5 text-yellow-500 transition-transform group-hover:scale-110" />
                      <span className="text-xs font-bold uppercase tracking-wide">
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
              <div className="theme-font-mono text-sm font-semibold text-yellow-300">
                {activeSignal.value}
              </div>
              <div className="mt-1.5 leading-relaxed text-slate-300">
                {activeSignal.detail}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

