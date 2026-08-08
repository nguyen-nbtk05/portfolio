"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import { ProjectStage, ProjectCTA } from "./project-stage";
import { ProjectVisual } from "./project-visual";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

export function ProjectExplorer() {
  const { lang } = useLanguage();
  const [activeId, setActiveId] = useState<number>(1);
  const [mobileActiveId, setMobileActiveId] = useState<number>(1);

  const activeProject = projects.find((p) => p.id === activeId) ?? projects[0];
  const mobileActiveProject = projects.find((p) => p.id === mobileActiveId) ?? projects[0];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % projects.length;
      setActiveId(projects[nextIndex].id);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + projects.length) % projects.length;
      setActiveId(projects[prevIndex].id);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveId(projects[index].id);
    }
  };

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (md and up)                                                */}
      {/* ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-6 lg:gap-8 items-stretch lg:pr-6 xl:pr-4">
        {/* Left Navigation Selector (~38%) */}
        <div
          role="tablist"
          aria-label={lang({ en: "Project list", vi: "Danh sách dự án" })}
          className="col-span-5 flex flex-col justify-between py-1"
        >
          {projects.map((project, idx) => {
            const isActive = activeId === project.id;
            return (
              <button
                key={project.id}
                role="tab"
                id={`project-tab-${project.id}`}
                aria-selected={isActive}
                aria-controls={`project-panel-${project.id}`}
                tabIndex={0}
                onMouseEnter={() => setActiveId(project.id)}
                onFocus={() => setActiveId(project.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={cn(
                  "group relative text-left py-3.5 px-4 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
                  isActive
                    ? "border-slate-300/60 bg-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] opacity-100"
                    : "border-transparent bg-transparent opacity-65 hover:opacity-100 hover:bg-slate-100/50 dark:hover:bg-slate-900/30",
                )}
              >
                {/* Top Category / Index */}
                <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
                  <span
                    className={cn(
                      "transition-colors duration-200",
                      isActive
                        ? "text-teal-600 font-bold dark:text-teal-400 opacity-100"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400",
                    )}
                  >
                    0{project.id}
                  </span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-teal-500 inline-block"
                    />
                  )}
                  <span
                    className={cn(
                      "uppercase tracking-wider text-[10px] transition-colors duration-200",
                      isActive
                        ? "text-teal-700/80 dark:text-teal-300/80 font-medium"
                        : "text-slate-400 dark:text-slate-500",
                    )}
                  >
                    / {lang(project.category)}
                  </span>
                </div>

                {/* Project Title */}
                <h3
                  className={cn(
                    "text-lg lg:text-xl font-bold transition-all duration-200 leading-snug",
                    isActive
                      ? "text-slate-950 dark:text-slate-50 translate-x-1.5 opacity-100"
                      : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 group-hover:translate-x-1.5",
                  )}
                >
                  {lang(project.title)}
                </h3>

                {/* Bottom Active Line Indicator */}
                <div className="mt-3 h-0.5 w-full bg-slate-200/60 dark:bg-slate-800/80 overflow-hidden rounded-full">
                  <div
                    className={cn(
                      "h-full bg-teal-500 transition-all duration-200 ease-out origin-left",
                      isActive ? "w-full scale-x-100 opacity-100" : "w-0 scale-x-0 opacity-0",
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Stage Showcase (~62%) */}
        <div className="col-span-7">
          <ProjectStage project={activeProject} />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET LAYOUT (under md breakpoint)                             */}
      {/* ========================================================================= */}
      <div className="block md:hidden space-y-4">
        {/* Top Tab Selector */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {projects.map((project) => {
            const isActive = mobileActiveId === project.id;
            return (
              <button
                key={project.id}
                onClick={() => setMobileActiveId(project.id)}
                className={cn(
                  "flex-1 py-2.5 px-3 rounded-lg font-mono text-xs font-bold transition-all text-center cursor-pointer min-h-[44px]",
                  isActive
                    ? "bg-teal-500 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400",
                )}
              >
                0{project.id}
              </button>
            );
          })}
        </div>

        {/* Mobile Stage Panel */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/60 p-5 space-y-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase text-teal-600 dark:text-teal-400 font-bold mb-1">
              <span>0{mobileActiveProject.id} / {lang(mobileActiveProject.category)}</span>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                {lang(mobileActiveProject.status)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-slate-50">
              {lang(mobileActiveProject.title)}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {lang(mobileActiveProject.description)}
            </p>
          </div>

          {/* Visual Presentation */}
          <div className="min-h-[140px] w-full flex items-center justify-center py-2">
            <ProjectVisual presentation={mobileActiveProject.presentation} />
          </div>

          {/* Tech Stack & Impact */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  {lang({ en: "IMPACT", vi: "TÁC ĐỘNG" })}
                </div>
                <div className="text-base font-bold font-mono text-teal-600 dark:text-teal-400">
                  {mobileActiveProject.metric.value}
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {lang(mobileActiveProject.metric.label)}
                </div>
              </div>

              {/* Mobile CTA */}
              <ProjectCTA links={mobileActiveProject.links} />
            </div>

            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {mobileActiveProject.techStack.join("  /  ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
