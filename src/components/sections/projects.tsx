"use client";

import { Section } from "../ui/section";
import { projects } from "@/data/projects";
import { ExternalLink } from "lucide-react";
import { Github } from "@/components/ui/icons";
import { useLanguage } from "@/providers/language-provider";

export function ProjectsSection() {
  const { lang } = useLanguage();

  return (
    <Section 
      id="projects" 
      title={lang({ en: "Projects & Labs", vi: "Dự Án & Thực Hành" })} 
      subtitle={lang({
        en: "Highlighting some of my architectural designs and automation scripts.",
        vi: "Những điểm nổi bật trong thiết kế kiến trúc mạng và phần mềm tự động hóa của tôi."
      })}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="flex flex-col p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              {project.link !== "#" && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 transition-colors">
                  {project.link.includes('github.com') ? <Github className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                </a>
              )}
            </div>
            
            <h3 className="text-xl font-bold mb-2">{lang(project.title)}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
              {lang(project.description)}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.techStack.map((tech, i) => (
                <span 
                  key={i}
                  className="px-2.5 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
