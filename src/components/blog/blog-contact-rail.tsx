"use client";

import type { ElementType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Mail } from "lucide-react";
import {
  DiscordIcon,
  FacebookIcon,
  Github,
  TelegramIcon,
  XIcon,
} from "@/components/ui/icons";
import { siteConfig } from "@/data/config";

const contactLinks: Array<{
  href: string;
  icon: ElementType;
  label: string;
  external?: boolean;
}> = [
  {
    href: `mailto:${siteConfig.email}`,
    icon: Mail,
    label: "Email",
    external: false,
  },
  { href: siteConfig.github, icon: Github, label: "GitHub" },
  { href: siteConfig.x, icon: XIcon, label: "X" },
  { href: siteConfig.facebook, icon: FacebookIcon, label: "Facebook" },
  { href: siteConfig.telegram, icon: TelegramIcon, label: "Telegram" },
  { href: siteConfig.discord, icon: DiscordIcon, label: "Discord" },
];

export function BlogContactRail() {
  const reduceMotion = useReducedMotion();

  return (
    <aside
      aria-label="Contact links"
      className="hidden 2xl:sticky 2xl:top-24 2xl:flex 2xl:w-14 2xl:justify-self-end 2xl:justify-center"
    >
      <div className="flex flex-col items-center gap-1 rounded-full border border-slate-200/90 bg-white/75 p-1.5 shadow-sm shadow-slate-200/20 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/10">
        {contactLinks.map(({ href, icon: Icon, label, external = true }) => (
          <motion.a
            key={label}
            href={href.trim()}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-label={label}
            whileHover={reduceMotion ? undefined : { scale: 1.1, y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-200 hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-teal-400"
          >
            <Icon aria-hidden="true" className="h-5 w-5" />
          </motion.a>
        ))}
      </div>
    </aside>
  );
}
