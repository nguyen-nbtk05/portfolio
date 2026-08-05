"use client";

import type { ElementType } from "react";
import {
  Network,
  PanelsTopLeft,
  RadioTower,
  Route,
  Waypoints,
  Workflow,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  SiArchlinux,
  SiCisco,
  SiDebian,
  SiGit,
  SiGithub,
  SiGnubash,
  SiJavascript,
  SiLinux,
  SiPython,
  SiRedhat,
  SiRust,
  SiTypescript,
} from "react-icons/si";
import { TbTopologyStar3 } from "react-icons/tb";
import { Section } from "../ui/section";
import {
  skills,
  type SkillGroupTone,
  type SkillIconKey,
  type SkillTone,
} from "@/data/skills";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Variants } from "motion/react";

const skillChipVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    y: 0,
  },
};

const skillIconMap = {
  python: SiPython,
  javascript: SiJavascript,
  typescript: SiTypescript,
  rust: SiRust,
  bash: SiGnubash,
  linux: SiLinux,
  debian: SiDebian,
  "red-hat": SiRedhat,
  "arch-linux": SiArchlinux,
  git: SiGit,
  github: SiGithub,
  "network-engineering": TbTopologyStar3,
  ipv4: Network,
  ipv6: RadioTower,
  subnetting: PanelsTopLeft,
  rip: Route,
  ospf: Waypoints,
  eigrp: Workflow,
  cisco: SiCisco,
} satisfies Record<SkillIconKey, ElementType>;

const groupToneStyles: Record<
  SkillGroupTone,
  { card: string; header: string; icon: string; glow: string }
> = {
  programming: {
    card: "hover:border-cyan-400/50 dark:hover:border-cyan-400/35",
    header:
      "from-cyan-100/95 via-slate-50/95 to-violet-100/90 dark:from-cyan-950/75 dark:via-slate-950/95 dark:to-violet-950/70",
    icon:
      "border-cyan-300/60 bg-cyan-100/80 text-cyan-600 shadow-cyan-500/15 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-300",
    glow: "bg-cyan-400/25 dark:bg-cyan-400/15",
  },
  linux: {
    card: "hover:border-amber-400/50 dark:hover:border-amber-400/35",
    header:
      "from-amber-100/95 via-slate-50/95 to-emerald-100/90 dark:from-amber-950/70 dark:via-slate-950/95 dark:to-emerald-950/70",
    icon:
      "border-amber-300/60 bg-amber-100/80 text-amber-600 shadow-amber-500/15 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300",
    glow: "bg-amber-400/25 dark:bg-amber-400/15",
  },
  collaboration: {
    card: "hover:border-orange-400/50 dark:hover:border-orange-400/35",
    header:
      "from-orange-100/95 via-slate-50/95 to-violet-100/90 dark:from-orange-950/70 dark:via-slate-950/95 dark:to-violet-950/70",
    icon:
      "border-orange-300/60 bg-orange-100/80 text-orange-600 shadow-orange-500/15 dark:border-orange-400/25 dark:bg-orange-400/10 dark:text-orange-300",
    glow: "bg-orange-400/25 dark:bg-orange-400/15",
  },
  networking: {
    card: "hover:border-blue-400/50 dark:hover:border-blue-400/35",
    header:
      "from-blue-100/95 via-slate-50/95 to-cyan-100/90 dark:from-blue-950/70 dark:via-slate-950/95 dark:to-cyan-950/70",
    icon:
      "border-blue-300/60 bg-blue-100/80 text-blue-600 shadow-blue-500/15 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-300",
    glow: "bg-blue-400/25 dark:bg-blue-400/15",
  },
};

const skillToneStyles: Record<SkillTone, { chip: string; icon: string }> = {
  cyan: {
    chip: "hover:border-cyan-400/55 hover:bg-cyan-500/10 hover:shadow-cyan-500/10",
    icon: "text-cyan-500",
  },
  blue: {
    chip: "hover:border-blue-400/55 hover:bg-blue-500/10 hover:shadow-blue-500/10",
    icon: "text-blue-500",
  },
  indigo: {
    chip: "hover:border-indigo-400/55 hover:bg-indigo-500/10 hover:shadow-indigo-500/10",
    icon: "text-indigo-500",
  },
  violet: {
    chip: "hover:border-violet-400/55 hover:bg-violet-500/10 hover:shadow-violet-500/10",
    icon: "text-violet-500",
  },
  emerald: {
    chip: "hover:border-emerald-400/55 hover:bg-emerald-500/10 hover:shadow-emerald-500/10",
    icon: "text-emerald-500",
  },
  amber: {
    chip: "hover:border-amber-400/55 hover:bg-amber-500/10 hover:shadow-amber-500/10",
    icon: "text-amber-500",
  },
  orange: {
    chip: "hover:border-orange-400/55 hover:bg-orange-500/10 hover:shadow-orange-500/10",
    icon: "text-orange-500",
  },
  rose: {
    chip: "hover:border-rose-400/55 hover:bg-rose-500/10 hover:shadow-rose-500/10",
    icon: "text-rose-500",
  },
  red: {
    chip: "hover:border-red-400/55 hover:bg-red-500/10 hover:shadow-red-500/10",
    icon: "text-red-500",
  },
  slate: {
    chip: "hover:border-slate-400/60 hover:bg-slate-500/10 hover:shadow-slate-500/10",
    icon: "text-slate-500 dark:text-slate-300",
  },
};

