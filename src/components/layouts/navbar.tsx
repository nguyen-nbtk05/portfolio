"use client";

import Link from "next/link";
import { useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { SettingsDropdown } from "../ui/settings-dropdown";

const navItems = [
  { href: "/", label: { en: "Home", vi: "Trang chủ" } },
  { href: "#about", label: { en: "About", vi: "Giới thiệu" } },
  { href: "#experience", label: { en: "Experience", vi: "Kinh nghiệm" } },
  { href: "#skills", label: { en: "Skills", vi: "Kỹ năng" } },
  { href: "#projects", label: { en: "Projects", vi: "Dự án" } },
  { href: "#contact", label: { en: "Contact", vi: "Liên hệ" } },
];

export function Navbar() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-6 pointer-events-none">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -20 }}
        animate={{
          opacity: hidden ? 0 : 1,
          y: hidden ? "-150%" : 0,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex h-[3.5rem] w-max items-center rounded-full border border-slate-200/80 bg-white/95 px-6 backdrop-blur-md shadow-md shadow-slate-200/50 dark:border-white/10 dark:bg-black/90 dark:shadow-none"
      >
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

        <div className="hidden md:block w-px h-5 bg-slate-300 dark:bg-slate-700 mx-6" />

        <div className="flex items-center gap-5">
          <SettingsDropdown />
          <AnimatedThemeToggler variant="circle" duration={800} />
        </div>
      </motion.header>
    </div>
  );
}
