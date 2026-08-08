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
        en: "Highlighting architectural designs and automation scripts.",
        vi: "Những điểm nổi bật trong thiết kế kiến trúc mạng và phần mềm tự động hóa của tôi.",
      })}
      headerClassName="mb-6 lg:mb-8"
      subtitleClassName="max-w-4xl lg:max-w-5xl"
      className="py-4 sm:py-6 lg:py-8"
    >
      <ProjectExplorer />
    </Section>
  );
}