export function SkillsSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <Section
      id="skills"
      data-cursor="default"
      title={lang({ en: "Technical Skills", vi: "Kỹ năng chuyên môn" })}
      subtitle={lang({
        en: "Core technologies and tools for programming, Linux administration, version control, and network engineering.",
        vi: "Những công nghệ và công cụ cốt lõi cho lập trình, quản trị Linux, quản lý phiên bản và kỹ thuật mạng.",
      })}
      headerClassName="mb-8 md:mb-10 xl:px-4 2xl:px-6"
      subtitleClassName="xl:max-w-none xl:whitespace-nowrap"
    >
      <motion.div
        className="mt-5 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4 xl:px-4 2xl:gap-8 2xl:px-6"
        initial={initial}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.1, 0.08)}
      >
        {skills.map((skillGroup) => {
          const GroupIcon = skillIconMap[skillGroup.icon];
          const groupStyle = groupToneStyles[skillGroup.tone];

          return (
            <motion.article
              key={skillGroup.id}
              variants={fadeUp}
              whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={cn(
                "group/card flex h-full min-h-[360px] flex-col overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/35 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:shadow-2xl hover:shadow-slate-300/45 xl:min-h-[440px] dark:border-white/10 dark:bg-[#0b0d0e]/90 dark:shadow-black/35 dark:hover:shadow-black/55",
                groupStyle.card,
              )}
            >
              <div
                className={cn(
                  "relative flex h-[142px] shrink-0 items-center overflow-hidden border-b border-slate-200/80 bg-gradient-to-br px-7 py-6 transition-[filter] duration-300 group-hover/card:brightness-105 xl:h-[168px] 2xl:h-[142px] dark:border-white/10",
                  groupStyle.header,
                )}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute -right-8 -top-10 h-32 w-32 rounded-full blur-3xl transition-transform duration-500 group-hover/card:scale-125",
                    groupStyle.glow,
                  )}
                />
                <div className="relative flex items-center gap-4">
                  <motion.div
                    aria-hidden="true"
                    whileHover={reduceMotion ? undefined : { rotate: -5, scale: 1.06 }}
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-sm",
                      groupStyle.icon,
                    )}
                  >
                    <GroupIcon className="h-7 w-7" />
                  </motion.div>
                  <h3 className="text-[1.45rem] font-bold leading-tight tracking-tight text-slate-950 dark:text-slate-50">
                    {lang(skillGroup.category)}
                  </h3>
                </div>
              </div>

              <motion.div
                className="flex flex-1 flex-wrap content-start gap-x-4 gap-y-4 p-7"
                variants={staggerContainer(0.035, 0.12)}
              >
                {skillGroup.items.map((item) => {
                  const ItemIcon = skillIconMap[item.icon];
                  const itemStyle = skillToneStyles[item.tone];

                  return (
                    <motion.span
                      key={item.id}
                      variants={skillChipVariants}
                      whileHover={reduceMotion ? undefined : { y: -2 }}
                      transition={{ type: "spring", stiffness: 340, damping: 24 }}
                      className={cn(
                        "group/skill inline-flex h-12 items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-100/85 px-4 text-sm font-semibold text-slate-700 shadow-sm transition-[border-color,background-color,box-shadow] duration-200 hover:shadow-md sm:text-base dark:border-white/8 dark:bg-white/[0.055] dark:text-slate-200",
                        itemStyle.chip,
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-200 group-hover/skill:scale-110",
                          itemStyle.icon,
                        )}
                      >
                        <ItemIcon className="h-5 w-5" />
                      </span>
                      <span className="whitespace-nowrap">{item.label}</span>
                    </motion.span>
                  );
                })}
              </motion.div>
            </motion.article>
          );
        })}
      </motion.div>
    </Section>
  );
}
