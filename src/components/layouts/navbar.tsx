"use client";

import Link from "next/link";
import { ThemeToggle } from "../ui/theme-toggle";
import { LanguageToggle } from "../ui/language-toggle";
import { useLanguage } from "@/providers/language-provider";
import { siteConfig } from "@/data/config";

export function Navbar() {
  const { lang } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          {siteConfig.name}<span className="text-emerald-500">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#about" className="hover:text-emerald-500 transition-colors">{lang({ en: "About", vi: "Giới thiệu" })}</Link>
          <Link href="#experience" className="hover:text-emerald-500 transition-colors">{lang({ en: "Experience", vi: "Kinh nghiệm" })}</Link>
          <Link href="#skills" className="hover:text-emerald-500 transition-colors">{lang({ en: "Skills", vi: "Kỹ năng" })}</Link>
          <Link href="#projects" className="hover:text-emerald-500 transition-colors">{lang({ en: "Projects", vi: "Dự án" })}</Link>
          <Link href="#contact" className="hover:text-emerald-500 transition-colors">{lang({ en: "Contact", vi: "Liên hệ" })}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
