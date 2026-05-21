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
  Cloud,
  Server,
  Globe,
  Database,
  Laptop,
  Lock,
  Shield,
  RadioTower,
  Router,
  Mail,
  Network,
  Wifi,
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
      onMouseMove={reduceMotion ? undefined : handleMouseMove}
      onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
      className="relative flex min-h-[100vh] items-center justify-center overflow-hidden py-6 sm:py-8 lg:py-10"
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

      <div className="container relative z-10 mx-auto px-[1cm] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
          className="hidden lg:flex w-full items-center justify-center"
        >
          <motion.div className="relative top-1 h-[540px] w-[640px] max-w-none lg:left-0 xl:-left-3 xl:w-[780px] 2xl:-left-7 2xl:w-[860px]">
            {/* --- CÁC KHU VỰC BẢO MẬT (ZONES) --- */}
            {/* DMZ (Màu Rose - Khớp với chữ "Computer") */}
            <div className="absolute left-[13%] right-[54%] top-[7%] bottom-[7%] rounded-2xl border border-rose-300/90 bg-rose-100/45 shadow-[0_18px_60px_-44px_rgba(244,63,94,0.7)] dark:border-rose-500/45 dark:bg-rose-500/10 dark:shadow-[0_18px_60px_-44px_rgba(244,63,94,0.5)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-rose-300 bg-rose-50/95 px-3 py-0.5 text-[10px] font-bold tracking-widest text-rose-600 shadow-md shadow-rose-500/20 dark:border-rose-500/60 dark:bg-rose-500/15 dark:text-rose-200">
                DMZ
              </div>
            </div>

            {/* Internal Network (Màu Slate trung tính để làm nổi bật các Node Vàng/Cam) */}
            <div className="absolute left-[48%] right-[-3%] top-[7%] bottom-[7%] rounded-2xl border border-amber-300/80 bg-amber-50/35 shadow-[0_18px_60px_-44px_rgba(245,158,11,0.65)] dark:border-amber-500/35 dark:bg-amber-500/10 dark:shadow-[0_18px_60px_-44px_rgba(245,158,11,0.45)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-300 bg-amber-50/95 px-3 py-0.5 text-[10px] font-bold tracking-widest text-amber-700 shadow-md shadow-amber-500/20 dark:border-amber-500/55 dark:bg-amber-500/15 dark:text-amber-200">
                INTERNAL NETWORK
              </div>
            </div>

            {/* --- ĐƯỜNG TRUYỀN DỮ LIỆU --- */}
            <div className="absolute inset-0 -translate-y-4">
            <div className="absolute inset-0 pointer-events-none">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <style>
                  {`
                    @keyframes packet-flow { to { stroke-dashoffset: -24; } }
                    @keyframes packet-waf-sequence {
                      0% { stroke-dashoffset: 4; }
                      50% { stroke-dashoffset: -20; }
                      50.01%, 100% { stroke-dashoffset: 4; }
                    }
                    @keyframes packet-web-sequence {
                      0%, 49.99% { stroke-dashoffset: 4; }
                      50% { stroke-dashoffset: 4; }
                      100% { stroke-dashoffset: -20; }
                    }
                    .packet { animation: packet-flow 1.2s linear infinite; stroke-linecap: round; }
                    .packet-fast { animation: packet-flow 0.6s linear infinite; stroke-linecap: round; }
                    .packet-slow { animation: packet-flow 1.8s linear infinite; stroke-linecap: round; }
                    .packet-waf { animation: packet-waf-sequence 3.6s linear infinite; stroke-linecap: round; }
                    .packet-web { animation: packet-web-sequence 3.6s linear infinite; stroke-linecap: round; }
                  `}
                </style>

                <g
                  stroke="currentColor"
                  strokeWidth="0.65"
                  className="text-slate-400/80 dark:text-slate-600"
                >
                  <line x1="8.6" y1="50" x2="25.7" y2="50" />
                  <line x1="29.5" y1="44.7" x2="29.5" y2="26.3" />
                  <line x1="29.5" y1="55.3" x2="29.5" y2="73.7" />
                  <line x1="33.7" y1="50" x2="54" y2="50" />
                  <path d="M 36.1 36 L 29.5 36 L 29.5 44.7" fill="none" />
                  <path d="M 58 44.2 L 58 20 L 77.2 20" fill="none" />
                  <path d="M 62.8 50 L 71.4 50 L 71.4 40.2" fill="none" />
                  <line x1="62.8" y1="50" x2="80" y2="50" />
                  <path d="M 83 20 L 91.8 20 L 91.8 28 L 93.4 28" fill="none" />
                  <path d="M 58 55.8 L 58 80 L 77 80" fill="none" />
                  <line x1="86" y1="50" x2="93.4" y2="50" />
                  <path d="M 83.2 80 L 91.8 80 L 91.8 72 L 93.4 72" fill="none" />
                </g>

                {/* Gói tin đã được đổi màu đồng bộ với Text bên trái */}
                <line
                  x1="8.6"
                  y1="50"
                  x2="25.7"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="4 20"
                  className="text-cyan-500 dark:text-cyan-300 packet"
                />
                <line
                  x1="29.5"
                  y1="44.7"
                  x2="29.5"
                  y2="26.3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="4 100"
                  className="text-rose-500 dark:text-rose-300 packet-web"
                />
                <line
                  x1="29.5"
                  y1="55.3"
                  x2="29.5"
                  y2="73.7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="4 20"
                  className="text-orange-500 dark:text-orange-300 packet-slow"
                />
                <line
                  x1="33.7"
                  y1="50"
                  x2="54"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="2.35"
                  strokeDasharray="6 18"
                  className="text-orange-500 dark:text-orange-300 packet-fast"
                />
                <path
                  d="M 36.1 36 L 29.5 36 L 29.5 44.7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.65"
                  strokeDasharray="4 100"
                  className="text-fuchsia-500 dark:text-fuchsia-300 packet-waf"
                />
                <path
                  d="M 58 44.2 L 58 20 L 77.2 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="4 20"
                  className="text-violet-500 dark:text-violet-300 packet"
                />
                <path
                  d="M 62.8 50 L 71.4 50 L 71.4 40.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.65"
                  strokeDasharray="4 20"
                  style={{ animationDelay: "-0.3s" }}
                  className="text-sky-500 dark:text-sky-300 packet-fast"
                />
                <line
                  x1="62.8"
                  y1="50"
                  x2="80"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 18"
                  className="text-amber-500 dark:text-amber-300 packet-fast"
                />
                <path
                  d="M 83 20 L 91.8 20 L 91.8 28 L 93.4 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.65"
                  strokeDasharray="4 20"
                  className="text-blue-500 dark:text-blue-300 packet-slow"
                />
                <path
                  d="M 58 55.8 L 58 80 L 77 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="4 20"
                  className="text-emerald-500 dark:text-emerald-300 packet"
                />
                <path
                  d="M 86 50 L 93.4 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="4 20"
                  className="text-orange-500 dark:text-orange-300 packet-slow"
                />
                <path
                  d="M 83.2 80 L 91.8 80 L 91.8 72 L 93.4 72"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.65"
                  strokeDasharray="4 20"
                  className="text-lime-500 dark:text-lime-300 packet"
                />
              </svg>
            </div>

            {/* --- CÁC NODE MẠNG --- */}

            {/* 1. INTERNET */}
            <div className="absolute left-[5%] top-[50%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-cyan-600 shadow-lg shadow-cyan-500/20 dark:border-cyan-500/45 dark:bg-cyan-500/10 dark:text-cyan-300 cursor-default"
              >
                <Globe size={20} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-cyan-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-cyan-600 shadow-md shadow-cyan-500/15 backdrop-blur-md dark:bg-cyan-500/10 dark:text-cyan-300">
                Internet
              </div>
            </div>

            {/* 2. FIREWALL GATEWAY (Rose) */}
            <div className="absolute left-[29.5%] top-[50%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-300 bg-rose-100 text-rose-600 shadow-xl shadow-rose-500/25 dark:border-rose-400/60 dark:bg-rose-500/15 dark:text-rose-200 cursor-help"
              >
                <Shield size={24} className="animate-pulse" />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-rose-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-rose-600 shadow-md shadow-rose-500/15 backdrop-blur-md dark:bg-rose-500/10 dark:text-rose-200">
                Firewall
              </div>
            </div>

            {/* 3. WEB SERVER (Rose) */}
            <div className="absolute left-[29.5%] top-[22%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-300 bg-rose-50 text-rose-600 shadow-lg shadow-rose-500/20 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-300 cursor-default"
              >
                <Server size={18} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-rose-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-rose-600 shadow-md shadow-rose-500/15 backdrop-blur-md dark:bg-rose-500/10 dark:text-rose-300">
                Web Srv
              </div>
            </div>

            {/* 4. MAIL SERVER (Orange) */}
            <div className="absolute left-[29.5%] top-[78%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-300 bg-orange-50 text-orange-600 shadow-lg shadow-orange-500/20 dark:border-orange-500/50 dark:bg-orange-500/10 dark:text-orange-300 cursor-default"
              >
                <Mail size={18} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-orange-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-orange-600 shadow-md shadow-orange-500/15 backdrop-blur-md dark:bg-orange-500/10 dark:text-orange-300">
                Mail Srv
              </div>
            </div>

            {/* 5. CORE ROUTER (Amber - Đồng bộ nút bấm View Projects) */}
            <div className="absolute left-[39%] top-[36%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-300 bg-fuchsia-50 text-fuchsia-600 shadow-lg shadow-fuchsia-500/20 dark:border-fuchsia-500/50 dark:bg-fuchsia-500/10 dark:text-fuchsia-300 cursor-default"
              >
                <Lock size={17} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-fuchsia-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-fuchsia-600 shadow-md shadow-fuchsia-500/15 backdrop-blur-md dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
                WAF
              </div>
            </div>

            <div className="absolute left-[58%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.button
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 25px rgba(245,158,11,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/35 transition-colors hover:from-amber-400 hover:via-orange-500 hover:to-rose-500"
              >
                <Router size={28} />
              </motion.button>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-amber-50/95 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-700 shadow-md shadow-amber-500/20 backdrop-blur-md dark:bg-amber-500/15 dark:text-amber-200">
                Core Router
              </div>
            </div>

            {/* 6. DATABASE (Slate) */}
            <div className="absolute left-[80%] top-[20%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-600 shadow-lg shadow-violet-500/20 dark:border-violet-500/45 dark:bg-violet-500/10 dark:text-violet-300 cursor-default"
              >
                <Database size={18} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-violet-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-violet-600 shadow-md shadow-violet-500/15 backdrop-blur-md dark:bg-violet-500/10 dark:text-violet-300">
                Database
              </div>
            </div>

            {/* 7. ACCESS SWITCH (Amber) */}
            <div className="absolute left-[71.4%] top-[36%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-600 shadow-lg shadow-sky-500/20 dark:border-sky-500/45 dark:bg-sky-500/10 dark:text-sky-300 cursor-default"
              >
                <Cloud size={18} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-sky-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-sky-600 shadow-md shadow-sky-500/15 backdrop-blur-md dark:bg-sky-500/10 dark:text-sky-300">
                App Srv
              </div>
            </div>

            <div className="absolute left-[83%] top-[50%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300 bg-amber-100 text-amber-700 shadow-lg shadow-amber-500/25 dark:border-amber-400/55 dark:bg-amber-500/15 dark:text-amber-200 cursor-default"
              >
                <Network size={20} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-amber-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-amber-700 shadow-md shadow-amber-500/15 backdrop-blur-md dark:bg-amber-500/10 dark:text-amber-200">
                Switch
              </div>
            </div>

            {/* 8. WORKSTATION (Slate) */}
            <div className="absolute left-[80%] top-[80%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/20 dark:border-emerald-500/45 dark:bg-emerald-500/10 dark:text-emerald-300 cursor-default"
              >
                <Laptop size={20} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-emerald-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-emerald-600 shadow-md shadow-emerald-500/15 backdrop-blur-md dark:bg-emerald-500/10 dark:text-emerald-300">
                Client
              </div>
            </div>

            {/* 9. WI-FI CLIENT (Orange) */}
            <div className="absolute left-[96%] top-[28%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 shadow-lg shadow-blue-500/20 dark:border-blue-500/45 dark:bg-blue-500/10 dark:text-blue-300 cursor-default"
              >
                <Database size={17} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-blue-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-blue-600 shadow-md shadow-blue-500/15 backdrop-blur-md dark:bg-blue-500/10 dark:text-blue-300">
                NAS
              </div>
            </div>

            <div className="absolute left-[96%] top-[50%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-300 bg-orange-100 text-orange-600 shadow-lg shadow-orange-500/25 dark:border-orange-500/50 dark:bg-orange-500/15 dark:text-orange-300 cursor-default"
              >
                <Wifi size={18} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-orange-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-orange-600 shadow-md shadow-orange-500/15 backdrop-blur-md dark:bg-orange-500/10 dark:text-orange-300">
                Wi-Fi
              </div>
            </div>

            {/* --- WIDGETS KÉO THẢ --- */}
            <div className="absolute left-[96%] top-[72%] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-300 bg-lime-50 text-lime-700 shadow-lg shadow-lime-500/20 dark:border-lime-400/50 dark:bg-lime-500/10 dark:text-lime-300 cursor-default"
              >
                <RadioTower size={17} />
              </motion.div>
              <div className="absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-lime-50/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-lime-700 shadow-md shadow-lime-500/15 backdrop-blur-md dark:bg-lime-500/10 dark:text-lime-300">
                AP
              </div>
            </div>

            <div className="absolute left-[4%] top-[15%]">
              <motion.div
                data-cursor="pointer"
                drag
                dragConstraints={{
                  left: -10,
                  right: 100,
                  top: -20,
                  bottom: 50,
                }}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                className="flex cursor-grab select-none items-center gap-2 rounded-lg border border-indigo-400/80 bg-indigo-50/95 px-2.5 py-1.5 shadow-xl shadow-indigo-500/25 backdrop-blur-md dark:border-indigo-400/50 dark:bg-indigo-500/10"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-200">
                  Intrusion Blocked
                </span>
              </motion.div>
            </div>

            <div className="absolute right-[32%] bottom-[9%]">
              <motion.div
                data-cursor="pointer"
                drag
                dragConstraints={{
                  left: -10,
                  right: 100,
                  top: -50,
                  bottom: 20,
                }}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                className="flex cursor-grab select-none items-center gap-1.5 rounded-lg border border-cyan-300/80 bg-cyan-50/95 px-2.5 py-1.5 shadow-xl shadow-cyan-500/20 backdrop-blur-md dark:border-cyan-400/45 dark:bg-cyan-500/10"
              >
                <Network size={12} className="text-cyan-700 dark:text-cyan-300" />
                <span className="text-[10px] font-mono font-bold text-cyan-800 dark:text-cyan-200">
                  VLAN 20: WiFi
                </span>
              </motion.div>
            </div>
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
