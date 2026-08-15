"use client";

import { Section } from "../ui/section";
import { ProjectExplorer } from "../projects/project-explorer";
import { useLanguage } from "@/hooks/use-language";

export function ProjectsSection() {
  const { lang } = useLanguage();

  return (
    <Section
      id="projects"
      title={lang({ en: "Projects & Labs", vi: "Dự Án & Thực Hành" })}
      subtitle={lang({
        en: "Selected work across web development, malware analysis, and software-defined network security.",
        vi: "Các dự án tiêu biểu về phát triển web, phân tích mã độc và bảo mật mạng định nghĩa bằng phần mềm.",
      })}
      headerClassName="mb-6 lg:mb-8"
      subtitleClassName="max-w-4xl lg:max-w-5xl"
      className="min-h-0 pb-12 pt-[calc(4rem+env(safe-area-inset-top))] sm:pb-16 sm:pt-[calc(5rem+env(safe-area-inset-top))] lg:min-h-[100vh] lg:py-8"
    >
      <ProjectExplorer />
    </Section>
  );
}
