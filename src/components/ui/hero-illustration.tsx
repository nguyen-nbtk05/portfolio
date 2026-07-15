"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Activity,
  AlertTriangle,
  ArrowDownUp,
  Check,
  CloudUpload,
  Code2,
  Home,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 638;
const ENTRANCE_EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35 },
  },
} as const;

const monitorVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.88 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.08, duration: 0.8, ease: ENTRANCE_EASE },
  },
} as const;

const UPTIME_VALUES = ["98%", "99%", "97%", "98%"] as const;
const LATENCY_VALUES = ["12ms", "18ms", "9ms", "15ms"] as const;
const THROUGHPUT_VALUES = ["1.2Gbps", "1.6Gbps", "980Mbps", "1.4Gbps"] as const;
const ERROR_VALUES = ["0.01%", "0.03%", "0.00%", "0.02%"] as const;

function useCyclingValue(
  active: boolean,
  values: readonly string[],
  intervalMs: number,
) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const resetId = window.setTimeout(() => setIndex(0), 0);

    if (!active || values.length <= 1) {
      return () => window.clearTimeout(resetId);
    }

    const intervalId = window.setInterval(() => {
      setIndex((current) => (current + 1) % values.length);
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(resetId);
    };
  }, [active, intervalMs, values]);

  if (!active) {
    return values[0] ?? "";
  }

  return values[index] ?? values[0] ?? "";
}

type ConnectorProps = {
  d: string;
  start: [number, number];
  end: [number, number];
  active: boolean;
  delay?: number;
  duration?: number;
  reverse?: boolean;
};

function EndpointPulse({
  point,
  active,
  delay,
}: {
  point: [number, number];
  active: boolean;
  delay: number;
}) {
  return (
    <motion.circle
      cx={point[0]}
      cy={point[1]}
      r="3"
      fill="currentColor"
      initial={{ opacity: 0, scale: 0.4 }}
      animate={
        active
          ? { opacity: [0.25, 0.95, 0.25], scale: [0.75, 1.65, 0.75] }
          : { opacity: 0.45, scale: 1 }
      }
      transition={
        active
          ? { delay, duration: 1.8, ease: "easeInOut", repeat: Infinity }
          : { duration: 0.2 }
      }
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    />
  );
}

function DataPacket({
  d,
  active,
  duration,
  reverse,
  size,
  delay,
}: {
  d: string;
  active: boolean;
  duration: number;
  reverse: boolean;
  size: number;
  delay: number;
}) {
  if (!active) return null;

  return (
    <circle
      r={size}
      fill="currentColor"
      className="drop-shadow-[0_0_5px_rgba(34,211,238,0.95)]"
    >
      <animateMotion
        begin={`${delay}s`}
        calcMode="linear"
        dur={`${duration}s`}
        keyPoints={reverse ? "1;0" : "0;1"}
        keyTimes="0;1"
        path={d}
        repeatCount="indefinite"
      />
    </circle>
  );
}

function Connector({
  d,
  start,
  end,
  active,
  delay = 0,
  duration = 3.2,
  reverse = false,
}: ConnectorProps) {
  const reduceMotion = useReducedMotion();

  return (
    <g className="text-cyan-500 dark:text-cyan-400">
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
        initial={{ opacity: 0, pathLength: reduceMotion ? 1 : 0 }}
        animate={{ opacity: active ? 0.16 : 0.08, pathLength: 1 }}
        transition={{
          delay: reduceMotion ? 0 : 0.38 + delay,
          duration: reduceMotion ? 0.2 : 0.8,
          ease: ENTRANCE_EASE,
        }}
        className="blur-[4px]"
      />
      <motion.path
        d={d}
        fill="none"
        markerStart={reverse ? "url(#hero-arrow)" : undefined}
        markerEnd={reverse ? undefined : "url(#hero-arrow)"}
        stroke="currentColor"
        strokeDasharray="5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        initial={{ opacity: 0, pathLength: reduceMotion ? 1 : 0 }}
        animate={{ opacity: 0.78, pathLength: 1 }}
        transition={{
          delay: reduceMotion ? 0 : 0.4 + delay,
          duration: reduceMotion ? 0.2 : 0.75,
          ease: ENTRANCE_EASE,
        }}
      />
      <DataPacket
        d={d}
        active={active}
        duration={duration}
        reverse={reverse}
        size={2.5}
        delay={delay + 0.65}
      />
      <circle
        cx={(reverse ? end : start)[0]}
        cy={(reverse ? end : start)[1]}
        r="2.25"
        fill="currentColor"
        opacity="0.65"
      />
      <EndpointPulse
        point={reverse ? start : end}
        active={active}
        delay={delay + 0.45}
      />
    </g>
  );
}

