"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Braces,
  Clock3,
  FolderKanban,
  House,
  Mail,
  MapPin,
  UserRound,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { useTheme } from "@/providers/theme-provider";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { SettingsDropdown } from "../ui/settings-dropdown";
import { useLenis } from "@/hooks/use-lenis";
import { scrollToSection } from "@/lib/scroll-to-section";
import {
  HOME_SECTION_IDS,
  getHomeSectionIdFromHash,
  pushHomeSectionHash,
  type HomeSectionId,
} from "@/lib/section-navigation";

type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

type NavItem = {
  href: "/" | `#${HomeSectionId}`;
  sectionId: HomeSectionId;
  label: { en: string; vi: string };
  tooltip: { en: string; vi: string };
  icon: NavIcon;
  iconOnly?: boolean;
};

const PORTFOLIO_TIME_ZONE = "Asia/Ho_Chi_Minh";

const navItems: NavItem[] = [
  {
    href: "/",
    sectionId: "hero",
    label: { en: "Home", vi: "Trang chủ" },
    tooltip: { en: "Homepage", vi: "Về trang chủ" },
    icon: House,
    iconOnly: true,
  },
  {
    href: "#about",
    sectionId: "about",
    label: { en: "About", vi: "Giới thiệu" },
    tooltip: { en: "About me", vi: "Về tôi" },
    icon: UserRound,
  },
  {
    href: "#skills",
    sectionId: "skills",
    label: { en: "Skills", vi: "Kỹ năng" },
    tooltip: { en: "My technical skills", vi: "Kỹ năng chuyên môn" },
    icon: Braces,
  },
  {
    href: "#projects",
    sectionId: "projects",
    label: { en: "Projects", vi: "Dự án" },
    tooltip: { en: "Recent works", vi: "Dự án tiêu biểu" },
    icon: FolderKanban,
  },
  {
    href: "#blog",
    sectionId: "blog",
    label: { en: "Blog", vi: "Blog" },
    tooltip: { en: "Articles & notes", vi: "Bài viết & ghi chú" },
    icon: BookOpenText,
  },
  {
    href: "#contact",
    sectionId: "contact",
    label: { en: "Contact", vi: "Liên hệ" },
    tooltip: { en: "Get in touch", vi: "Kết nối với tôi" },
    icon: Mail,
  },
];

function getActiveHomeSection(): HomeSectionId {
  const probeLine = window.innerHeight * 0.62;
  let nextSection: HomeSectionId = "hero";

  for (const sectionId of HOME_SECTION_IDS) {
    const section = document.getElementById(sectionId);
    if (!section) continue;

    const bounds = section.getBoundingClientRect();
    if (bounds.top <= probeLine) nextSection = sectionId;
    if (bounds.top <= probeLine && bounds.bottom > probeLine) break;
  }

  return nextSection;
}

function isSectionAtActiveProbe(sectionId: HomeSectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return false;

  const probeLine = window.innerHeight * 0.62;
  const bounds = section.getBoundingClientRect();
  return bounds.top <= probeLine && bounds.bottom > probeLine;
}

