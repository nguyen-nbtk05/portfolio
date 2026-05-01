"use client";

import { Section } from "../ui/section";
import { Server, Shield, Cloud } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

const getFeatures = (lang: (dict: { en: string; vi: string }) => string) => [
  {
    icon: Server,
    title: lang({ en: "Network Infrastructure", vi: "Hạ Tầng Mạng" }),
    description: lang({ 
      en: "Designing and deploying resilient LAN, WAN, and datacenter architectures using industry best practices.",
      vi: "Thiết kế và triển khai kiến trúc LAN, WAN và trung tâm dữ liệu với độ ổn định cao bằng các phương thức tốt nhất."
    }),
  },
  {
    icon: Shield,
    title: lang({ en: "Network Security", vi: "An Ninh Mạng" }),
    description: lang({
      en: "Implementing robust firewall policies, VPNs, and Zero Trust architectures to protect against cyber threats.",
      vi: "Thực hiện các chính sách tường lửa mạnh mẽ, hệ thống VPN và kiến trúc Zero Trust để bảo vệ khỏi các mối đe dọa mạng."
    }),
  },
  {
    icon: Cloud,
    title: lang({ en: "Cloud & Automation", vi: "Đám Mây & Tự Động Hóa" }),
    description: lang({
      en: "Connecting on-premise environments to public clouds and automating repetitive tasks for efficiency.",
      vi: "Kết nối môi trường on-premise với đám mây công cộng và tự động hóa các tác vụ lặp đi lặp lại để tăng tính hiệu quả."
    }),
  },
];

export function AboutSection() {
  const { lang } = useLanguage();
  const features = getFeatures(lang);

  return (
    <Section 
      id="about" 
      title={lang({ en: "About Me", vi: "Giới Thiệu" })} 
      subtitle={lang({
        en: "My approach to modern network engineering combines solid foundational principles with automation and cloud technologies.",
        vi: "Cách tiếp cận của tôi với kỹ thuật mạng hiện đại kết hợp các nguyên tắc nền tảng vững chắc với công nghệ tự động hóa và đám mây."
      })}
    >
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg flex items-center justify-center mb-6">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