type FloatingCardProps = {
  active: boolean;
  className: string;
  delay: number;
  depth?: number;
  direction: [number, number];
  duration: number;
  dark?: boolean;
  glowClassName?: string;
  paddingClassName?: string;
  pointerX: MotionValue<number>;
  children: React.ReactNode;
};

function FloatingCard({
  active,
  className,
  delay,
  depth = 2,
  direction,
  duration,
  dark = false,
  glowClassName = "",
  paddingClassName = "p-4",
  pointerX,
  children,
}: FloatingCardProps) {
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const layerX = useTransform(pointerX, [-1, 1], [-depth, depth]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: reduceMotion ? 0 : direction[0],
        y: reduceMotion ? 0 : direction[1],
        scale: reduceMotion ? 1 : 0.9,
      }}
      animate={
        reduceMotion
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }
      }
      transition={{
        delay: reduceMotion ? 0 : delay,
        duration: reduceMotion ? 0.25 : 0.68,
        ease: ENTRANCE_EASE,
      }}
      style={{ zIndex: isHovered ? 40 : 20 }}
      className={`absolute ${className}`}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={reduceMotion ? undefined : { x: layerX }}
        className="pointer-events-none h-full w-full"
      >
        <motion.div
          animate={
            isHovered && !reduceMotion
              ? {
                  scale: 1.025,
                  filter: "drop-shadow(0 16px 18px rgba(6,182,212,0.3))",
                }
              : {
                  scale: 1,
                  filter: "drop-shadow(0 0 0 rgba(6,182,212,0))",
                }
          }
          transition={{ duration: 0.2, ease: ENTRANCE_EASE }}
          className="h-full w-full"
        >
          <div className="h-full w-full">
            <div
              className={`relative h-full w-full overflow-hidden rounded-2xl border shadow-[0_14px_34px_-18px_rgba(15,23,42,0.4)] backdrop-blur-sm ${paddingClassName} ${glowClassName} ${
                dark
                  ? "border-slate-700/80 bg-slate-950 text-slate-100 dark:border-slate-700"
                  : "border-white/90 bg-white/95 text-slate-800 dark:border-slate-700/80 dark:bg-slate-900/95 dark:text-slate-100"
              }`}
            >
              {children}
              <motion.span
                aria-hidden="true"
                animate={
                  active ? { opacity: [0, 0.28, 0] } : { opacity: 0 }
                }
                transition={
                  active
                    ? {
                        duration: duration * 0.72,
                        delay,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }
                    : { duration: 0.15 }
                }
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-cyan-300/70"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

type AnimatedCardProps = {
  active: boolean;
  pointerX: MotionValue<number>;
};

