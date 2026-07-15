"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bolt, ChevronRight, Languages, Type } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const ActiveBadge = () => (
  <span className="ml-auto rounded-md bg-blue-100/80 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
    Active
  </span>
);

export function SettingsDropdown({ onOpenChange }: { onOpenChange?: (isOpen: boolean) => void }) {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [currentFont, setCurrentFont] = useState("sans");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveSubMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFontChange = (font: string) => {
    setCurrentFont(font);
    document.body.classList.remove(
      "theme-font-sans",
      "theme-font-serif",
      "theme-font-mono",
    );
    document.body.classList.add(`theme-font-${font}`);
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setActiveSubMenu(null);
        }}
        className={`p-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${
          isOpen
            ? "bg-slate-200 text-teal-500 dark:bg-slate-800"
            : "hover:bg-slate-200 hover:text-teal-500 dark:hover:bg-slate-800"
        }`}
        aria-label="Settings"
      >
        <Bolt size={24} className={isOpen ? "animate-spin-slow" : ""} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.95,
              transition: { duration: 0.15 },
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseLeave={() => setActiveSubMenu(null)}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-48 rounded-xl border border-slate-200/80 bg-white/95 p-1.5 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-slate-900/95 dark:shadow-none"
          >
            {/* --- NGÔN NGỮ --- */}
            <div
              className="relative"
              onMouseEnter={() => setActiveSubMenu("language")}
            >
              <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="flex items-center gap-2">
                  <Languages size={16} className="text-slate-500" />
                  <span>Language</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {activeSubMenu === "language" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-full top-0 ml-2 w-52 rounded-xl border border-slate-200/80 bg-white/95 p-1.5 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-slate-900/95 dark:shadow-none before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-3"
                  >
                    <button
                      onClick={() => setLanguage("vi")}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          viewBox="0 0 55.2 38.4"
                          className="w-4 h-3 rounded-[2px] shadow-sm shrink-0"
                        >
                          <path
                            fill="#DA251D"
                            d="M3.01,0h49.17c1.66,0.01,3.01,1.37,3.01,3.03v32.33c0,1.66-1.35,3.02-3.01,3.03H3.01 C1.35,38.39,0,37.03,0,35.37V3.03C0,1.37,1.35,0.01,3.01,0L3.01,0z"
                          />
                          <g fill="#FFFF00">
                            <path d="M27.6,11.52l-2.37,7.3l4.87,1.58L27.6,11.52L27.6,11.52z" />
                            <path d="M27.6,11.52l2.37,7.3l-4.87,1.58L27.6,11.52L27.6,11.52z" />
                            <path d="M34.9,16.83h-7.68v5.12L34.9,16.83L34.9,16.83z" />
                            <path d="M34.9,16.83l-6.21,4.51l-3.01-4.14L34.9,16.83L34.9,16.83z" />
                            <path d="M32.11,25.41l-2.37-7.3l-4.87,1.58L32.11,25.41L32.11,25.41z" />
                            <path d="M32.11,25.41L25.9,20.9l3.01-4.14L32.11,25.41L32.11,25.41z" />
                            <path d="M20.3,16.83h7.68v5.12L20.3,16.83L20.3,16.83z" />
                            <path d="M20.3,16.83l6.21,4.51l3.01-4.14L20.3,16.83L20.3,16.83z" />
                            <path d="M23.09,25.41l2.37-7.3l4.87,1.58L23.09,25.41L23.09,25.41z" />
                            <path d="M23.09,25.41l6.21-4.51l-3.01-4.14L23.09,25.41L23.09,25.41z" />
                          </g>
                        </svg>
                        <span>Tiếng Việt</span>
                      </div>
                      {language === "vi" && <ActiveBadge />}
                    </button>
                    <button
                      onClick={() => setLanguage("en")}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 mt-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          viewBox="0 0 640 480"
                          className="w-4 h-3 rounded-[2px] shadow-sm overflow-hidden"
                        >
                          <path fill="#012169" d="M0 0h640v480H0z" />
                          <path
                            fill="#FFF"
                            d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
                          />
                          <path
                            fill="#C8102E"
                            d="m424 281 216 159v40L369 281h55zm-184 20 6 35L22 480H0v-50l240-129zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
                          />
                          <path
                            fill="#FFF"
                            d="M241 0v480h160V0H241zM0 160v160h640V160H0z"
                          />
                          <path
                            fill="#C8102E"
                            d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"
                          />
                        </svg>
                        <span>English</span>
                      </div>
                      {language === "en" && <ActiveBadge />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="my-1 mx-2 border-t border-slate-100 dark:border-slate-800" />

            {/* --- FONT CHỮ --- */}
            <div
              className="relative"
              onMouseEnter={() => setActiveSubMenu("font")}
            >
              <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="flex items-center gap-2">
                  <Type size={16} className="text-slate-500" />
                  <span>Typography</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {activeSubMenu === "font" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-full top-0 ml-2 w-52 rounded-xl border border-slate-200/80 bg-white/95 p-1.5 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-slate-900/95 dark:shadow-none before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-3"
                  >
                    <button
                      onClick={() => handleFontChange("sans")}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm theme-font-sans transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      System Font
                      {currentFont === "sans" && <ActiveBadge />}
                    </button>
                    <button
                      onClick={() => handleFontChange("serif")}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm theme-font-serif transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 mt-0.5"
                    >
                      Playfair Serif
                      {currentFont === "serif" && <ActiveBadge />}
                    </button>
                    <button
                      onClick={() => handleFontChange("mono")}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm theme-font-mono transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 mt-0.5"
                    >
                      Cascadia Code
                      {currentFont === "mono" && <ActiveBadge />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
