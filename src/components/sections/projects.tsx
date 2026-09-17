"use client";

import { Section } from "../ui/section";
import { ProjectExplorer } from "../projects/project-explorer";
import { useLanguage } from "@/hooks/use-language";

export function ProjectsSection() {
  const { lang } = useLanguage();

  return (
    <Section
      id="projects"
      title={lang({ en: "Recent Projects", vi: "Dự Án Gần Đây" })}
      subtitle={lang({
        en: "A showcase of notable projects that I have worked on recently, including personal projects and collaborations.",
        vi: "Các dự án tiêu biểu mà tôi đã thực hiện trong thời gian gần đây, bao gồm các dự án cá nhân và hợp tác.",
      })}
      headerClassName="mb-6 lg:mb-8"
      subtitleClassName="max-w-4xl lg:max-w-5xl"
      className="min-h-0 pb-12 pt-[calc(5rem+env(safe-area-inset-top))] sm:pb-16 sm:pt-[calc(5rem+env(safe-area-inset-top))] lg:min-h-[100vh] lg:py-8"
    >
      <ProjectExplorer />
    </Section>
  );
}