function TerminalCard({ active, pointerX }: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();
  const lines = [
    { className: "", content: "deploy --env prod", prefix: "$" },
    { className: "text-cyan-300", content: "Building...", prefix: ">" },
    { className: "text-emerald-400", content: "Deployed", prefix: ">" },
  ];

  return (
    <FloatingCard
      active={active}
      className="left-[76px] top-[110px] w-[166px]"
      delay={0.82}
      depth={3.2}
      direction={[-28, 8]}
      duration={5.8}
      dark
      paddingClassName="p-3.5"
      pointerX={pointerX}
    >
      <div className="mb-2.5 flex items-center gap-1.5">
        {["bg-rose-400", "bg-amber-300", "bg-emerald-400"].map(
          (color, index) => (
            <motion.span
              key={color}
              animate={
                active
                  ? { opacity: [0.45, 1, 0.45], scale: [0.9, 1.15, 0.9] }
                  : { opacity: 1, scale: 1 }
              }
              transition={
                active
                  ? {
                      delay: index * 0.18,
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : { duration: 0.2 }
              }
              className={`h-2 w-2 rounded-full ${color}`}
            />
          ),
        )}
      </div>
      <div className="space-y-1 font-mono text-[11px] leading-4">
        {lines.map((line, index) => (
          <motion.p
            key={line.content}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 1.08 + index * 0.3,
              duration: reduceMotion ? 0.2 : 0.35,
              ease: "easeOut",
            }}
            className={
              index === 2 ? `flex items-center ${line.className}` : line.className
            }
          >
            <span className="mr-2 text-cyan-500">{line.prefix}</span>
            {line.content}
            {index === 2 ? (
              <motion.span
                animate={active ? { scale: [0.8, 1.25, 1] } : { scale: 1 }}
                transition={
                  active
                    ? { delay: 1.7, duration: 1.4, repeat: Infinity }
                    : { duration: 0.2 }
                }
              >
                <Check className="ml-1 h-3 w-3" />
              </motion.span>
            ) : null}
          </motion.p>
        ))}
      </div>
    </FloatingCard>
  );
}

function CloudCard({ active, pointerX }: AnimatedCardProps) {
  return (
    <FloatingCard
      active={active}
      className="left-[342px] top-[36px] w-[220px]"
      delay={0.68}
      depth={2.5}
      direction={[0, -24]}
      duration={6.4}
      paddingClassName="p-3.5"
      pointerX={pointerX}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={
            active
              ? {
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 8px 18px rgba(20,184,166,0.22)",
                    "0 8px 28px rgba(34,211,238,0.58)",
                    "0 8px 18px rgba(20,184,166,0.22)",
                  ],
                }
              : { scale: 1 }
          }
          transition={
            active
              ? { duration: 2.2, ease: "easeInOut", repeat: Infinity }
              : { duration: 0.2 }
          }
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 text-white"
        >
          <motion.span
            animate={active ? { y: [2, -3, 2] } : { y: 0 }}
            transition={
              active
                ? { duration: 1.5, ease: "easeInOut", repeat: Infinity }
                : { duration: 0.2 }
            }
          >
            <CloudUpload className="h-6 w-6" />
          </motion.span>
          {active ? (
            <motion.span
              animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.45, 1.7] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-cyan-300"
            />
          ) : null}
        </motion.div>
        <div>
          <p className="text-[12px] font-bold">Cloud / Deployment</p>
          <p className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
            <motion.span
              animate={
                active
                  ? { opacity: [0.4, 1, 0.4], scale: [0.85, 1.25, 0.85] }
                  : { opacity: 1, scale: 1 }
              }
              transition={
                active
                  ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
              className="h-2 w-2 rounded-full bg-emerald-400"
            />
            Healthy
          </p>
        </div>
      </div>
    </FloatingCard>
  );
}

function ServersCard({ active, pointerX }: AnimatedCardProps) {
  const servers = ["Web Server", "App Server", "DB Server"];

  return (
    <FloatingCard
      active={active}
      className="left-[28px] top-[326px] w-[146px]"
      delay={0.92}
      depth={2.8}
      direction={[-26, 0]}
      duration={6.7}
      paddingClassName="p-3.5"
      pointerX={pointerX}
    >
      <div className="mb-3.5 flex items-center gap-2">
        <div className="space-y-0.5 text-slate-400">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="block h-2 w-8 rounded-sm border border-slate-300 dark:border-slate-600"
            />
          ))}
        </div>
        <p className="text-[12px] font-bold">Servers</p>
      </div>
      <div className="space-y-3">
        {servers.map((server) => (
          <div
            key={server}
            className="flex items-center justify-between text-[9px]"
          >
            <span className="font-semibold">{server}</span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              Online
              <motion.span
                animate={
                  active
                    ? { opacity: [0.35, 1, 0.35], scale: [0.8, 1.25, 0.8] }
                    : { opacity: 1, scale: 1 }
                }
                transition={
                  active
                    ? {
                        delay: servers.indexOf(server) * 0.32,
                        duration: 1.9,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { duration: 0.2 }
                }
                className="h-2 w-2 rounded-full bg-emerald-400"
              />
            </span>
          </div>
        ))}
      </div>
    </FloatingCard>
  );
}

