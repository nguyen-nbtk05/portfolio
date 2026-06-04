"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { Section } from "../ui/section";
import { siteConfig } from "@/data/config";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "@/lib/motion";
import { SmartIconButton } from "@/components/layouts/footer";
import { Github, XIcon, FacebookIcon, TelegramIcon, DiscordIcon } from "@/components/ui/icons";

export function ContactSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <Section id="contact" className="pb-0 sm:pb-0 lg:pb-0">
      <div className="flex flex-col justify-between min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] w-full">
        {/* Spacer to push content down to center */}
        <div className="flex-1" />

        {/* Main contact content */}
        <motion.div
          className="mx-auto max-w-2xl text-center py-6"
          initial={initial}
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
        >
          <motion.div
            variants={scaleIn}
            className="mb-6 inline-flex items-center justify-center rounded-full bg-teal-100 p-3 sm:p-4 dark:bg-teal-900/30"
          >
            <Mail className="h-8 w-8 text-teal-600 md:h-10 md:w-10 dark:text-teal-400" />
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
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-teal-500/25 transition-colors hover:bg-teal-700"
          >
            {lang({ en: "Say Hello", vi: "Gửi Lời Chào" })}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </motion.div>

        {/* Spacer to push footer down */}
        <div className="flex-1" />

        {/* Integrated Footer (Reduced height and stylized) */}
        <footer className="w-full mt-auto pt-4 pb-0 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-sm text-slate-500 dark:text-slate-400">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}.{" "}
              {lang({ en: "All rights reserved.", vi: "Đã đăng ký bản quyền." })}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-1">
              <SmartIconButton href={`mailto:${siteConfig.email}`} icon={Mail} label="Email" isExternal={false} />
              <SmartIconButton href={siteConfig.github} icon={Github} label="GitHub" />
              <SmartIconButton href={siteConfig.x} icon={XIcon} label="X" />
              <SmartIconButton href={siteConfig.facebook} icon={FacebookIcon} label="Facebook" />
              <SmartIconButton href={siteConfig.telegram} icon={TelegramIcon} label="Telegram" />
              <SmartIconButton href={siteConfig.discord} icon={DiscordIcon} label="Discord" />
            </div>
          </div>
        </footer>
      </div>
    </Section>
  );
}
