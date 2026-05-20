"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Mail } from "lucide-react"; 
import { siteConfig } from "@/data/config";
import { Github, XIcon, FacebookIcon, TelegramIcon, DiscordIcon } from "@/components/ui/icons";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function SmartIconButton({ 
  href, 
  icon: Icon, 
  label, 
  isExternal = true 
}: { 
  href: string; 
  icon: React.ElementType; 
  label: string; 
  isExternal?: boolean 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      layout
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center rounded-full bg-transparent p-2.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-amber-500 dark:hover:bg-slate-800"
      aria-label={label}
    >
      <motion.div layout className="shrink-0">
        <Icon className="h-5 w-5" />
      </motion.div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.span
            layout
            initial={{ opacity: 0, width: 0, paddingLeft: 0 }}
            animate={{ opacity: 1, width: "auto", paddingLeft: 8 }}
            exit={{ opacity: 0, width: 0, paddingLeft: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden whitespace-nowrap text-sm font-semibold tracking-wide"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

export function Footer() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 dark:border-slate-800 dark:bg-slate-950">
      <motion.div
        className="container mx-auto flex flex-col items-center justify-between gap-4 px-[1cm] md:flex-row"
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={staggerContainer(0.08)}
      >
        <motion.p variants={fadeUp} className="text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} {siteConfig.name}.{" "}
          {lang({ en: "All rights reserved.", vi: "Đã đăng ký bản quyền." })}
        </motion.p>
        
        <motion.div variants={fadeUp} layout className="flex flex-wrap items-center justify-center gap-2">
          
          <SmartIconButton href={`mailto:${siteConfig.email}`} icon={Mail} label="Email" isExternal={false} />
          <SmartIconButton href={siteConfig.github} icon={Github} label="GitHub" />
          <SmartIconButton href={siteConfig.x} icon={XIcon} label="X" />
          <SmartIconButton href={siteConfig.facebook} icon={FacebookIcon} label="Facebook" />
          <SmartIconButton href={siteConfig.telegram} icon={TelegramIcon} label="Telegram" />
          <SmartIconButton href={siteConfig.discord} icon={DiscordIcon} label="Discord" />
          
        </motion.div>
      </motion.div>
    </footer>
  );
}