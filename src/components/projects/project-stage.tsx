"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectVisual } from "./project-visual";
import { Github } from "@/components/ui/icons";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

interface ProjectStageProps {
  project: Project;
}

export function ProjectStage({ project }: ProjectStageProps) {
  const { lang } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative h-[390px] lg:h-[410px] w-full rounded-2xl border border-slate-200/90 bg-slate-50/80 dark:border-slate-800/90 dark:bg-slate-950/50 backdrop-blur-xs p-5 lg:p-6 flex flex-col justify-between overflow-hidden shadow-xs">
      {/* Subtly textured background dot-grid (3-6% opacity) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`stage-project-${project.id}`}
          role="tabpanel"
          id={`project-panel-${project.id}`}
          aria-labelledby={`project-tab-${project.id}`}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="relative z-10 h-full flex flex-col justify-between"
        >
          {/* STAGE HEADER */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-teal-600 font-bold dark:text-teal-400 tracking-wider">
                0{project.id} / {lang(project.category).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-teal-500 inline-block animate-pulse" />
              <span className="uppercase tracking-wider font-semibold">
                {lang(project.status)}
              </span>
            </div>
          </div>

          {/* PROJECT INTRO (Primary Level 1 Hierarchy) */}
          <div className="my-2">
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 mb-1.5">
              {lang(project.title)}
            </h3>
            <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 max-w-none leading-relaxed">
              {lang(project.description)}
            </p>
          </div>

          {/* STAGE BODY (2 Columns on Desktop) */}
          <div className="my-2 flex-1 grid grid-cols-12 gap-4 items-center">
            {/* Left: Visual Stage (~60%) */}
            <div className="col-span-7 h-full flex items-center justify-center min-h-[140px]">
              <ProjectVisual presentation={project.presentation} />
            </div>

            {/* Right: Project Facts (~40%) */}
            <div className="col-span-5 flex flex-col justify-center gap-3 pl-2 border-l border-slate-200/60 dark:border-slate-800/60 h-full">
              {/* Impact Metric */}
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-0.5">
                  {lang({ en: "IMPACT", vi: "TÁC ĐỘNG" })}
                </div>
                <div className="text-lg lg:text-xl font-bold font-mono text-teal-600 dark:text-teal-400">
                  {project.metric.value}
                </div>
                <div className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  {lang(project.metric.label)}
                </div>
              </div>

              {/* Focus / Category */}
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-0.5">
                  {lang({ en: "FOCUS", vi: "TRỌNG TÂM" })}
                </div>
                <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {lang(project.category)}
                </div>
              </div>
            </div>
          </div>

          {/* STAGE FOOTER */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            {/* Tech Stack */}
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              {project.techStack.slice(0, 4).join("  /  ")}
              {project.techStack.length > 4 && (
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>

            {/* Prominent CTA Button */}
            <ProjectCTA links={project.links} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function ProjectCTA({ links }: { links: Project["links"] }) {
  const { lang } = useLanguage();

  const primaryUrl = links.demo || links.source || links.caseStudy;
  const isGithub = primaryUrl?.includes("github.com");

  if (!primaryUrl || primaryUrl === "#") {
    return (
      <span className="inline-flex items-center font-mono text-xs tracking-wider uppercase text-slate-400 dark:text-slate-500 bg-slate-200/40 dark:bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
        {lang({ en: "CASE STUDY COMING SOON", vi: "SẮP CÓ CASE STUDY" })}
      </span>
    );
  }

  return (
    <a
      href={primaryUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-lg font-sans text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs group",
        "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100",
        "hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/40 dark:hover:border-teal-400 dark:hover:text-teal-400 dark:hover:bg-teal-950/20",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
      )}
    >
      {isGithub ? (
        <>
          <Github className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
          <span>{lang({ en: "View source", vi: "Xem mã nguồn" })}</span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </>
      ) : links.demo ? (
        <>
          <span>{lang({ en: "Live demo", vi: "Xem demo" })}</span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </>
      ) : (
        <>
          <span>{lang({ en: "View source", vi: "Xem mã nguồn" })}</span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </>
      )}
    </a>
  );
}
