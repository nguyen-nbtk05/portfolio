"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useLanguage } from "@/hooks/use-language";
import type { ProjectPresentation } from "@/data/projects";

interface ProjectVisualProps {
  presentation: ProjectPresentation;
}

export function ProjectVisual({ presentation }: ProjectVisualProps) {
  const { lang } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = !!shouldReduceMotion;

  if (presentation.type === "diagram") {
    if (presentation.variant === "datacenter") {
      return <DatacenterVisual reduceMotion={reduceMotion} />;
    }
    return <MultiCloudVisual reduceMotion={reduceMotion} />;
  }

  if (presentation.type === "terminal") {
    return (
      <TerminalVisual
        command={presentation.command}
        lines={presentation.lines}
        reduceMotion={reduceMotion}
      />
    );
  }

  if (presentation.type === "code") {
    return (
      <CodeVisual
        language={presentation.language}
        lines={presentation.lines}
        reduceMotion={reduceMotion}
      />
    );
  }

  if (presentation.type === "stats") {
    return <StatsVisual items={presentation.items} reduceMotion={reduceMotion} />;
  }

  if (presentation.type === "none") {
    return (
      <NoVisualOutcome
        title={lang({
          en: "Technical Architecture & Performance Outcome",
          vi: "Kiến Trúc Kỹ Thuật & Kết Quả Hiệu Năng",
        })}
        subtitle={lang({
          en: "Resilient infrastructure design focused on scalability, security, and high uptime.",
          vi: "Thiết kế hạ tầng tin cậy tập trung vào khả năng mở rộng, bảo mật và thời gian hoạt động cao.",
        })}
      />
    );
  }

  return null;
}

function DatacenterVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const spines = [
    { id: "s1", x: 120, y: 30, label: "SPINE-01" },
    { id: "s2", x: 230, y: 30, label: "SPINE-02" },
  ];

  const leaves = [
    { id: "l1", x: 55, y: 105, label: "LEAF-01" },
    { id: "l2", x: 125, y: 105, label: "LEAF-02" },
    { id: "l3", x: 225, y: 105, label: "LEAF-03" },
    { id: "l4", x: 295, y: 105, label: "LEAF-04" },
  ];

  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0.2 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 0.5,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.4, delay: i * 0.04, ease: "easeOut" as const },
    }),
  };

  const nodeVariants: Variants = {
    hidden: { scale: 0.85, opacity: 0 },
    visible: (delay: number) => ({
      scale: 1,
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.3, delay: typeof delay === "number" ? delay : 0, ease: "easeOut" as const },
    }),
  };

  let lineCount = 0;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 350 140"
        className="h-full w-full max-w-[350px] overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="dc-line-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(20 184 166)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {spines.map((s) =>
          leaves.map((l) => {
            const index = lineCount++;
            return (
              <motion.line
                key={`${s.id}-${l.id}`}
                x1={s.x}
                y1={s.y}
                x2={l.x}
                y2={l.y}
                stroke="url(#dc-line-grad)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                custom={index}
                initial={reduceMotion ? "visible" : "hidden"}
                animate="visible"
                variants={lineVariants}
              />
            );
          }),
        )}

        {spines.map((s, idx) => (
          <motion.g
            key={s.id}
            custom={idx * 0.08}
            initial={reduceMotion ? "visible" : "hidden"}
            animate="visible"
            variants={nodeVariants}
          >
            <rect
              x={s.x - 32}
              y={s.y - 12}
              width="64"
              height="24"
              rx="4"
              className="fill-white stroke-teal-500/80 dark:fill-slate-900 dark:stroke-teal-400/80"
              strokeWidth="1.2"
            />
            <circle cx={s.x - 20} cy={s.y} r="2.5" className="fill-teal-500" />
            <text
              x={s.x + 6}
              y={s.y + 3.5}
              textAnchor="middle"
              className="fill-slate-700 font-mono text-[8.5px] font-semibold tracking-wider dark:fill-slate-200"
            >
              {s.label}
            </text>
          </motion.g>
        ))}

        {leaves.map((l, idx) => (
          <motion.g
            key={l.id}
            custom={0.15 + idx * 0.06}
            initial={reduceMotion ? "visible" : "hidden"}
            animate="visible"
            variants={nodeVariants}
          >
            <rect
              x={l.x - 26}
              y={l.y - 10}
              width="52"
              height="20"
              rx="3"
              className="fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"
              strokeWidth="1.2"
            />
            <circle cx={l.x - 16} cy={l.y} r="2" className="fill-teal-500" />
            <text
              x={l.x + 4}
              y={l.y + 3}
              textAnchor="middle"
              className="fill-slate-600 font-mono text-[7.5px] font-medium dark:fill-slate-400"
            >
              {l.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

function MultiCloudVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const lineVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: (delay: number) => ({
      pathLength: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.4, delay: typeof delay === "number" ? delay : 0 },
    }),
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 350 140"
        className="h-full w-full max-w-[350px] overflow-visible"
        aria-hidden="true"
      >
        <motion.path
          d="M 85 70 H 165"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-teal-500"
          strokeDasharray="4 2"
          custom={0.1}
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={lineVariants}
        />
        <motion.path
          d="M 165 70 L 265 35"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-teal-500/80 dark:text-teal-400/80"
          strokeDasharray="4 2"
          custom={0.18}
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={lineVariants}
        />
        <motion.path
          d="M 165 70 L 265 105"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-teal-500/80 dark:text-teal-400/80"
          strokeDasharray="4 2"
          custom={0.24}
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={lineVariants}
        />

        <motion.g
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <rect
            x="15"
            y="48"
            width="70"
            height="44"
            rx="5"
            className="fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"
            strokeWidth="1.2"
          />
          <text
            x="50"
            y="68"
            textAnchor="middle"
            className="fill-slate-700 font-mono text-[8.5px] font-bold dark:fill-slate-200"
          >
            ON-PREM
          </text>
          <text
            x="50"
            y="80"
            textAnchor="middle"
            className="fill-slate-400 font-mono text-[7px] uppercase tracking-wider dark:fill-slate-500"
          >
            DATACENTER
          </text>
        </motion.g>

        <motion.g
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.12 }}
        >
          <rect
            x="130"
            y="46"
            width="65"
            height="48"
            rx="5"
            className="fill-white stroke-teal-500 dark:fill-slate-900 dark:stroke-teal-400"
            strokeWidth="1.5"
          />
          <text
            x="162.5"
            y="65"
            textAnchor="middle"
            className="fill-teal-600 font-mono text-[8.5px] font-bold dark:fill-teal-400"
          >
            IPsec VPN
          </text>
          <text
            x="162.5"
            y="78"
            textAnchor="middle"
            className="fill-slate-500 font-mono text-[7px] font-semibold dark:fill-slate-400"
          >
            PALO ALTO
          </text>
        </motion.g>

        <motion.g
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <rect
            x="265"
            y="18"
            width="70"
            height="34"
            rx="4"
            className="fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"
            strokeWidth="1.2"
          />
          <text
            x="300"
            y="34"
            textAnchor="middle"
            className="fill-slate-700 font-mono text-[8.5px] font-bold dark:fill-slate-200"
          >
            AWS VPC
          </text>
          <text
            x="300"
            y="44"
            textAnchor="middle"
            className="fill-teal-600 font-mono text-[7px] font-semibold dark:fill-teal-400"
          >
            ACTIVE ●
          </text>
        </motion.g>

        {/* Azure */}
        <motion.g
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <rect
            x="265"
            y="88"
            width="70"
            height="34"
            rx="4"
            className="fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"
            strokeWidth="1.2"
          />
          <text
            x="300"
            y="104"
            textAnchor="middle"
            className="fill-slate-700 font-mono text-[8.5px] font-bold dark:fill-slate-200"
          >
            AZURE
          </text>
          <text
            x="300"
            y="114"
            textAnchor="middle"
            className="fill-teal-600 font-mono text-[7px] font-semibold dark:fill-teal-400"
          >
            ACTIVE ●
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

function TerminalVisual({
  command,
  lines,
  reduceMotion,
}: {
  command: string;
  lines: string[];
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-900 text-slate-100 p-3 font-mono text-xs shadow-xs"
    >
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
        <span className="ml-2 text-[10px] text-slate-500 tracking-wider">
          automation.sh
        </span>
      </div>
      <div className="text-teal-400 font-semibold mb-1.5">{command}</div>
      <div className="space-y-1 text-[11px] text-slate-300">
        {lines.map((line, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {line.startsWith("✓") ? (
              <span className="text-teal-400 font-bold">{line}</span>
            ) : line.includes("complete") ? (
              <span className="text-emerald-400 font-medium">{line}</span>
            ) : (
              <span className="text-slate-400">{line}</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CodeVisual({
  language = "python",
  lines,
  reduceMotion,
}: {
  language?: string;
  lines: string[];
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-950 text-slate-200 p-3 font-mono text-xs shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 text-[10px] text-slate-500 uppercase tracking-wider">
        <span>snippet.{language}</span>
        <span className="text-teal-500 font-semibold">{language}</span>
      </div>
      <pre className="overflow-x-auto text-[11px] leading-relaxed">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="table-row">
              <span className="table-cell pr-3 text-slate-600 select-none text-[10px]">
                {i + 1}
              </span>
              <span className="table-cell text-slate-300">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </motion.div>
  );
}

function StatsVisual({
  items,
  reduceMotion,
}: {
  items: { value: string; label: { en: string; vi: string } }[];
  reduceMotion: boolean;
}) {
  const { lang } = useLanguage();
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full grid grid-cols-2 gap-3"
    >
      {items.map((stat, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 p-3 text-center"
        >
          <div className="font-mono text-lg font-bold text-teal-600 dark:text-teal-400">
            {stat.value}
          </div>
          <div className="font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 mt-0.5">
            {lang(stat.label)}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function NoVisualOutcome({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center rounded-lg border border-dashed border-slate-300/70 dark:border-slate-800/70 bg-slate-100/40 dark:bg-slate-900/20">
      <span className="h-2 w-2 rounded-full bg-teal-500 mb-2" />
      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mb-1">
        {title}
      </h5>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
