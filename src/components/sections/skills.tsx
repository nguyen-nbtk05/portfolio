"use client";

import { Section } from "../ui/section";
import { skills } from "@/data/skills";
import { useLanguage } from "@/providers/language-provider";

export function SkillsSection() {
  const { lang } = useLanguage();

  return (
    <Section id="skills" title={lang({ en: "Technical Skills", vi: "Kỹ Năng Chuyên Môn" })}>
      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {skills.map((skillGroup, index) => (
          <div key={index} className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              {lang(skillGroup.category)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
