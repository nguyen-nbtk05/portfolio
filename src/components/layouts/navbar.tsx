"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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
  {
    href: "/",
    label: { en: "Home", vi: "Trang chủ" },
    tooltip: { en: "Homepage", vi: "Về trang chủ" },
  },
  {
    href: "#about",
    label: { en: "About", vi: "Giới thiệu" },
    tooltip: { en: "About me", vi: "Về tôi" },
  },
  {
    href: "#experience",
    label: { en: "Experience", vi: "Kinh nghiệm" },
    tooltip: { en: "Work Experience", vi: "Kinh nghiệm làm việc" },
  },
  {
    href: "#skills",
    label: { en: "Skills", vi: "Kỹ năng" },
    tooltip: { en: "My Tech Stack", vi: "Kỹ năng chuyên môn" },
  },
  {
    href: "#projects",
    label: { en: "Projects", vi: "Dự án" },
    tooltip: { en: "Recent Works", vi: "Dự án tiêu biểu" },
  },
  {
    href: "#contact",
    label: { en: "Contact", vi: "Liên hệ" },
    tooltip: { en: "Get in touch", vi: "Kết nối với tôi" },
  },
];

const DockTooltip = ({
  children,
  label,
  isDropdownOpen = false,
}: {
  children: React.ReactNode;
  label: React.ReactNode;
  isDropdownOpen?: boolean;
}) => {
  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div
        className={`pointer-events-none absolute top-[calc(100%+14px)] z-50 
          transition-all duration-200 ease-out 
          scale-90 opacity-0
          group-hover:scale-100 group-hover:opacity-100
          ${isDropdownOpen ? "!scale-90 !opacity-0 !invisible" : ""} 
        `}
      >
        <div className="relative rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-bold tracking-wide text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
          <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-slate-800 dark:bg-slate-100" />
          <span className="relative z-10 whitespace-nowrap">{label}</span>
        </div>
      </div>
    </div>
  );
};

export function Navbar() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
        className="pointer-events-auto flex h-[3.5rem] w-fit items-center rounded-full border border-slate-200/80 bg-white/95 px-6 backdrop-blur-md shadow-md shadow-slate-200/50 dark:border-white/10 dark:bg-black/90 dark:shadow-none"
      >
        <motion.nav
          className="hidden items-center gap-0 text-sm font-medium md:flex"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={staggerContainer(0.05, 0.15)}
        >
          {navItems.map((item) => (
            <motion.div key={item.href} variants={fadeUp}>
              <DockTooltip label={lang(item.tooltip)}>
                <Link
                  href={item.href}
                  className="flex items-center justify-center rounded-full px-2.5 py-1.5 transition-all duration-200 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800"
                >
                  {lang(item.label)}
                </Link>
              </DockTooltip>
            </motion.div>
          ))}
        </motion.nav>

        <div className="flex items-center gap-1">
          <DockTooltip
            label={lang({
              en: "Settings & Preferences",
              vi: "Cài đặt & Tùy chọn",
            })}
            isDropdownOpen={isSettingsOpen}
          >
            <div>
              <SettingsDropdown onOpenChange={setIsSettingsOpen} />
            </div>
          </DockTooltip>

          <DockTooltip
            label={lang({
              en: !mounted
                ? "Theme"
                : resolvedTheme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode",
              vi: !mounted
                ? "Giao diện"
                : resolvedTheme === "dark"
                  ? "Chuyển sang nền sáng"
                  : "Chuyển sang nền tối",
            })}
          >
            <div>
              <AnimatedThemeToggler variant="circle" duration={800} />
            </div>
          </DockTooltip>
        </div>
      </motion.header>
    </div>
  );
}
