"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/data/config";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";

export function HeroSection() {
  const { lang } = useLanguage();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-20">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 via-slate-50 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />
      
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-start gap-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-full text-sm font-mono"
          >
            <Terminal className="w-4 h-4 text-yellow-500" />
            <span className="text-slate-700 dark:text-slate-300">ping 127.0.0.1 -c 1</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter"
          >
            {lang({ en: "Hi, I'm", vi: "Xin chào, tôi là" })} {siteConfig.name}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 text-4xl md:text-6xl mt-2 block w-full whitespace-nowrap">
              {lang(siteConfig.role)}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed"
          >
            {lang(siteConfig.description)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-4"
          >
            <Link
              href="#projects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
            >
              {lang({ en: "View Projects", vi: "Xem Dự Án" })}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 font-medium rounded-lg transition-colors"
            >
              {lang({ en: "Contact Me", vi: "Liên Hệ" })}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
