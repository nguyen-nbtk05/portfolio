"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { LanguageToggle } from "../ui/language-toggle";
import { useLanguage } from "@/providers/language-provider";
import { siteConfig } from "@/data/config";
import { fadeUp, staggerContainer } from "@/lib/motion";

const navItems = [
  { href: "#about", label: { en: "About", vi: "Giới thiệu" } },
  { href: "#experience", label: { en: "Experience", vi: "Kinh nghiệm" } },
  { href: "#skills", label: { en: "Skills", vi: "Kỹ năng" } },
  { href: "#projects", label: { en: "Projects", vi: "Dự án" } },
  { href: "#contact", label: { en: "Contact", vi: "Liên hệ" } },
];

export function Navbar() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 left-0 z-50 border-b border-slate-200 bg-slate-50/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          {siteConfig.name}<span className="text-yellow-500">.</span>
        </Link>
        <motion.nav
          className="hidden items-center gap-6 text-sm font-medium md:flex"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={staggerContainer(0.05, 0.15)}
        >
          {navItems.map((item) => (
            <motion.div key={item.href} variants={fadeUp}>
              <Link
                href={item.href}
                className="group relative transition-colors hover:text-yellow-500"
              >
                {lang(item.label)}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-yellow-500 transition-all duration-200 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </motion.nav>
        <div className="flex items-center gap-5">
          <LanguageToggle />
          <AnimatedThemeToggler variant="circle" duration={800} />
        </div>
      </div>
    </motion.header>
  );
}
