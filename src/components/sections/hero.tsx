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
import {
  ArrowRight,
  Terminal,
  Server,
  Globe,
  Database,
  Laptop,
  Shield,
  Smartphone,
  Router,
  Mail,
  Network,
} from "lucide-react";
import { siteConfig } from "@/data/config";
import { useLanguage } from "@/hooks/use-language";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/motion";
import ScrollIndicator from "@/components/ui/scroll-indicator";

const NETWORK_NODES = [
  {
    id: 1,
    color: "bg-yellow-400",
    shadow: "shadow-[0_0_24px_rgba(234,179,8,0.65)]",
    size: "h-2 w-2",
    top: "68%",
    left: "12%",
    duration: "8s",
    delay: "0s",
  },
  {
    id: 2,
    color: "bg-orange-400",
    shadow: "shadow-[0_0_18px_rgba(251,146,60,0.6)]",
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
    color: "bg-yellow-300",
    shadow: "shadow-[0_0_18px_rgba(253,224,71,0.6)]",
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

  const gridX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const gridY = useTransform(smoothY, [-1, 1], [-20, 20]);

  const packetX = useTransform(smoothX, [-1, 1], [-40, 40]);
  const packetY = useTransform(smoothY, [-1, 1], [-40, 40]);

  const cardRotateX = useTransform(smoothY, [-1, 1], [15, -15]);
  const cardRotateY = useTransform(smoothX, [-1, 1], [-15, 15]);

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
      onMouseMove={reduceMotion ? undefined : handleMouseMove}
      onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden py-20"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 via-slate-50 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />

      <motion.div
        style={reduceMotion ? {} : { x: gridX, y: gridY }}
        className="absolute inset-[-50px] z-0"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: reduceMotion ? 0.8 : 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="network-grid absolute inset-0" />
      </motion.div>

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

      <div className="container relative z-10 mx-auto px-[1cm] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          className="flex max-w-3xl flex-col items-start gap-8"
          initial={initial}
          animate="visible"
          variants={staggerContainer(0.11)}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-2 rounded-full border border-slate-300/70 bg-slate-200/55 px-3 py-1 font-mono text-sm shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-800/55"
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
              <Terminal className="h-4 w-4 text-yellow-500" />
            </motion.span>
            <span className="text-slate-700 dark:text-slate-300">
              ping 127.0.0.1 -c 1
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl font-bold tracking-tighter md:text-7xl"
          >
            {lang({ en: "Hi, I'm", vi: "Xin chào, tôi là" })} {siteConfig.name}
            <br />
            <motion.span
              variants={fadeIn}
              className="mt-2 block w-full text-4xl md:text-6xl"
            >
              <TypewriterText
                key={lang(siteConfig.role)}
                text={lang(siteConfig.role)}
                className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent"
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
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white shadow-lg shadow-yellow-500/20 transition-colors hover:bg-yellow-600"
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

        {/* --- CỘT PHẢI: 3D COMPLEX ENTERPRISE TOPOLOGY (BRAND SYNCHRONIZED COLOR) --- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex w-full items-center justify-center perspective-[1200px]"
        >
          <motion.div
            style={
              reduceMotion
                ? {}
                : {
                    rotateX: cardRotateX,
                    rotateY: cardRotateY,
                    transformStyle: "preserve-3d",
                  }
            }
            className="relative w-full max-w-[640px] h-[420px] rounded-[2.5rem] border border-slate-200/50 bg-white/40 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40"
          >
            {/* --- CÁC KHU VỰC BẢO MẬT (ZONES) --- */}
            {/* DMZ (Màu Rose - Khớp với chữ "Computer") */}
            <div
              style={{ transform: "translateZ(10px)" }}
              className="absolute left-[16%] right-[52%] top-[10%] bottom-[10%] rounded-2xl border border-rose-200/60 bg-rose-50/30 dark:border-rose-900/30 dark:bg-rose-900/10"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-rose-200 bg-rose-100 px-3 py-0.5 text-[10px] font-bold tracking-widest text-rose-600 shadow-sm dark:border-rose-800 dark:bg-rose-900/80 dark:text-rose-300">
                DMZ
              </div>
            </div>

            {/* Internal Network (Màu Slate trung tính để làm nổi bật các Node Vàng/Cam) */}
            <div
              style={{ transform: "translateZ(15px)" }}
              className="absolute left-[52%] right-[6%] top-[10%] bottom-[10%] rounded-2xl border border-slate-200/60 bg-slate-50/30 dark:border-slate-700/30 dark:bg-slate-800/20"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-100 px-3 py-0.5 text-[10px] font-bold tracking-widest text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                INTERNAL NETWORK
              </div>
            </div>

            {/* --- ĐƯỜNG TRUYỀN DỮ LIỆU --- */}
            <div
              style={{ transform: "translateZ(20px)" }}
              className="absolute inset-0 pointer-events-none"
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <style>
                  {`
                    @keyframes packet-flow { to { stroke-dashoffset: -24; } }
                    .packet { animation: packet-flow 1.2s linear infinite; stroke-linecap: round; }
                    .packet-fast { animation: packet-flow 0.6s linear infinite; stroke-linecap: round; }
                    .packet-slow { animation: packet-flow 1.8s linear infinite; stroke-linecap: round; }
                  `}
                </style>

                <g
                  stroke="currentColor"
                  strokeWidth="0.4"
                  className="text-slate-300 dark:text-slate-700/80"
                >
                  <line x1="12" y1="50" x2="23" y2="50" />
                  <line x1="28" y1="44" x2="28" y2="27" />
                  <line x1="28" y1="56" x2="28" y2="73" />
                  <line x1="33" y1="50" x2="48" y2="50" />
                  <path d="M 54 44 L 54 20 L 71 20" fill="none" />
                  <line x1="60" y1="50" x2="71" y2="50" />
                  <path d="M 54 56 L 54 80 L 71 80" fill="none" />
                  <path d="M 76 55 L 76 65 L 83 65" fill="none" />
                </g>

                {/* Gói tin đã được đổi màu đồng bộ với Text bên trái */}
                <line
                  x1="12"
                  y1="50"
                  x2="23"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 20"
                  className="text-slate-400 packet"
                />
                <line
                  x1="28"
                  y1="44"
                  x2="28"
                  y2="27"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 20"
                  className="text-rose-400 packet"
                />
                <line
                  x1="28"
                  y1="56"
                  x2="28"
                  y2="73"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 20"
                  className="text-rose-400 packet-slow"
                />
                <line
                  x1="33"
                  y1="50"
                  x2="48"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 18"
                  className="text-orange-400 packet-fast"
                />
                <path
                  d="M 54 44 L 54 20 L 71 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 20"
                  className="text-slate-400 packet"
                />
                <line
                  x1="60"
                  y1="50"
                  x2="71"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="6 18"
                  className="text-amber-500 packet-fast"
                />
                <path
                  d="M 54 56 L 54 80 L 71 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 20"
                  className="text-slate-400 packet"
                />
                <path
                  d="M 76 55 L 76 65 L 83 65"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 20"
                  className="text-orange-400 packet-slow"
                />
              </svg>
            </div>

            {/* --- CÁC NODE MẠNG --- */}

            {/* 1. INTERNET */}
            <div
              style={{ transform: "translateZ(40px)" }}
              className="absolute left-[8%] top-[50%] -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 cursor-default"
              >
                <Globe size={20} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm backdrop-blur-md dark:bg-slate-800/70">
                Internet
              </div>
            </div>

            {/* 2. FIREWALL GATEWAY (Rose) */}
            <div
              style={{ transform: "translateZ(60px)" }}
              className="absolute left-[28%] top-[50%] -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-300 bg-rose-50 shadow-lg text-rose-500 dark:border-rose-700/80 dark:bg-rose-900/60 cursor-help"
              >
                <Shield size={24} className="animate-pulse" />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-rose-400 shadow-sm backdrop-blur-md dark:bg-slate-800/70 dark:text-rose-500">
                Firewall
              </div>
            </div>

            {/* 3. WEB SERVER (Rose) */}
            <div
              style={{ transform: "translateZ(45px)" }}
              className="absolute left-[28%] top-[22%] -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-200 bg-white shadow-md text-rose-500 dark:border-rose-800 dark:bg-slate-800 cursor-default"
              >
                <Server size={18} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm backdrop-blur-md dark:bg-slate-800/70">
                Web Srv
              </div>
            </div>

            {/* 4. MAIL SERVER (Orange) */}
            <div
              style={{ transform: "translateZ(45px)" }}
              className="absolute left-[28%] top-[78%] -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-200 bg-white shadow-md text-orange-500 dark:border-orange-800 dark:bg-slate-800 cursor-default"
              >
                <Mail size={18} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm backdrop-blur-md dark:bg-slate-800/70">
                Mail Srv
              </div>
            </div>

            {/* 5. CORE ROUTER (Amber - Đồng bộ nút bấm View Projects) */}
            <div
              style={{ transform: "translateZ(90px)" }}
              className="absolute left-[54%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <motion.button
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 25px rgba(245,158,11,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500 bg-gradient-to-br from-yellow-400 to-amber-500 shadow-xl text-white transition-colors hover:from-amber-500 hover:to-orange-500"
              >
                <Router size={28} />
              </motion.button>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-amber-50/90 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-600 shadow-sm backdrop-blur-md dark:bg-amber-900/60 dark:text-amber-300">
                Core Router
              </div>
            </div>

            {/* 6. DATABASE (Slate) */}
            <div
              style={{ transform: "translateZ(50px)" }}
              className="absolute left-[76%] top-[20%] -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 shadow-md text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 cursor-default"
              >
                <Database size={18} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm backdrop-blur-md dark:bg-slate-800/70">
                Database
              </div>
            </div>

            {/* 7. ACCESS SWITCH (Amber) */}
            <div
              style={{ transform: "translateZ(65px)" }}
              className="absolute left-[76%] top-[50%] -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 shadow-md text-amber-600 dark:border-amber-700/80 dark:bg-amber-900/60 cursor-default"
              >
                <Network size={20} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm backdrop-blur-md dark:bg-slate-800/70">
                Switch
              </div>
            </div>

            {/* 8. WORKSTATION (Slate) */}
            <div
              style={{ transform: "translateZ(55px)" }}
              className="absolute left-[76%] top-[80%] -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 shadow-md text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 cursor-default"
              >
                <Laptop size={20} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm backdrop-blur-md dark:bg-slate-800/70">
                Client
              </div>
            </div>

            {/* 9. SMARTPHONE (Orange) */}
            <div
              style={{ transform: "translateZ(75px)" }}
              className="absolute left-[88%] top-[65%] -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 shadow-md text-orange-500 dark:border-orange-800 dark:bg-orange-900/40 cursor-default"
              >
                <Smartphone size={18} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm backdrop-blur-md dark:bg-slate-800/70">
                Wi-Fi
              </div>
            </div>

            {/* --- WIDGETS KÉO THẢ --- */}
            <div
              style={{ transform: "translateZ(110px)" }}
              className="absolute left-[4%] top-[15%]"
            >
              <motion.div
                drag
                dragConstraints={{
                  left: -10,
                  right: 100,
                  top: -20,
                  bottom: 50,
                }}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                className="cursor-grab rounded-lg border border-rose-200/80 bg-white/90 px-2.5 py-1.5 shadow-lg backdrop-blur-md dark:border-rose-800/50 dark:bg-slate-800/90 flex items-center gap-2"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                  Intrusion Blocked
                </span>
              </motion.div>
            </div>

            <div
              style={{ transform: "translateZ(100px)" }}
              className="absolute right-[30%] bottom-[8%]"
            >
              <motion.div
                drag
                dragConstraints={{
                  left: -10,
                  right: 200,
                  top: -50,
                  bottom: 20,
                }}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                className="cursor-grab rounded-lg border border-slate-200/80 bg-white/90 px-2.5 py-1.5 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/90 flex items-center gap-1.5"
              >
                <Network size={12} className="text-amber-500" />
                <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                  VLAN 20: WiFi
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <ScrollIndicator />
      </motion.div>
    </section>
  );
}
