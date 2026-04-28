"use client";

import { Section } from "../ui/section";
import { experiences } from "@/data/experience";
import { useLanguage } from "@/providers/language-provider";

export function ExperienceSection() {
  const { lang } = useLanguage();

  return (
    <Section 
      id="experience" 
      title={lang({ en: "Experience", vi: "Kinh Nghiệm" })} 
      className="bg-slate-100 dark:bg-slate-900/50"
    >
      <div className="max-w-3xl mx-auto mt-8">
        <div className="relative border-l border-slate-300 dark:border-slate-700 ml-3 md:ml-6">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="mb-12 ml-8 md:ml-12 relative">
              <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[39px] md:-left-[55px] top-1.5 border-4 border-slate-100 dark:border-slate-950" />
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                <h3 className="text-xl font-bold">{lang(exp.role)}</h3>
                <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-0">
                  {exp.period}
                </span>
              </div>
              <h4 className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                {exp.company}
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                {lang(exp.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
