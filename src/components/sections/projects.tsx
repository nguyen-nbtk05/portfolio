"use client";

import { motion, useReducedMotion } from "motion/react";
import { ExternalLink, ServerCog } from "lucide-react";
import { Section } from "../ui/section";
import { projects } from "@/data/projects";
import { Github } from "@/components/ui/icons";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function ProjectsSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <Section
      id="projects"
      title={lang({ en: "Projects & Labs", vi: "Dự Án & Thực Hành" })}
      subtitle={lang({
        en: "Highlighting some of my architectural designs and automation scripts.",
        vi: "Những điểm nổi bật trong thiết kế kiến trúc mạng và phần mềm tự động hóa của tôi.",
      })}
    >
      <motion.div
        className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={initial}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.1)}
      >
        {projects.map((project) => (
          <motion.article
            key={project.id}
            variants={fadeUp}
            whileHover={reduceMotion ? undefined : { y: -6 }}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-950 dark:hover:shadow-black/20"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors group-hover:bg-teal-100 group-hover:text-teal-600 dark:bg-slate-900 dark:text-slate-300 dark:group-hover:bg-teal-900/30 dark:group-hover:text-teal-400">
                <ServerCog className="h-5 w-5 transition-transform group-hover:scale-110" />
              </div>
              {project.link !== "#" && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-teal-500"
                >
                  {project.link.includes("github.com") ? (
                    <Github className="h-5 w-5" />
                  ) : (
                    <ExternalLink className="h-5 w-5" />
                  )}
                </a>
              )}
            </div>

            <h3 className="mb-2 text-xl font-bold">{lang(project.title)}</h3>
            <p className="mb-6 flex-grow text-slate-600 dark:text-slate-400">
              {lang(project.description)}
            </p>

            <motion.div className="mt-auto flex flex-wrap gap-2" variants={staggerContainer(0.035)}>
              {project.techStack.map((tech) => (
                <motion.span
                  key={tech}
                  variants={fadeUp}
                  className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
