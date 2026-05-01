"use client";

import { motion, useReducedMotion } from "motion/react";
import { Cloud, Server, Shield } from "lucide-react";
import { Section } from "../ui/section";
import { useLanguage } from "@/hooks/use-language";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "@/lib/motion";

const getFeatures = (lang: (dict: { en: string; vi: string }) => string) => [
  {
    icon: Server,
    title: lang({ en: "Network Infrastructure", vi: "Hạ Tầng Mạng" }),
    description: lang({
      en: "Designing and deploying resilient LAN, WAN, and datacenter architectures using industry best practices.",
      vi: "Thiết kế và triển khai kiến trúc LAN, WAN và trung tâm dữ liệu có độ ổn định cao bằng các phương thức tốt nhất.",
    }),
  },
  {
    icon: Shield,
    title: lang({ en: "Network Security", vi: "An Ninh Mạng" }),
    description: lang({
      en: "Implementing robust firewall policies, VPNs, and Zero Trust architectures to protect against cyber threats.",
      vi: "Thực hiện các chính sách tường lửa mạnh mẽ, hệ thống VPN và kiến trúc Zero Trust để bảo vệ khỏi các mối đe dọa mạng.",
    }),
  },
  {
    icon: Cloud,
    title: lang({ en: "Cloud & Automation", vi: "Đám Mây & Tự Động Hóa" }),
    description: lang({
      en: "Connecting on-premise environments to public clouds and automating repetitive tasks for efficiency.",
      vi: "Kết nối môi trường on-premise với đám mây công cộng và tự động hóa các tác vụ lặp đi lặp lại để tăng tính hiệu quả.",
    }),
  },
];

export function AboutSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";
  const features = getFeatures(lang);

  return (
    <Section
      id="about"
      title={lang({ en: "About Me", vi: "Giới Thiệu" })}
      subtitle={lang({
        en: "My approach to modern network engineering combines solid foundational principles with automation and cloud technologies.",
        vi: "Cách tiếp cận của tôi với kỹ thuật mạng hiện đại kết hợp các nguyên tắc nền tảng vững chắc với công nghệ tự động hóa và đám mây.",
      })}
    >
      <motion.div
        className="mt-12 grid gap-8 md:grid-cols-3"
        initial={initial}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.1)}
      >
        {features.map((feature) => (
          <motion.article
            key={feature.title}
            variants={fadeUp}
            whileHover={reduceMotion ? undefined : { y: -6 }}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <motion.div
              variants={scaleIn}
              className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 transition-colors group-hover:bg-yellow-500 group-hover:text-white dark:bg-yellow-900/30 dark:text-yellow-400"
            >
              <feature.icon className="h-6 w-6 transition-transform group-hover:scale-110" />
            </motion.div>
            <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              {feature.description}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
