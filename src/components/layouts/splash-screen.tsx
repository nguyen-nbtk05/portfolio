"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useState, useRef } from "react";
import { FolderOpen, FileText, Beaker } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface SplashScreenProps {
  onComplete?: (targetSection?: string) => void;
}

type SplashPhase = "loading" | "ready_for_interaction" | "exiting";

const LOADING_DURATION_MS = 2500;
const PROGRESS_TICK_MS = 50;
const EXIT_DURATION_SECONDS = 0.55;
const ENTRANCE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Scattered network node background particles to fill empty space
const BACKGROUND_PARTICLES = [
  { top: "12%", left: "42%", size: 3.5, delay: 0.5, duration: 6 },
  { top: "25%", left: "75%", size: 2.8, delay: 1.2, duration: 8 },
  { top: "35%", left: "18%", size: 4.5, delay: 0.2, duration: 5 },
  { top: "65%", left: "82%", size: 3, delay: 2.1, duration: 7 },
  { top: "78%", left: "15%", size: 3.8, delay: 1.5, duration: 9 },
  { top: "82%", left: "52%", size: 2.5, delay: 0.8, duration: 6 },
  { top: "18%", left: "68%", size: 3.2, delay: 2.5, duration: 7.5 },
  { top: "72%", left: "32%", size: 2.8, delay: 0.3, duration: 6.5 },
  { top: "48%", left: "88%", size: 3.5, delay: 1.8, duration: 8.5 },
  { top: "88%", left: "78%", size: 4.5, delay: 0.9, duration: 7 },
];

