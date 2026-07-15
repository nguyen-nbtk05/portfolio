import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { BlogSection } from "@/components/sections/blog";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      {/* Sticky Reveal Container for Hero & About */}
      <div className="relative">
        <div className="sticky top-0 z-10 h-screen overflow-hidden">
          <HeroSection />
        </div>
        <div className="relative z-20 min-h-screen bg-slate-100 dark:bg-slate-950 shadow-[0_-25px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_-25px_60px_rgba(0,0,0,0.8)] border-t border-slate-200/50 dark:border-slate-800/50">
          <AboutSection />
        </div>
      </div>

      <SkillsSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
