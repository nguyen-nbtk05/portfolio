"use client";

import { Section } from "../ui/section";
import { siteConfig } from "@/data/config";
import { Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

export function ContactSection() {
  const { lang } = useLanguage();

  return (
    <Section id="contact" className="py-24 md:py-32">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6">
          <Mail className="w-8 h-8 md:w-10 md:h-10 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {lang({ en: "Ready to connect?", vi: "Sẵn sàng kết nối?" })}
        </h2>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          {lang({ 
            en: "Whether you have a question, a project proposal, or just want to say hi, my inbox is always open. Let's build reliable networks together.",
            vi: "Cho dù bạn có câu hỏi, đề xuất dự án hay chỉ muốn chào hỏi, hộp thư của tôi luôn mở. Hãy cùng nhau xây dựng những hệ thống mạng đáng tin cậy."
          })}
        </p>
        <a
          href={`mailto:${siteConfig.email}`}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-lg rounded-xl transition-colors shadow-lg shadow-yellow-500/25"
        >
          {lang({ en: "Say Hello", vi: "Gửi Lời Chào" })}
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </Section>
  );
}