// Dynamic HTML5 Canvas Constellation System
function ConstellationCanvas({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Dynamic particle count based on screen viewport size
    const particleCount = Math.min(45, Math.floor((width * height) / 30000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
      });
    }

    // Track mouse node attraction coordinates
    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft theme color schemes
      const nodeColor = isDarkMode ? "rgba(20, 184, 166, 0.5)" : "rgba(13, 148, 136, 0.3)";
      const glowColor = isDarkMode ? "rgba(20, 184, 166, 0.08)" : "rgba(13, 148, 136, 0.05)";
      const lineColor = isDarkMode ? "20, 184, 166" : "13, 148, 136";
      const connectionDistance = 150;

      // Draw and step particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node glow halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.fill();

        // Draw core node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      });

      // Draw dynamic link lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Real-time cursor connectivity attraction
        if (mouse.active) {
          const mDist = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
          if (mDist < connectionDistance + 35) {
            const alpha = (1 - mDist / (connectionDistance + 35)) * 0.4;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw cursor attraction halo
      if (mouse.active) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 45, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode ? "rgba(20, 184, 166, 0.06)" : "rgba(13, 148, 136, 0.04)";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none select-none" />;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<SplashPhase>("loading");
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mouse positions for 3D parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 100, mass: 0.6 };

  // Interpolated rotations & translations for card tilt
  const cardRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig);
  const cardRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);
  const cardTranslateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const cardTranslateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), springConfig);

  // Monitor document theme mutation to update canvas node colors on theme switches
  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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

  // Track mouse coordinates for interactive parallax
  useEffect(() => {
    if (reduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, reduceMotion]);

  const handleEnterApp = (sectionId?: string) => {
    if (phase !== "ready_for_interaction") return;

    setSelectedSection(sectionId);
    setPhase("exiting");
    setIsVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={() => onComplete?.(selectedSection)}>
      {isVisible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label={lang({
            en: "Loading portfolio",
            vi: "Đang tải portfolio",
          })}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: EXIT_DURATION_SECONDS } }
              : {
                  opacity: 0,
                  scale: 0.98,
                  transition: {
                    duration: EXIT_DURATION_SECONDS,
                    ease: ENTRANCE_EASE,
                  },
                }
          }
          transition={{
            duration: reduceMotion ? 0.3 : 0.6,
            ease: ENTRANCE_EASE,
          }}
        >
          {/* Scrolling 3D perspective cyber grid floor */}
          {!reduceMotion && (
            <div className="cyber-grid-container select-none">
              <div className="cyber-grid-lines" />
            </div>
          )}

          {/* HTML5 Canvas Constellation Animation */}
          {!reduceMotion && <ConstellationCanvas isDarkMode={isDarkMode} />}

          {/* Glowing colorful blurred background orbs */}
          {!reduceMotion && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
              {/* Orb A: Cyan-Teal gradient */}
              <motion.div
                className="absolute w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-cyan-400/22 to-teal-400/18 dark:from-cyan-600/10 dark:to-teal-500/10 blur-[100px]"
                animate={{
                  x: [0, 50, -30, 0],
                  y: [0, -70, 50, 0],
                  scale: [1, 1.15, 0.9, 1],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ top: "8%", left: "6%" }}
              />
              {/* Orb B: Teal-Emerald gradient */}
              <motion.div
                className="absolute w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-teal-400/20 to-emerald-400/18 dark:from-teal-600/9 dark:to-emerald-500/9 blur-[110px]"
                animate={{
                  x: [0, -60, 40, 0],
                  y: [0, 60, -50, 0],
                  scale: [1, 0.95, 1.1, 1],
                }}
                transition={{
                  duration: 22,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ bottom: "5%", right: "8%" }}
              />
              {/* Orb C: Indigo-Violet gradient */}
              <motion.div
                className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-indigo-400/22 to-violet-400/18 dark:from-indigo-600/10 dark:to-violet-500/10 blur-[90px]"
                animate={{
                  x: [0, 40, -50, 0],
                  y: [0, 50, 60, 0],
                  scale: [1, 1.2, 0.95, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ top: "40%", left: "35%" }}
              />
            </div>
          )}

          {/* Floating background node particles to populate empty space */}
          {!reduceMotion && BACKGROUND_PARTICLES.map((p, idx) => (
            <motion.span
              key={idx}
              className="absolute rounded-full bg-teal-400/35 dark:bg-teal-500/20 pointer-events-none select-none shadow-[0_0_8px_rgba(20,184,166,0.3)] z-0"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
              }}
              animate={{
                opacity: [0.15, 0.75, 0.15],
                y: [0, -18, 0],
                x: [0, 8, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Background Grid Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.03),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.03),transparent_40%)]" />

          {/* Wrapper to hold the glow shadow aura behind the tilted card */}
          <div className="relative w-full max-w-3xl mx-4 flex items-center justify-center z-10">
            
            {/* Ambient Breathing Glow Aura behind card */}
            {!reduceMotion && (
              <motion.div
                className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-tr from-cyan-500/15 via-teal-500/8 to-indigo-500/15 blur-3xl pointer-events-none select-none -z-10"
                animate={{
                  opacity: [0.55, 0.85, 0.55],
                  scale: [0.97, 1.03, 0.97],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Main glassmorphism card with 3D parallax tilt */}
            <motion.div
              className={`w-full rounded-[2.5rem] bg-white/70 border border-white/80 shadow-[0_32px_100px_-20px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-900/60 dark:border-slate-800/80 dark:shadow-[0_32px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden relative p-8 sm:p-10 min-h-[380px] ${
                phase === "ready_for_interaction" ? "cursor-pointer" : ""
              }`}
              onClick={() => phase === "ready_for_interaction" && handleEnterApp()}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: ENTRANCE_EASE }}
              style={{
                rotateX: reduceMotion ? 0 : cardRotateX,
                rotateY: reduceMotion ? 0 : cardRotateY,
                x: reduceMotion ? 0 : cardTranslateX,
                y: reduceMotion ? 0 : cardTranslateY,
                transformStyle: "preserve-3d",
              }}
              whileHover={
                phase === "ready_for_interaction" && !reduceMotion
                  ? { y: -3, transition: { duration: 0.2 } }
                  : {}
              }
            >
              {/* Decorative Dot Grid in Top-Right */}
              <div className="absolute top-8 right-10 hidden sm:grid grid-cols-3 gap-2 opacity-20 dark:opacity-35 pointer-events-none select-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                ))}
              </div>

              {/* Vertical Pagination indicators on the Right edge */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2.5 pointer-events-none select-none">
                <span className="w-2 h-2 bg-teal-500 dark:bg-teal-400 rounded-sm shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                <span className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-sm" />
                <span className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-sm" />
              </div>

              {/* Content area split by layout */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch flex-grow">
                
                {/* Left-hand vertical line and cybernetic gateway icon badge */}
                <div className="flex md:flex-col items-center justify-start md:justify-center relative w-full md:w-16">
                  <div className="absolute left-6 md:left-1/2 right-auto md:right-auto top-1/2 md:top-0 bottom-1/2 md:bottom-0 w-[calc(100%-48px)] md:w-px h-px md:h-full border-t md:border-l border-dashed border-slate-300/80 dark:border-slate-800 pointer-events-none select-none -translate-y-1/2 md:translate-y-0 md:-translate-x-1/2" />
                  
                  <div className="relative z-10 w-12 h-12 rounded-full border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950 flex items-center justify-center shadow-lg shadow-slate-200/40 dark:shadow-black/50">
                    <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" className="fill-teal-500/10" />
                      <circle cx="12" cy="12" r="1.5" className="fill-teal-600 dark:fill-teal-400" />
                      <circle cx="12" cy="12" r="6" strokeDasharray="2 2" className="opacity-80" />
                      <circle cx="12" cy="12" r="9" className="opacity-45" />
                      <line x1="12" y1="2" x2="12" y2="4" />
                      <line x1="12" y1="20" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="4" y2="12" />
                      <line x1="20" y1="12" x2="22" y2="12" />
                    </svg>
                  </div>
                </div>

                {/* Right-hand text contents and action pills */}
                <div className="flex-grow flex flex-col justify-center">
                  {/* Welcome label */}
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase">
                      {lang({ en: "Welcome", vi: "Chào mừng" })}
                    </span>
                  </div>

                  {/* Subheadings/Tags */}
                  <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest flex flex-wrap items-center gap-2 mt-4">
                    <span className="text-teal-600 dark:text-teal-400">
                      {lang({ en: "Portfolio", vi: "Hồ sơ" })}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-teal-600 dark:text-teal-400">
                      {lang({ en: "Networking", vi: "Kết nối" })}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {lang({ en: "Systems", vi: "Hệ thống" })}
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mt-4 leading-tight">
                    {lang({
                      en: (
                        <>
                          Hi, welcome to my{" "}
                          <span className="text-teal-600 dark:text-teal-400 font-extrabold">
                            portfolio.
                          </span>
                        </>
                      ),
                      vi: (
                        <>
                          Xin chào, chào mừng đến với{" "}
                          <span className="text-teal-600 dark:text-teal-400 font-extrabold">
                            portfolio
                          </span>{" "}
                          của tôi.
                        </>
                      ),
                    })}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-xl leading-relaxed">
                    {lang({
                      en: "A simple place to explore projects, practical IT work, and ideas I enjoy building.",
                      vi: "Một góc nhỏ để khám phá các dự án, công việc IT thực tế và những ý tưởng tôi thích xây dựng.",
                    })}
                  </p>

                  {/* Path Action Pills */}
                  <div className="flex flex-wrap gap-3 mt-6 sm:mt-8">
                    <motion.button
                      type="button"
                      disabled={phase !== "ready_for_interaction"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterApp("projects");
                      }}
                      className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full border border-slate-200/80 bg-white/40 dark:border-slate-800 dark:bg-slate-950/40 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 hover:border-teal-500 dark:hover:text-teal-400 dark:hover:border-teal-500 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      whileHover={
                        phase === "ready_for_interaction" && !reduceMotion
                          ? { y: -2, scale: 1.025, backgroundColor: "rgba(255,255,255,0.9)" }
                          : {}
                      }
                      whileTap={phase === "ready_for_interaction" && !reduceMotion ? { scale: 0.975 } : {}}
                    >
                      <FolderOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{lang({ en: "Projects", vi: "Dự án" })}</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      disabled={phase !== "ready_for_interaction"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterApp("blog");
                      }}
                      className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full border border-slate-200/80 bg-white/40 dark:border-slate-800 dark:bg-slate-950/40 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 hover:border-teal-500 dark:hover:text-teal-400 dark:hover:border-teal-500 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      whileHover={
                        phase === "ready_for_interaction" && !reduceMotion
                          ? { y: -2, scale: 1.025, backgroundColor: "rgba(255,255,255,0.9)" }
                          : {}
                      }
                      whileTap={phase === "ready_for_interaction" && !reduceMotion ? { scale: 0.975 } : {}}
                    >
                      <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{lang({ en: "Notes", vi: "Ghi chú" })}</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      disabled={phase !== "ready_for_interaction"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterApp("skills");
                      }}
                      className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full border border-slate-200/80 bg-white/40 dark:border-slate-800 dark:bg-slate-950/40 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 hover:border-teal-500 dark:hover:text-teal-400 dark:hover:border-teal-500 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      whileHover={
                        phase === "ready_for_interaction" && !reduceMotion
                          ? { y: -2, scale: 1.025, backgroundColor: "rgba(255,255,255,0.9)" }
                          : {}
                      }
                      whileTap={phase === "ready_for_interaction" && !reduceMotion ? { scale: 0.975 } : {}}
                    >
                      <Beaker className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{lang({ en: "Labs", vi: "Thử nghiệm" })}</span>
                    </motion.button>
                  </div>

                </div>

              </div>

              {/* Bottom Progress and Status Row */}
              <div className="mt-8 pt-4 border-t border-slate-100/60 dark:border-slate-800/60">
                
                {/* Progress Labels */}
                <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold tracking-[0.2em]">
                  <span
                    className={`transition-colors duration-300 ${
                      phase === "loading"
                        ? "text-teal-600 dark:text-teal-400 font-extrabold animate-pulse"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {lang({ en: "PREPARING", vi: "ĐANG CHUẨN BỊ" })}
                  </span>
                  <span
                    className={`transition-colors duration-300 ${
                      phase === "ready_for_interaction"
                        ? "text-teal-600 dark:text-teal-400 font-extrabold"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {lang({ en: "READY", vi: "SẴN SÀNG" })}
                  </span>
                </div>

                {/* Progress Bar Line utilizing GPU transforms scaleX with Motion */}
                <div className="relative h-1.5 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-full overflow-hidden mt-3 shadow-inner">
                  <motion.div
                    className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-400 dark:to-teal-400 rounded-full shadow-[0_0_12px_rgba(20,184,166,0.6)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress / 100 }}
                    style={{ originX: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 75, damping: 14, mass: 0.55 }
                    }
                  />
                </div>

                {/* Action Helper Indicator */}
                {phase === "ready_for_interaction" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-[10px] sm:text-xs font-semibold tracking-wider text-teal-600/80 dark:text-teal-400/80 mt-3 animate-pulse"
                  >
                    {lang({
                      en: "Click a section or click anywhere to launch",
                      vi: "Chọn một mục hoặc nhấp bất kỳ đâu để bắt đầu",
                    })}
                  </motion.div>
                )}

              </div>

            </motion.div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
