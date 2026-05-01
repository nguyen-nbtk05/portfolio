"use client";

import { motion, useReducedMotion } from "motion/react";
import { Section } from "../ui/section";
import { experiences } from "@/data/experience";
import { useLanguage } from "@/providers/language-provider";
import { scaleIn, slideInLeft, staggerContainer, timelineDraw, viewportOnce } from "@/lib/motion";

export function ExperienceSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <Section
      id="experience"
      title={lang({ en: "Experience", vi: "Kinh Nghiệm" })}
      className="bg-slate-100 dark:bg-slate-900/50"
    >
      <div className="mx-auto mt-8 max-w-3xl">
        <div className="relative ml-3 md:ml-6">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-slate-300 dark:bg-slate-700" />
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-px bg-yellow-500"
            initial={initial}
            whileInView="visible"
            viewport={viewportOnce}
            variants={timelineDraw}
          />
          <motion.div
            initial={initial}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.14, 0.15)}
          >
            {experiences.map((exp) => (
              <motion.article
                key={exp.id}
                variants={slideInLeft}
                className="relative mb-12 ml-8 md:ml-12"
              >
                <motion.div
                  aria-hidden="true"
                  variants={scaleIn}
                  className="absolute top-1.5 -left-[39px] h-4 w-4 rounded-full border-4 border-slate-100 bg-yellow-500 shadow-[0_0_0_6px_rgba(234,179,8,0.12)] md:-left-[55px] dark:border-slate-950"
                />
                <div className="mb-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-xl font-bold">{lang(exp.role)}</h3>
                  <span className="mt-1 font-mono text-sm text-yellow-600 sm:mt-0 dark:text-yellow-400">
                    {exp.period}
                  </span>
                </div>
                <h4 className="mb-4 text-lg text-slate-600 dark:text-slate-400">
                  {exp.company}
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  {lang(exp.description)}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
