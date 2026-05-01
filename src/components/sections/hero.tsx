"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Terminal } from "lucide-react";
import { siteConfig } from "@/data/config";
import { useLanguage } from "@/providers/language-provider";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/motion";

export function HeroSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden py-20">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 via-slate-50 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />
      <motion.div
        aria-hidden="true"
        className="network-grid absolute inset-0 z-0 opacity-70 dark:opacity-45"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: reduceMotion ? 0.55 : 0.7 }}
        transition={{ duration: 0.8 }}
      />
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <span className="network-packet absolute left-[12%] top-[68%] h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_24px_rgba(234,179,8,0.65)]" />
        <span className="network-packet absolute left-[28%] top-[58%] h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(251,146,60,0.6)]" />
        <span className="network-packet absolute left-[8%] top-[42%] h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.55)]" />
      </div>

      <div className="container relative z-10 mx-auto px-[1cm]">
        <motion.div
          className="flex max-w-3xl flex-col items-start gap-8"
          initial={initial}
          animate="visible"
          variants={staggerContainer(0.11)}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-2 rounded-full border border-slate-300/70 bg-slate-200/55 px-3 py-1 font-mono text-sm shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-800/55"
          >
            <motion.span
              aria-hidden="true"
              animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="flex"
            >
              <Terminal className="h-4 w-4 text-yellow-500" />
            </motion.span>
            <span className="text-slate-700 dark:text-slate-300">ping 127.0.0.1 -c 1</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl font-bold tracking-tighter md:text-7xl"
          >
            {lang({ en: "Hi, I'm", vi: "Xin chào, tôi là" })} {siteConfig.name}
            <br />
            <motion.span
              variants={fadeIn}
              className="mt-2 block w-full text-4xl md:text-6xl"
            >
              <TypewriterText
                key={lang(siteConfig.role)}
                text={lang(siteConfig.role)}
                className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent"
                typingSpeed={85}
                deletingSpeed={45}
                pauseDuration={1200}
              />
            </motion.span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-400"
          >
            {lang(siteConfig.description)}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-4">
            <Link
              href="#projects"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white shadow-lg shadow-yellow-500/20 transition-colors hover:bg-yellow-600"
            >
              {lang({ en: "View Projects", vi: "Xem Dự Án" })}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-200 px-6 py-3 font-medium text-slate-900 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
            >
              {lang({ en: "Contact Me", vi: "Liên Hệ" })}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
