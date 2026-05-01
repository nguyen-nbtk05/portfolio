"use client";

import { motion, useReducedMotion } from "motion/react";
import { Mail } from "lucide-react";
import { siteConfig } from "@/data/config";
import { Github, Linkedin } from "@/components/ui/icons";
import { useLanguage } from "@/providers/language-provider";
import { fadeUp, staggerContainer } from "@/lib/motion";

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
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex text-slate-500 transition hover:-translate-y-0.5 hover:text-yellow-500"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-slate-500 transition hover:-translate-y-0.5 hover:text-yellow-500"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-slate-500 transition hover:-translate-y-0.5 hover:text-yellow-500"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </motion.div>
      </motion.div>
    </footer>
  );
}
