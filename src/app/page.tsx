import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { BlogSection } from "@/components/sections/blog";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="relative z-20 min-h-screen border-t border-slate-200/50 bg-slate-100 dark:border-slate-800/50 dark:bg-slate-950">
        <AboutSection />
      </div>

      <SkillsSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
