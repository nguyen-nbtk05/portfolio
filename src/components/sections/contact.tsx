"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { Section } from "../ui/section";
import { siteConfig } from "@/data/config";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "@/lib/motion";

export function ContactSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <Section id="contact" className="py-24 md:py-32">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={initial}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.1)}
      >
        <motion.div
          variants={scaleIn}
          className="mb-6 inline-flex items-center justify-center rounded-full bg-yellow-100 p-3 sm:p-4 dark:bg-yellow-900/30"
        >
          <Mail className="h-8 w-8 text-yellow-600 md:h-10 md:w-10 dark:text-yellow-400" />
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          {lang({ en: "Ready to connect?", vi: "Sẵn sàng kết nối?" })}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mb-10 text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-400"
        >
          {lang({
            en: "Whether you have a question, a project proposal, or just want to say hi, my inbox is always open. Let's build reliable networks together.",
            vi: "Cho dù bạn có câu hỏi, đề xuất dự án hay chỉ muốn chào hỏi, hộp thư của tôi luôn mở. Hãy cùng nhau xây dựng những hệ thống mạng đáng tin cậy.",
          })}
        </motion.p>
        <motion.a
          variants={fadeUp}
          whileHover={reduceMotion ? undefined : { y: -3 }}
          href={`mailto:${siteConfig.email}`}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-yellow-500/25 transition-colors hover:bg-yellow-600"
        >
          {lang({ en: "Say Hello", vi: "Gửi Lời Chào" })}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </motion.a>
      </motion.div>
    </Section>
  );
}