function SecurityCard({ active, pointerX }: AnimatedCardProps) {
  return (
    <FloatingCard
      active={active}
      className="left-[718px] top-[220px] w-[108px]"
      delay={1.04}
      depth={3.4}
      direction={[26, 0]}
      duration={6}
      paddingClassName="p-3"
      pointerX={pointerX}
    >
      <div className="flex flex-col items-center justify-center">
        <motion.div
          animate={
            active
              ? { rotateY: [0, 12, -12, 0], scale: [1, 1.06, 1] }
              : { rotateY: 0, scale: 1 }
          }
          transition={
            active
              ? { duration: 3.4, ease: "easeInOut", repeat: Infinity }
              : { duration: 0.2 }
          }
          className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[17px] bg-gradient-to-br from-cyan-400 to-teal-500 text-white shadow-lg shadow-teal-500/25"
        >
          <ShieldCheck className="h-8 w-8" />
          {active ? (
            <motion.span
              animate={{ x: [-58, 58] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-16 w-3 rotate-12 bg-white/45 blur-[2px]"
            />
          ) : null}
        </motion.div>
        <p className="mt-3 text-[11px] font-bold">Security</p>
        <p className="mt-1.5 flex items-center gap-2 text-[9px] text-slate-500 dark:text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Protected
        </p>
      </div>
    </FloatingCard>
  );
}

function ConfigurationCard({ active, pointerX }: AnimatedCardProps) {
  const lines = ["w-20", "w-28", "w-24", "w-16"];

  return (
    <FloatingCard
      active={active}
      className="left-[682px] top-[410px] w-[150px]"
      delay={1.16}
      depth={3}
      direction={[26, 10]}
      duration={6.9}
      paddingClassName="p-3.5"
      pointerX={pointerX}
    >
      <p className="mb-3 text-[11px] font-bold">Configuration</p>
      <div className="space-y-1.5">
        {lines.map((width, index) => (
          <span
            key={width}
            className={`relative block h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${width}`}
          >
            {active ? (
              <span
                style={
                  {
                    "--sweep-delay": `${index * 0.18}s`,
                    "--sweep-duration": "2.8s",
                  } as React.CSSProperties
                }
                className="hero-neon-sweep absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent"
              />
            ) : null}
          </span>
        ))}
      </div>
    </FloatingCard>
  );
}

function LogsCard({ active, pointerX }: AnimatedCardProps) {
  return (
    <FloatingCard
      active={active}
      className="left-[313px] top-[515px] min-h-[86px] w-[278px]"
      delay={1.28}
      depth={2.4}
      direction={[0, 24]}
      duration={6.2}
      paddingClassName="p-3.5"
      pointerX={pointerX}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold">System Logs</p>
        <motion.span
          animate={
            active
              ? { opacity: [0.45, 1, 0.45], scale: [0.8, 1.2, 0.8] }
              : { opacity: 1, scale: 1 }
          }
          transition={
            active
              ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
          className="h-3 w-3 rounded-full border-[3px] border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
        />
      </div>
      <div className="mt-2.5 space-y-2.5">
        {[
          ["bg-emerald-400", "w-40"],
          ["bg-violet-400", "w-28"],
          ["bg-blue-400", "w-36"],
        ].map(([color, width]) => (
          <motion.div
            key={`${color}-${width}`}
            animate={
              active
                ? { opacity: [0.45, 1, 0.72], x: [-4, 0, 0] }
                : { opacity: 1, x: 0 }
            }
            transition={
              active
                ? {
                    delay: [
                      "bg-emerald-400",
                      "bg-violet-400",
                      "bg-blue-400",
                    ].indexOf(color) * 0.28,
                    duration: 2.4,
                    repeat: Infinity,
                    repeatDelay: 0.4,
                  }
                : { duration: 0.2 }
            }
            className="flex items-center gap-3"
          >
            <span className={`h-2 w-2 rounded-full ${color}`} />
            <span
              className={`block h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 ${width}`}
            />
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-3 right-3 flex h-7 w-10 items-center justify-center rounded-md bg-slate-100 text-cyan-500 dark:bg-slate-800">
        <Code2 className="h-4 w-4" />
      </div>
    </FloatingCard>
  );
}

function MetricCard({
  active,
  delay,
  icon,
  label,
  value,
}: {
  active: boolean;
  delay: number;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      animate={
        active
          ? {
              y: [0, -2, 0],
              boxShadow: [
                "0 0 0 rgba(34,211,238,0)",
                "0 7px 18px -10px rgba(34,211,238,0.65)",
                "0 0 0 rgba(34,211,238,0)",
              ],
            }
          : { y: 0 }
      }
      transition={
        active
          ? {
              delay,
              duration: 2.6,
              ease: "easeInOut",
              repeat: Infinity,
            }
          : { duration: 0.2 }
      }
      className="rounded-lg border border-slate-100 bg-slate-50/90 p-3 dark:border-slate-700/70 dark:bg-slate-800/70"
    >
      <p className="flex items-center gap-1.5 text-[8px] font-semibold text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </p>
      <motion.p
        animate={active ? { opacity: [0.72, 1, 0.72] } : { opacity: 1 }}
        transition={
          active
            ? { delay, duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        className="mt-3 text-[13px] font-bold text-slate-900 dark:text-white"
      >
        {value}
      </motion.p>
    </motion.div>
  );
}

function MonitorDashboard({
  active,
  pointerX,
  pointerY,
}: {
  active: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const uptime = useCyclingValue(active, UPTIME_VALUES, 1400);
  const latency = useCyclingValue(active, LATENCY_VALUES, 1200);
  const throughput = useCyclingValue(active, THROUGHPUT_VALUES, 1500);
  const errors = useCyclingValue(active, ERROR_VALUES, 1700);
  const monitorX = useTransform(pointerX, [-1, 1], [-3, 3]);
  const monitorY = useTransform(pointerY, [-1, 1], [-2, 2]);
  const monitorRotateX = useTransform(pointerY, [-1, 1], [1.8, -1.8]);
  const monitorRotateY = useTransform(pointerX, [-1, 1], [-2.2, 2.2]);

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : monitorVariants.hidden}
      animate={reduceMotion ? { opacity: 1 } : monitorVariants.visible}
      style={{ zIndex: isHovered ? 35 : 10 }}
      className="absolute left-[263px] top-[190px] z-10 w-[378px]"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={
          reduceMotion
            ? undefined
            : {
                x: monitorX,
                y: monitorY,
                rotateX: monitorRotateX,
                rotateY: monitorRotateY,
                transformPerspective: 1000,
                transformStyle: "preserve-3d",
              }
        }
        className="pointer-events-none w-full"
      >
        <motion.div
          animate={
            isHovered && !reduceMotion
              ? {
                  scale: 1.012,
                  filter: "drop-shadow(0 18px 24px rgba(6,182,212,0.2))",
                }
              : {
                  scale: 1,
                  filter: "drop-shadow(0 0 0 rgba(6,182,212,0))",
                }
          }
          transition={{ duration: 0.2, ease: ENTRANCE_EASE }}
          className="w-full"
        >
          <div className="h-[270px] rounded-[18px] border-[9px] border-slate-800 bg-slate-800 p-1 shadow-[0_24px_42px_-25px_rgba(15,23,42,0.75)] dark:border-white/80 dark:bg-white/20 dark:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.6)]">
        <div className="flex h-full overflow-hidden rounded-[8px] bg-white dark:bg-slate-900">
          <aside className="flex w-[50px] shrink-0 flex-col items-center gap-4 border-r border-slate-100 bg-slate-50/80 py-4 text-slate-400 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-500">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 text-white shadow-md shadow-teal-500/20">
              <Home className="h-4 w-4" />
            </div>
            <Activity className="h-5 w-5" />
            <ShieldCheck className="h-5 w-5" />
            <SlidersHorizontal className="h-5 w-5" />
            <Settings className="mt-auto h-5 w-5" />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col p-3.5">
            <div className="flex h-8 items-center justify-between rounded-lg border border-slate-100 bg-white px-3 dark:border-slate-800 dark:bg-slate-900">
              <span className="h-2 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-100 dark:bg-slate-800" />
                <span className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>

            <div className="mt-2.5 grid flex-1 grid-cols-[1.8fr_0.9fr] gap-2.5">
              <div className="relative overflow-hidden rounded-lg border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/30">
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 180 96"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="hero-chart-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.34" />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.03" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 76 L24 42 L48 68 L72 48 L96 62 L120 28 L144 58 L180 18 L180 96 L0 96 Z"
                    fill="url(#hero-chart-area)"
                  />
                  <motion.path
                    d="M0 76 L24 42 L48 68 L72 48 L96 62 L120 28 L144 58 L180 18"
                    fill="none"
                    stroke="#14b8a6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    initial={
                      reduceMotion
                        ? { pathLength: 1, opacity: 1 }
                        : { pathLength: 0, opacity: 0.5 }
                    }
                    animate={
                      active
                        ? { pathLength: [0, 1, 1], opacity: [0.5, 1, 1] }
                        : { pathLength: 1, opacity: 1 }
                    }
                    transition={
                      active
                        ? {
                            duration: 4.8,
                            times: [0, 0.32, 1],
                            repeat: Infinity,
                            repeatDelay: 0.7,
                            ease: "easeInOut",
                          }
                        : { duration: 0.3 }
                    }
                  />
                  {[24, 48, 72, 96, 120, 144].map((x, index) => {
                    const y = [42, 68, 48, 62, 28, 58][index];
                    return (
                      <motion.circle
                        key={x}
                        cx={x}
                        cy={y}
                        r="2.5"
                        fill="#14b8a6"
                        initial={{ opacity: 1, scale: 1 }}
                        animate={
                          active
                            ? { opacity: [0.4, 1, 0.4], scale: [0.75, 1.35, 0.75] }
                            : { opacity: 1, scale: 1 }
                        }
                        transition={
                          active
                            ? {
                                delay: index * 0.16,
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }
                            : { duration: 0.2 }
                        }
                        style={{
                          transformBox: "fill-box",
                          transformOrigin: "center",
                        }}
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/30">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="31"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="31"
                      fill="none"
                      stroke="#14b8a6"
                      strokeDasharray="194.8"
                      strokeDashoffset={reduceMotion ? 3.9 : 194.8}
                      strokeLinecap="round"
                      strokeWidth="8"
                      initial={{
                        strokeDashoffset: reduceMotion ? 3.9 : 194.8,
                      }}
                      animate={
                        active
                          ? { strokeDashoffset: [194.8, 3.9, 3.9] }
                          : { strokeDashoffset: 3.9 }
                      }
                      transition={
                        active
                          ? {
                              duration: 4.6,
                              times: [0, 0.32, 1],
                              repeat: Infinity,
                              repeatDelay: 0.8,
                              ease: "easeInOut",
                            }
                          : { duration: 0.3 }
                      }
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-[15px] font-bold">{uptime}</p>
                    <p className="text-[7px] text-slate-500 dark:text-slate-400">
                      Uptime
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2">
              <MetricCard
                active={active}
                delay={0}
                icon={<Activity className="h-3 w-3 text-cyan-500" />}
                label="Latency"
                value={latency}
              />
              <MetricCard
                active={active}
                delay={0.25}
                icon={<ArrowDownUp className="h-3 w-3 text-teal-500" />}
                label="Throughput"
                value={throughput}
              />
              <MetricCard
                active={active}
                delay={0.5}
                icon={<AlertTriangle className="h-3 w-3 text-amber-500" />}
                label="Errors"
                value={errors}
              />
            </div>
          </div>
        </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function HeroIllustration() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(rootRef, { amount: 0.18 });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, {
    damping: 24,
    stiffness: 130,
    mass: 0.55,
  });
  const springY = useSpring(pointerY, {
    damping: 24,
    stiffness: 130,
    mass: 0.55,
  });
  const groupX = useTransform(springX, [-1, 1], [-6, 6]);
  const groupRotateX = useTransform(springY, [-1, 1], [1.2, -1.2]);
  const groupRotateY = useTransform(springX, [-1, 1], [-1.5, 1.5]);
  const animationActive = isInView && !reduceMotion;

  const scaleStyle = {
    width: `calc(${CANVAS_WIDTH}px * var(--illustration-scale))`,
    height: `calc(${CANVAS_HEIGHT}px * var(--illustration-scale))`,
  } as React.CSSProperties;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      reduceMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    // Center pivot of the computer screen drawing inside 850x638 canvas:
    // X = 452px / 850px = 0.53176
    // Y = 325px / 638px = 0.5094
    const screenCenterX = 452 / 850;
    const screenCenterY = 325 / 638;

    pointerX.set(Math.max(-1, Math.min(1, (px - screenCenterX) * 2)));
    pointerY.set(Math.max(-1, Math.min(1, (py - screenCenterY) * 2)));
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      onPointerCancel={resetPointer}
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
      className="hero-illustration-scale relative hidden shrink-0 lg:block"
      style={scaleStyle}
    >
      <motion.div
        variants={containerVariants}
        initial={reduceMotion ? { opacity: 0 } : "hidden"}
        animate="visible"
        className="absolute left-0 top-0 h-[638px] w-[850px] origin-top-left select-none"
        style={{ scale: "var(--illustration-scale)" }}
      >
        <motion.div
          animate={animationActive ? { y: [0, -8, 0] } : { y: 0 }}
          className="absolute inset-0 select-none"
          transition={{
            duration: 5.8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
        <motion.div
          className="hero-illustration-wrapper absolute inset-0 select-none"
          style={
            reduceMotion
              ? undefined
              : {
                  x: groupX,
                  rotateX: groupRotateX,
                  rotateY: groupRotateY,
                  transformPerspective: 1200,
                  transformStyle: "preserve-3d",
                  transformOrigin: "452px 325px",
                }
          }
        >
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.28, duration: 0.45 }}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        >
          <defs>
            <marker
              id="hero-arrow"
              markerHeight="8"
              markerUnits="userSpaceOnUse"
              markerWidth="8"
              orient="auto-start-reverse"
              refX="6.5"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path
                d="M1 1.25 L6.5 4 L1 6.75"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                className="text-cyan-500"
              />
            </marker>
          </defs>
          <Connector
            active={animationActive}
            d="M242 163 H280 Q292 163 292 151 V91 Q292 79 304 79 H342"
            delay={0}
            duration={3.1}
            end={[342, 79]}
            start={[242, 163]}
          />
          <Connector
            active={animationActive}
            d="M452 110 V190"
            delay={0.15}
            duration={3.5}
            end={[452, 190]}
            start={[452, 110]}
          />
          <Connector
            active={animationActive}
            d="M174 400 H263"
            delay={0.3}
            duration={3.8}
            end={[263, 400]}
            start={[174, 400]}
          />
          <Connector
            active={animationActive}
            d="M641 286 H718"
            delay={0.45}
            duration={3.3}
            end={[718, 286]}
            start={[641, 286]}
            reverse
          />
          <Connector
            active={animationActive}
            d="M641 453 H682"
            delay={0.6}
            duration={4}
            end={[682, 453]}
            start={[641, 453]}
          />
          <Connector
            active={animationActive}
            d="M452 464 V515"
            delay={0.75}
            duration={4}
            end={[452, 515]}
            start={[452, 464]}
          />
        </motion.svg>

        <MonitorDashboard
          active={animationActive}
          pointerX={springX}
          pointerY={springY}
        />
        <TerminalCard
          active={animationActive}
          pointerX={springX}
        />
        <CloudCard
          active={animationActive}
          pointerX={springX}
        />
        <ServersCard
          active={animationActive}
          pointerX={springX}
        />
        <SecurityCard
          active={animationActive}
          pointerX={springX}
        />
        <ConfigurationCard
          active={animationActive}
          pointerX={springX}
        />
        <LogsCard
          active={animationActive}
          pointerX={springX}
        />
        </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
