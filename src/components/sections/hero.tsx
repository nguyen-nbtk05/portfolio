"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLenis } from "@/hooks/use-lenis";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, Terminal } from "lucide-react";
import { HeroIllustration } from "./hero-illustration";
import { siteConfig } from "@/data/config";
import { useLanguage } from "@/hooks/use-language";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/motion";
import ScrollIndicator from "@/components/ui/scroll-indicator";

const NETWORK_NODES = [
  {
    id: 1,
    color: "bg-teal-400",
    shadow: "shadow-[0_0_24px_rgba(20,184,166,0.65)]",
    size: "h-2 w-2",
    top: "68%",
    left: "12%",
    duration: "8s",
    delay: "0s",
  },
  {
    id: 2,
    color: "bg-cyan-400",
    shadow: "shadow-[0_0_18px_rgba(6,182,212,0.6)]",
    size: "h-1.5 w-1.5",
    top: "58%",
    left: "28%",
    duration: "9.5s",
    delay: "-2.6s",
  },
  {
    id: 3,
    color: "bg-rose-400",
    shadow: "shadow-[0_0_18px_rgba(251,113,133,0.55)]",
    size: "h-1.5 w-1.5",
    top: "42%",
    left: "8%",
    duration: "10.5s",
    delay: "-5.1s",
  },
  {
    id: 4,
    color: "bg-cyan-400",
    shadow: "shadow-[0_0_18px_rgba(34,211,238,0.65)]",
    size: "h-2 w-2",
    top: "75%",
    left: "45%",
    duration: "11s",
    delay: "-1.5s",
  },
  {
    id: 5,
    color: "bg-emerald-400",
    shadow: "shadow-[0_0_18px_rgba(52,211,153,0.6)]",
    size: "h-1 w-1",
    top: "85%",
    left: "65%",
    duration: "12s",
    delay: "-4.2s",
  },
  {
    id: 6,
    color: "bg-violet-400",
    shadow: "shadow-[0_0_18px_rgba(167,139,250,0.6)]",
    size: "h-2.5 w-2.5",
    top: "25%",
    left: "15%",
    duration: "9s",
    delay: "-7s",
  },
  {
    id: 7,
    color: "bg-blue-400",
    shadow: "shadow-[0_0_18px_rgba(96,165,250,0.65)]",
    size: "h-1.5 w-1.5",
    top: "35%",
    left: "75%",
    duration: "8.5s",
    delay: "-3.8s",
  },
  {
    id: 8,
    color: "bg-teal-300",
    shadow: "shadow-[0_0_18px_rgba(45,212,191,0.6)]",
    size: "h-1 w-1",
    top: "15%",
    left: "35%",
    duration: "13s",
    delay: "-6.4s",
  },
  {
    id: 9,
    color: "bg-rose-300",
    shadow: "shadow-[0_0_18px_rgba(253,164,175,0.6)]",
    size: "h-2 w-2",
    top: "65%",
    left: "85%",
    duration: "10s",
    delay: "-8.1s",
  },
  {
    id: 10,
    color: "bg-teal-400",
    shadow: "shadow-[0_0_18px_rgba(45,212,191,0.6)]",
    size: "h-1.5 w-1.5",
    top: "45%",
    left: "55%",
    duration: "9.2s",
    delay: "-1.1s",
  },
  {
    id: 11,
    color: "bg-fuchsia-400",
    shadow: "shadow-[0_0_18px_rgba(232,121,249,0.6)]",
    size: "h-2 w-2",
    top: "80%",
    left: "5%",
    duration: "10.8s",
    delay: "-2.3s",
  },
  {
    id: 12,
    color: "bg-indigo-400",
    shadow: "shadow-[0_0_18px_rgba(129,140,248,0.6)]",
    size: "h-1.5 w-1.5",
    top: "50%",
    left: "90%",
    duration: "11.5s",
    delay: "-5.5s",
  },
  {
    id: 13,
    color: "bg-cyan-300",
    shadow: "shadow-[0_0_16px_rgba(103,232,249,0.55)]",
    size: "h-1 w-1",
    top: "22%",
    left: "62%",
    duration: "12.8s",
    delay: "-3.2s",
  },
  {
    id: 14,
    color: "bg-teal-300",
    shadow: "shadow-[0_0_16px_rgba(45,212,191,0.55)]",
    size: "h-1.5 w-1.5",
    top: "70%",
    left: "72%",
    duration: "10.2s",
    delay: "-7.4s",
  },
  {
    id: 15,
    color: "bg-emerald-300",
    shadow: "shadow-[0_0_16px_rgba(110,231,183,0.5)]",
    size: "h-1 w-1",
    top: "32%",
    left: "48%",
    duration: "13.6s",
    delay: "-9.2s",
  },
  {
    id: 16,
    color: "bg-rose-300",
    shadow: "shadow-[0_0_16px_rgba(253,164,175,0.52)]",
    size: "h-1.5 w-1.5",
    top: "18%",
    left: "52%",
    duration: "9.8s",
    delay: "-4.6s",
  },
  {
    id: 17,
    color: "bg-sky-300",
    shadow: "shadow-[0_0_16px_rgba(125,211,252,0.55)]",
    size: "h-1 w-1",
    top: "82%",
    left: "38%",
    duration: "14.2s",
    delay: "-6.8s",
  },
  {
    id: 18,
    color: "bg-violet-300",
    shadow: "shadow-[0_0_16px_rgba(196,181,253,0.55)]",
    size: "h-2 w-2",
    top: "28%",
    left: "88%",
    duration: "11.8s",
    delay: "-1.9s",
  },
  {
    id: 19,
    color: "bg-cyan-300",
    shadow: "shadow-[0_0_16px_rgba(103,232,249,0.55)]",
    size: "h-1 w-1",
    top: "60%",
    left: "18%",
    duration: "12.4s",
    delay: "-8.5s",
  },
  {
    id: 20,
    color: "bg-teal-300",
    shadow: "shadow-[0_0_16px_rgba(94,234,212,0.52)]",
    size: "h-1.5 w-1.5",
    top: "88%",
    left: "82%",
    duration: "10.9s",
    delay: "-5.7s",
  },
];