const DockTooltip = ({
  children,
  label,
  isDropdownOpen = false,
}: {
  children: React.ReactNode;
  label: React.ReactNode;
  isDropdownOpen?: boolean;
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const isHidden = isDropdownOpen || isDismissed;

  return (
    <div
      className="group relative flex items-center justify-center"
      onPointerDown={() => setIsDismissed(true)}
      onPointerLeave={() => setIsDismissed(false)}
    >
      {children}
      <div
        className={`pointer-events-none absolute top-[calc(100%+14px)] z-50 hidden
          scale-90 opacity-0 transition-all duration-200 ease-out sm:block
          group-hover:scale-100 group-hover:opacity-100
          ${isHidden ? "!invisible !scale-90 !opacity-0" : ""}`}
      >
        <div className="relative rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-bold tracking-wide text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
          <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-slate-800 dark:bg-slate-100" />
          <span className="relative z-10 whitespace-nowrap">{label}</span>
        </div>
      </div>
    </div>
  );
};

const NavbarSeparator = () => (
  <span
    aria-hidden="true"
    className="mx-0.5 h-6 w-px shrink-0 bg-slate-200 sm:mx-1.5 dark:bg-slate-700/80"
  />
);

function LocationBadge({ location }: { location: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-slate-600 shadow-sm shadow-slate-200/40 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300 dark:shadow-black/20">
      <MapPin className="h-3.5 w-3.5 shrink-0 text-teal-500" aria-hidden="true" />
      <span className="truncate text-[10px] font-semibold tracking-tight sm:text-xs">
        {location}
      </span>
    </div>
  );
}

function ClockBadge({
  date,
  time,
  compact = false,
}: {
  date: string;
  time: string;
  compact?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-slate-600 shadow-sm shadow-slate-200/40 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300 dark:shadow-black/20">
      <Clock3 className="h-3.5 w-3.5 shrink-0 text-teal-500" aria-hidden="true" />
      <time className="text-[10px] font-semibold tabular-nums tracking-tight sm:text-xs">
        <span className={compact ? "hidden sm:inline" : undefined}>{date} · </span>
        {time}
      </time>
    </div>
  );
}

export function Navbar() {
  const { lang, language } = useLanguage();
  const { setTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<HomeSectionId>("hero");
  const [localClock, setLocalClock] = useState({
    date: "--/--/----",
    time: "--:--:--",
  });
  const lenis = useLenis();
  const pathname = usePathname();
  const pendingNavigationRef = useRef<HomeSectionId | null>(null);
  const pendingNavigationTimerRef = useRef(0);

  const prepareSectionNavigation = useCallback((sectionId: HomeSectionId) => {
    pendingNavigationRef.current = sectionId;
    setActiveSection(sectionId);

    if (pendingNavigationTimerRef.current) {
      window.clearTimeout(pendingNavigationTimerRef.current);
    }

    pendingNavigationTimerRef.current = window.setTimeout(() => {
      pendingNavigationRef.current = null;
      pendingNavigationTimerRef.current = 0;
      setActiveSection(getActiveHomeSection());
    }, 1_600);
  }, []);

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: NavItem["href"]) => {
      if (
        pathname !== "/" ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      e.preventDefault();

      if (href === "/") {
        prepareSectionNavigation("hero");
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.2, offset: 0 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        window.history.pushState(null, "", "/");
        return;
      }

      const targetId = getHomeSectionIdFromHash(href);
      if (!targetId) return;

      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      prepareSectionNavigation(targetId);
      scrollToSection(targetEl, lenis);
      pushHomeSectionHash(targetId);
    },
    [lenis, pathname, prepareSectionNavigation],
  );

  useEffect(() => {
    return () => {
      if (pendingNavigationTimerRef.current) {
        window.clearTimeout(pendingNavigationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);

    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let frameId = 0;

    const updateNavbarPosition = () => {
      frameId = 0;
      const nextIsScrolled = window.scrollY > 16;
      setIsScrolled((current) =>
        current === nextIsScrolled ? current : nextIsScrolled,
      );
    };

    const scheduleUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateNavbarPosition);
    };

    updateNavbarPosition();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const locale = language === "vi" ? "vi-VN" : "en-GB";
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: PORTFOLIO_TIME_ZONE,
    });
    const timeFormatter = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: PORTFOLIO_TIME_ZONE,
    });

    const updateClock = () => {
      const now = new Date();
      setLocalClock({
        date: dateFormatter.format(now),
        time: timeFormatter.format(now),
      });
    };

    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, [language]);

  useEffect(() => {
    if (pathname !== "/") return;

    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;
      const pendingSection = pendingNavigationRef.current;

      if (pendingSection) {
        if (isSectionAtActiveProbe(pendingSection)) {
          pendingNavigationRef.current = null;
          if (pendingNavigationTimerRef.current) {
            window.clearTimeout(pendingNavigationTimerRef.current);
            pendingNavigationTimerRef.current = 0;
          }
          setActiveSection(pendingSection);
        }
        return;
      }

      const nextSection = getActiveHomeSection();
      setActiveSection((current) =>
        current === nextSection ? current : nextSection,
      );
    };

    const scheduleUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  const isItemActive = (item: NavItem) => {
    if (pathname === "/") return activeSection === item.sectionId;
    return (
      item.sectionId === "blog" &&
      (pathname === "/blog" || pathname.startsWith("/blog/"))
    );
  };

  const locationLabel = lang({
    en: "Da Lat/Viet Nam",
    vi: "Đà Lạt/Việt Nam",
  });

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = isItemActive(item);
    const label = lang(item.label);

    return (
      <motion.div
        key={item.href}
        variants={fadeUp}
        className={`relative shrink-0 ${isActive ? "z-20" : "z-10"}`}
      >
        <DockTooltip label={lang(item.tooltip)}>
          <Link
            href={item.href === "/" ? "/" : `/${item.href}`}
            scroll={item.href === "/"}
            onClick={(e) => handleAnchorClick(e, item.href)}
            aria-label={item.iconOnly ? label : undefined}
            aria-current={isActive ? "location" : undefined}
            className={`relative isolate flex h-9 items-center justify-center gap-2 rounded-lg px-2 transition-colors duration-150 sm:px-2.5 lg:px-3 ${
              isActive
                ? "text-teal-700 dark:text-teal-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-teal-400"
            }`}
          >
            {isActive ? (
              <motion.span
                initial={reduceMotion ? false : { opacity: 0.65 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.1, ease: "easeOut" }}
                className="absolute inset-0 z-[1] rounded-lg border border-teal-300/70 bg-teal-50 shadow-sm shadow-teal-500/10 dark:border-teal-500/35 dark:bg-teal-500/10"
              />
            ) : null}
            <Icon className="relative z-10 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {item.iconOnly ? (
              <span className="sr-only">{label}</span>
            ) : (
              <span className="relative z-10 hidden whitespace-nowrap text-sm font-semibold lg:inline">
                {label}
              </span>
            )}
          </Link>
        </DockTooltip>
      </motion.div>
    );
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 w-full px-2 sm:top-5 sm:px-4 lg:px-6">
      <motion.div
        animate={{ y: isScrolled ? -12 : 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative mx-auto flex w-full max-w-[1760px] flex-col items-center"
      >
        <div className="absolute left-0 top-2 hidden items-center xl:flex">
          <LocationBadge location={locationLabel} />
        </div>

        <div className="absolute right-0 top-2 hidden items-center xl:flex">
          <ClockBadge date={localClock.date} time={localClock.time} />
        </div>

        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex h-14 max-w-full items-center rounded-2xl border border-slate-200/80 bg-white/90 px-1.5 text-slate-900 shadow-lg shadow-slate-200/50 backdrop-blur-xl sm:px-2 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-slate-950/50"
        >
          <motion.nav
            aria-label={lang({ en: "Section navigation", vi: "Điều hướng nội dung" })}
            className="flex min-w-0 items-center gap-0.5"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={staggerContainer(0.05, 0.12)}
          >
            {renderNavItem(navItems[0])}
            <NavbarSeparator />
            {navItems.slice(1).map(renderNavItem)}
          </motion.nav>

          <NavbarSeparator />

          <div className="flex shrink-0 items-center gap-0.5">
            <DockTooltip
              label={lang({
                en: !mounted
                  ? "Theme"
                  : isDarkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode",
                vi: !mounted
                  ? "Giao diện"
                  : isDarkMode
                    ? "Chuyển sang nền sáng"
                    : "Chuyển sang nền tối",
              })}
            >
              <div>
                <AnimatedThemeToggler
                  variant="circle"
                  duration={800}
                  theme={isDarkMode ? "dark" : "light"}
                  onThemeChange={setTheme}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-teal-600 disabled:opacity-60 [&_svg]:!h-5 [&_svg]:!w-5 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-teal-400"
                />
              </div>
            </DockTooltip>

            <DockTooltip
              label={lang({
                en: "Settings & preferences",
                vi: "Cài đặt & tùy chọn",
              })}
              isDropdownOpen={isSettingsOpen}
            >
              <div className="[&>div>button]:h-9 [&>div>button]:w-9 [&>div>button]:p-0 [&>div>button>svg]:!h-5 [&>div>button>svg]:!w-5">
                <SettingsDropdown onOpenChange={setIsSettingsOpen} />
              </div>
            </DockTooltip>
          </div>
        </motion.header>

        <div className="mt-2 flex w-full items-center justify-between gap-2 px-1 xl:hidden">
          <LocationBadge location={locationLabel} />
          <ClockBadge date={localClock.date} time={localClock.time} compact />
        </div>
      </motion.div>
    </div>
  );
}
