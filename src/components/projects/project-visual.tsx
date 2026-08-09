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
    if (presentation.variant === "portfolio") {
      return <PortfolioVisual reduceMotion={reduceMotion} />;
    }
    if (presentation.variant === "malware-scanner") {
      return <YaraScannerVisual reduceMotion={reduceMotion} />;
    }
    return <SdnIdsVisual reduceMotion={reduceMotion} />;
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

function PortfolioVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[350px] overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950"
      aria-hidden="true"
    >
      <div className="flex items-center gap-1.5 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <span className="h-2 w-2 rounded-full bg-rose-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="ml-2 h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="grid grid-cols-[82px_1fr] gap-3 p-3">
        <div className="space-y-2 border-r border-slate-200 pr-3 dark:border-slate-800">
          {["ABOUT", "PROJECTS", "BLOG"].map((item, index) => (
            <div
              key={item}
              className={index === 1 ? "font-mono text-[7px] font-bold text-teal-500" : "font-mono text-[7px] text-slate-400"}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="font-mono text-[7px] font-bold tracking-wider text-teal-500">HELLO, WORLD_</div>
          <div className="h-2 w-4/5 rounded bg-slate-800 dark:bg-slate-200" />
          <div className="h-1.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-1.5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {["WEB", "LAB", "MDX"].map((item) => (
              <div key={item} className="rounded border border-teal-500/30 bg-teal-500/5 py-2 text-center font-mono text-[6px] font-semibold text-teal-600 dark:text-teal-400">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function YaraScannerVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[350px] overflow-hidden rounded-lg border border-slate-700 bg-slate-950 font-mono text-slate-200 shadow-sm"
      aria-hidden="true"
    >
      <div className="flex items-center border-b border-slate-800 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500/80" />
          <span className="h-2 w-2 rounded-full bg-amber-500/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-3 text-[7px] font-bold tracking-[0.18em] text-slate-400">
          YARA MALWARE SCANNER
        </span>
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgb(45_212_191)]" />
      </div>

      <div className="grid grid-cols-[1fr_104px] gap-2.5 p-3">
        <div className="space-y-2">
          <div className="rounded border border-slate-800 bg-slate-900/80 px-2.5 py-2">
            <div className="flex items-center justify-between text-[6px] uppercase tracking-wider text-slate-500">
              <span>Selected file</span>
              <span>1.8 MB</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[8px] font-semibold text-slate-200">
              <span className="text-teal-400">▸</span>
              sample.exe
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-[6px] uppercase tracking-wider text-slate-500">
              <span>Scan complete</span>
              <span className="text-teal-400">100%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={reduceMotion ? { width: "100%" } : { width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: reduceMotion ? 0 : 0.55, delay: 0.12 }}
                className="h-full rounded-full bg-teal-400"
              />
            </div>
          </div>

          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.45 }}
            className="flex items-center gap-2 rounded border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/20 text-[8px] font-bold text-rose-400">!</span>
            <div>
              <div className="text-[7px] font-bold tracking-wider text-rose-400">THREAT DETECTED</div>
              <div className="text-[6px] text-slate-500">2 detection engines matched</div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-2 border-l border-slate-800 pl-2.5">
          <div className="text-[6px] uppercase tracking-[0.16em] text-slate-500">Detection</div>
          {[
            { engine: "HASH", result: "SHA-256 MATCH" },
            { engine: "YARA", result: "AGENT TESLA" },
          ].map((item, index) => (
            <motion.div
              key={item.engine}
              initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.25 + index * 0.12 }}
              className="rounded border border-teal-500/25 bg-teal-500/5 px-2 py-2"
            >
              <div className="flex items-center gap-1 text-[7px] font-bold text-teal-400">
                <span>✓</span>
                {item.engine}
              </div>
              <div className="mt-1 text-[5.5px] leading-tight text-slate-500">{item.result}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SdnIdsVisual({ reduceMotion }: { reduceMotion: boolean }) {
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
          d="M 95 76 H 125"
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
          d="M 170 55 V 37"
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
          d="M 215 76 H 255"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-teal-500/80 dark:text-teal-400/80"
          strokeDasharray="4 2"
          custom={0.24}
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={lineVariants}
        />
        <motion.path
          d="M 95 124 L 140 96"
          stroke="currentColor"
          strokeWidth="1.1"
          className="text-slate-400 dark:text-slate-600"
          custom={0.3}
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
            x="5"
            y="55"
            width="90"
            height="43"
            rx="5"
            className="fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"
            strokeWidth="1.2"
          />
          <text
            x="50"
            y="71"
            textAnchor="middle"
            className="fill-slate-700 font-mono text-[8px] font-bold dark:fill-slate-200"
          >
            10 ATTACKERS
          </text>
          <text
            x="50"
            y="89"
            textAnchor="middle"
            className="fill-slate-400 font-mono text-[6px] uppercase tracking-wider dark:fill-slate-500"
          >
            DDoS · SCAN · ARP
          </text>
        </motion.g>

        <motion.g
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.12 }}
        >
          <rect
            x="125"
            y="55"
            width="90"
            height="42"
            rx="5"
            className="fill-white stroke-teal-500 dark:fill-slate-900 dark:stroke-teal-400"
            strokeWidth="1.5"
          />
          <text
            x="170"
            y="71"
            textAnchor="middle"
            className="fill-teal-600 font-mono text-[8.5px] font-bold dark:fill-teal-400"
          >
            OVS S1
          </text>
          <text
            x="170"
            y="85"
            textAnchor="middle"
            className="fill-slate-500 font-mono text-[7px] font-semibold dark:fill-slate-400"
          >
            OPENFLOW 1.3
          </text>
        </motion.g>

        <motion.g
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <rect
            x="125"
            y="5"
            width="90"
            height="32"
            rx="4"
            className="fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"
            strokeWidth="1.2"
          />
          <text
            x="170"
            y="18"
            textAnchor="middle"
            className="fill-slate-700 font-mono text-[8.5px] font-bold dark:fill-slate-200"
          >
            RYU IDS · C0
          </text>
          <text
            x="170"
            y="29"
            textAnchor="middle"
            className="fill-teal-600 font-mono text-[6px] font-semibold dark:fill-teal-400"
          >
            STATS 5s · ENTROPY 20s
          </text>
        </motion.g>

        <motion.g
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <rect
            x="255"
            y="55"
            width="90"
            height="43"
            rx="4"
            className="fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"
            strokeWidth="1.2"
          />
          <text
            x="300"
            y="71"
            textAnchor="middle"
            className="fill-slate-700 font-mono text-[8.5px] font-bold dark:fill-slate-200"
          >
            VICTIM · H1
          </text>
          <text
            x="300"
            y="85"
            textAnchor="middle"
            className="fill-teal-600 font-mono text-[6px] font-semibold dark:fill-teal-400"
          >
            FLOW DROP · 300s
          </text>
        </motion.g>

        <motion.g
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <rect
            x="5"
            y="111"
            width="90"
            height="26"
            rx="4"
            className="fill-slate-50 stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"
            strokeWidth="1.1"
          />
          {[0, 1, 2, 3, 4].map((host) => (
            <circle
              key={host}
              cx={23 + host * 13.5}
              cy="120"
              r="2.4"
              className="fill-slate-400 dark:fill-slate-600"
            />
          ))}
          <text
            x="50"
            y="132"
            textAnchor="middle"
            className="fill-slate-500 font-mono text-[5.5px] font-semibold dark:fill-slate-400"
          >
            5 BENIGN HOSTS
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
