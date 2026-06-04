"use client";

import { motion, useReducedMotion } from "motion/react";
import { Section } from "../ui/section";
import { skills } from "@/data/skills";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function SkillsSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <Section id="skills" title={lang({ en: "Technical Skills", vi: "Kỹ Năng Chuyên Môn" })}>
      <motion.div
        className="mt-10 grid gap-8 md:grid-cols-2"
        initial={initial}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.09)}
      >
        {skills.map((skillGroup) => (
          <motion.article
            key={skillGroup.category.en}
            variants={fadeUp}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <motion.span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-teal-500"
                animate={reduceMotion ? undefined : { scale: [1, 1.35, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              {lang(skillGroup.category)}
            </h3>
            <motion.div className="flex flex-wrap gap-2" variants={staggerContainer(0.035)}>
              {skillGroup.items.map((item) => (
                <motion.span
                  key={item}
                  variants={fadeUp}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:border-teal-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-700 dark:hover:text-slate-50"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