export function HeroSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";
  const lenis = useLenis();

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      if (lenis) {
        lenis.scrollTo(targetEl, { duration: 1.2, offset: 0 });
      } else {
        const top = targetEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "smooth" });
      }
      window.history.pushState(null, "", href);
    },
    [lenis],
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerEventRef = useRef<{
    target: HTMLElement | null;
    clientX: number;
    clientY: number;
  }>({ target: null, clientX: 0, clientY: 0 });

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const packetX = useTransform(smoothX, [-1, 1], [-40, 40]);
  const packetY = useTransform(smoothY, [-1, 1], [-40, 40]);

  const applyPointerMotion = useCallback(() => {
    pointerFrameRef.current = null;
    const { target, clientX, clientY } = pointerEventRef.current;
    if (!target) return;

    const { left, top, width, height } = target.getBoundingClientRect();
    const xPct = (clientX - left - width / 2) / (width / 2);
    const yPct = (clientY - top - height / 2) / (height / 2);

    mouseX.set(Math.max(-1, Math.min(1, xPct)));
    mouseY.set(Math.max(-1, Math.min(1, yPct)));
  }, [mouseX, mouseY]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduceMotion) return;

      pointerEventRef.current = {
        target: e.currentTarget,
        clientX: e.clientX,
        clientY: e.clientY,
      };

      if (pointerFrameRef.current === null) {
          pointerFrameRef.current = window.requestAnimationFrame(applyPointerMotion);
      }
    },
    [applyPointerMotion, reduceMotion],
  );

  const handleMouseLeave = () => {
    if (pointerFrameRef.current !== null) {
      window.cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }
    pointerEventRef.current.target = null;
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(
    () => () => {
      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }
    },
    [],
  );

  return (
    <section
      data-cursor="default"
      onMouseMove={reduceMotion ? undefined : handleMouseMove}
      onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
      className="relative flex min-h-[100vh] select-none items-center justify-center overflow-hidden py-6 sm:py-8 lg:py-10"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 via-slate-50 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />

      <motion.div
        style={reduceMotion ? {} : { x: packetX, y: packetY }}
        aria-hidden="true"
        className="absolute inset-0 z-0"
      >
        {NETWORK_NODES.map((node) => (
          <span
            key={node.id}
            className={`network-packet absolute rounded-full ${node.color} ${node.shadow} ${node.size}`}
            style={
              {
                top: node.top,
                left: node.left,
                "--duration": node.duration,
                "--delay": node.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </motion.div>

      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-8 px-[1cm] lg:grid-cols-[42%_58%] lg:gap-8 xl:gap-10">
        <motion.div
          className="flex max-w-3xl flex-col items-start gap-8"
          initial={initial}
          animate="visible"
          variants={staggerContainer(0.11)}
        >
          <motion.div
            variants={fadeUp}
            className="flex select-none items-center gap-2 rounded-full border border-slate-300/70 bg-slate-200/55 px-3 py-1 font-mono text-sm shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-800/55"
          >
            <motion.span
              aria-hidden="true"
              animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex"
            >
              <Terminal className="h-4 w-4 text-teal-500" />
            </motion.span>
            <span className="text-slate-700 dark:text-slate-300">
              ping 127.0.0.1 -c 1
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl font-bold leading-none tracking-tighter md:text-7xl"
          >
            <span className="block">
              {lang({ en: "Hi, I'm", vi: "Xin chào, tôi là" })} {siteConfig.name}
            </span>
            <motion.span
              variants={fadeIn}
              className="mt-3 block min-h-[1.18em] w-full text-4xl leading-[1.12] md:text-6xl"
            >
              <TypewriterText
                key={`${lang(siteConfig.role)}|Data Communications`}
                words={[lang(siteConfig.role), "Data Communications"]}
                className="align-top bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 bg-clip-text leading-[1.12] text-transparent"
                typingSpeed={85}
                deletingSpeed={45}
                pauseDuration={1200}
              />
            </motion.span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-400"
          >
            {lang(siteConfig.description)}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-4 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              onClick={(e) => handleAnchorClick(e, "#projects")}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-medium text-white shadow-lg shadow-teal-500/20 transition-colors hover:bg-teal-700"
            >
              {lang({ en: "View Projects", vi: "Xem Dự Án" })}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              onClick={(e) => handleAnchorClick(e, "#contact")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-200 px-6 py-3 font-medium text-slate-900 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
            >
              {lang({ en: "Contact Me", vi: "Liên Hệ" })}
            </a>
          </motion.div>
        </motion.div>

        {/* --- CỘT PHẢI: MODERN 2D ILLUSTRATION --- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden w-full items-center justify-center lg:flex"
        >
          <HeroIllustration />
        </motion.div>
      </div>
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <ScrollIndicator />
      </motion.div>
    </section>
  );
}
