"use client";

import {
  type ElementType,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  Network,
  PanelsTopLeft,
  RadioTower,
  Route,
  Sparkles,
  Waypoints,
  Workflow,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  type LocalizedSkillText,
  type SkillGroupTone,
  type SkillIconKey,
  type SkillItem,
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

type ActiveSkill = {
  item: SkillItem;
  category: LocalizedSkillText;
};

interface SkillDetailDialogProps {
  activeSkill: ActiveSkill | null;
  isOpen: boolean;
  onClose: () => void;
  onExitComplete: () => void;
}

function SkillDetailDialog({
  activeSkill,
  isOpen,
  onClose,
  onExitComplete,
}: SkillDetailDialogProps) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activeSkill) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const overlay = overlayRef.current;
    const backgroundElements = Array.from(document.body.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        element !== overlay &&
        element.tagName !== "SCRIPT" &&
        element.tagName !== "STYLE",
    );
    const backgroundState = backgroundElements.map((element) => ({
      element,
      inert: element.hasAttribute("inert"),
      ariaHidden: element.getAttribute("aria-hidden"),
    }));

    backgroundElements.forEach((element) => {
      element.setAttribute("inert", "");
      element.setAttribute("aria-hidden", "true");
    });

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = panelRef.current;
      if (!panel) {
        return;
      }

      const focusableElements = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const focusedElement = document.activeElement;

      if (event.shiftKey && focusedElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && focusedElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (!panel.contains(focusedElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      backgroundState.forEach(({ element, inert, ariaHidden }) => {
        if (!inert) {
          element.removeAttribute("inert");
        }

        if (ariaHidden === null) {
          element.removeAttribute("aria-hidden");
        } else {
          element.setAttribute("aria-hidden", ariaHidden);
        }
      });
    };
  }, [activeSkill, onClose]);

  const ActiveIcon = activeSkill ? skillIconMap[activeSkill.item.icon] : null;
  const activeTone = activeSkill
    ? skillToneStyles[activeSkill.item.tone]
    : null;

  if (
    !activeSkill ||
    !ActiveIcon ||
    !activeTone ||
    typeof document === "undefined"
  ) {
    return null;
  }

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen ? (
        <motion.div
          key="skill-dialog-overlay"
          ref={overlayRef}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-[1000] flex items-end justify-center overflow-hidden bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          id="skill-detail-dialog"
          aria-labelledby="skill-detail-title"
          aria-describedby="skill-detail-overview skill-detail-description"
          initial={
            reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }
          }
          transition={{
            duration: reduceMotion ? 0 : 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative max-h-[calc(100dvh-1rem)] w-full max-w-[960px] overflow-x-hidden overflow-y-auto overscroll-contain rounded-t-[1.6rem] border border-slate-200/90 bg-white/95 text-left text-slate-900 shadow-2xl shadow-slate-950/25 backdrop-blur-xl outline-none sm:max-h-[calc(100dvh-2rem)] sm:rounded-[1.6rem] dark:border-white/10 dark:bg-[#0b0d0e]/95 dark:text-slate-100 dark:shadow-black/60"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-400/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-10 h-52 w-52 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-400/10"
          />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={lang({ en: "Close skill details", vi: "Đóng chi tiết kỹ năng" })}
            data-cursor="pointer"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/85 text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 sm:right-5 sm:top-5 dark:border-white/10 dark:bg-slate-900/85 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <header className="relative border-b border-slate-200/80 px-5 pb-6 pt-6 pr-20 sm:px-8 sm:pb-7 sm:pt-8 sm:pr-24 dark:border-white/10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200/90 bg-slate-100/85 shadow-lg shadow-slate-200/45 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/35">
                <ActiveIcon
                  className={cn("h-8 w-8 sm:h-9 sm:w-9", activeTone.icon)}
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <h3
                  id="skill-detail-title"
                  className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-slate-50"
                >
                  {activeSkill.item.label}
                </h3>
                <span className="mt-2 inline-flex max-w-full rounded-full bg-teal-500/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-teal-700 sm:text-xs dark:bg-teal-400/10 dark:text-teal-300">
                  {lang(activeSkill.category)}
                </span>
              </div>
            </div>
          </header>

          <div className="relative grid md:grid-cols-2">
            <section className="px-5 py-6 sm:px-8 sm:py-8 md:min-h-[250px] md:pr-9">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                <BookOpen className="h-4 w-4 text-teal-500" aria-hidden="true" />
                <span>
                  {lang({ en: "About the technology", vi: "Về công nghệ" })}
                </span>
              </div>
              <p
                id="skill-detail-overview"
                className="text-[0.98rem] leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300"
              >
                {lang(activeSkill.item.overview)}
              </p>
            </section>

            <section className="border-t border-slate-200/80 px-5 py-6 sm:px-8 sm:py-8 md:min-h-[250px] md:border-l md:border-t-0 md:pl-9 dark:border-white/10">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                <Sparkles className="h-4 w-4 text-teal-500" aria-hidden="true" />
                <span>
                  {lang({ en: "Usage & Experience", vi: "Ứng dụng & kinh nghiệm" })}
                </span>
              </div>
              <p
                id="skill-detail-description"
                className="text-[0.98rem] leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300"
              >
                {lang(activeSkill.item.description)}
              </p>
            </section>
          </div>
        </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export function SkillsSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";
  const [activeSkill, setActiveSkill] = useState<ActiveSkill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleDialogExitComplete = useCallback(() => {
    setActiveSkill(null);

    window.requestAnimationFrame(() => {
      lastTriggerRef.current?.focus();
    });
  }, []);

  return (
    <Section
      id="skills"
      data-cursor="default"
      title={lang({ en: "Technical Skills", vi: "Kỹ năng chuyên môn" })}
      subtitle={lang({
        en: "Core technologies and tools for programming, Linux administration, version control, and network engineering.",
        vi: "Những công nghệ và công cụ cốt lõi cho lập trình, quản trị Linux, quản lý phiên bản và kỹ thuật mạng.",
      })}
      className="pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pb-12 lg:pt-20"
      headerClassName="mb-8 md:mb-10 xl:px-4 2xl:px-6"
      subtitleClassName="xl:max-w-none xl:whitespace-nowrap"
    >
      <motion.div
        className="grid items-stretch gap-6 lg:mt-5 md:grid-cols-2 xl:grid-cols-4 xl:px-4 2xl:gap-8 2xl:px-6"
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
                "group/card flex h-full min-h-0 flex-col overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/35 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:shadow-2xl hover:shadow-slate-300/45 lg:min-h-[360px] xl:min-h-[440px] dark:border-white/10 dark:bg-[#0b0d0e]/90 dark:shadow-black/35 dark:hover:shadow-black/55",
                groupStyle.card,
              )}
            >
              <div
                className={cn(
                  "relative flex h-[116px] shrink-0 items-center overflow-hidden border-b border-slate-200/80 bg-gradient-to-br px-5 py-5 transition-[filter] duration-300 group-hover/card:brightness-105 sm:h-[128px] sm:px-6 lg:h-[142px] lg:px-7 lg:py-6 xl:h-[168px] 2xl:h-[142px] dark:border-white/10",
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
                className="flex flex-1 flex-wrap content-start gap-x-3 gap-y-3 p-5 sm:p-6 lg:gap-x-4 lg:gap-y-4 lg:p-7"
                variants={staggerContainer(0.035, 0.12)}
              >
                {skillGroup.items.map((item) => {
                  const ItemIcon = skillIconMap[item.icon];
                  const itemStyle = skillToneStyles[item.tone];

                  return (
                    <motion.button
                      type="button"
                      key={item.id}
                      variants={skillChipVariants}
                      whileHover={reduceMotion ? undefined : { y: -2 }}
                      transition={{ type: "spring", stiffness: 340, damping: 24 }}
                      aria-haspopup="dialog"
                      aria-controls="skill-detail-dialog"
                      aria-expanded={activeSkill?.item.id === item.id}
                      aria-label={lang({
                        en: `View details about ${item.label}`,
                        vi: `Xem chi tiết về ${item.label}`,
                      })}
                      data-cursor="pointer"
                      onClick={(event) => {
                        lastTriggerRef.current = event.currentTarget;
                        setActiveSkill({
                          item,
                          category: skillGroup.category,
                        });
                        setIsDialogOpen(true);
                      }}
                      className={cn(
                        "group/skill inline-flex h-auto min-h-12 max-w-full cursor-pointer appearance-none items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-100/85 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 shadow-sm transition-[border-color,background-color,box-shadow] duration-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 sm:text-base lg:h-12 lg:py-0 dark:border-white/8 dark:bg-white/[0.055] dark:text-slate-200",
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
                      <span className="min-w-0 break-words lg:whitespace-nowrap">
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.article>
          );
        })}
      </motion.div>
      <SkillDetailDialog
        activeSkill={activeSkill}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onExitComplete={handleDialogExitComplete}
      />
    </Section>
  );
}
