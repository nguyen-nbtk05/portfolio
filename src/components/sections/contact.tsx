"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check
} from "lucide-react";
import emailjs from "@emailjs/browser";

import { Section } from "../ui/section";
import { siteConfig } from "@/data/config";
import { useLanguage } from "@/hooks/use-language";
import { scaleIn, staggerContainer, viewportOnce, slideInLeft } from "@/lib/motion";
import { SmartIconButton } from "@/components/layouts/footer";
import { Github, XIcon, FacebookIcon, TelegramIcon, DiscordIcon } from "@/components/ui/icons";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) {
      newErrors.name = lang({ en: "Name is required", vi: "Vui lòng nhập họ tên" });
    }
    if (!formData.email.trim()) {
      newErrors.email = lang({ en: "Email is required", vi: "Vui lòng nhập email" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = lang({ en: "Invalid email address", vi: "Email không hợp lệ" });
    }
    if (!formData.message.trim()) {
      newErrors.message = lang({ en: "Message is required", vi: "Vui lòng nhập nội dung tin nhắn" });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS variables are not configured. Running in DEMO mode.");
      // Mock sending email
      setTimeout(() => {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 1500);
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject || "No Subject (Portfolio)",
          message: formData.message,
          to_name: siteConfig.name,
        },
        publicKey
      );
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Failed to send email:", err);
      setStatus("error");
    }
  };

  return (
    <Section id="contact" className="pb-0 sm:pb-0 lg:pb-0">
      <div className="flex flex-col justify-between min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] w-full">
        {/* Spacer to push content down to center */}
        <div className="flex-1" />

        {/* Main contact content: Balanced 2-Column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 w-full max-w-7xl mx-auto items-stretch">
          
          {/* Left Column: Contact info & Socials */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-center space-y-6 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-8"
            initial={initial}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.08)}
          >
            <div className="space-y-6">
              <motion.div variants={slideInLeft} className="space-y-4">
                <div className="inline-flex items-center justify-center rounded-2xl bg-teal-100/80 p-3 dark:bg-teal-950/40">
                  <Mail className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {lang({ en: "Let's connect", vi: "Hãy kết nối" })}
                  <span className="text-teal-500">.</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base text-justify">
                  {lang({
                    en: "Whether you have a question, a project proposal, or just want to say hi, my inbox is always open. Let's build some amazing things together.",
                    vi: "Cho dù bạn có câu hỏi, đề xuất dự án hay chỉ muốn chào hỏi, hộp thư của tôi luôn mở. Hãy cùng nhau xây dựng những hệ thống mạng đáng tin cậy.",
                  })}
                </p>
              </motion.div>

              {/* Info Cards */}
              <div className="space-y-3">
                {/* Email card with copy option */}
                <motion.div 
                  variants={slideInLeft}
                  onClick={handleCopyEmail}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 hover:border-teal-500/40 dark:hover:border-teal-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-500/5 transition-[transform,box-shadow,border-color] duration-300 cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 group-hover:bg-teal-500/10 group-hover:text-teal-500 transition-[background-color,color] duration-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {siteConfig.email}
                    </p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 group-hover:border-teal-500/35 text-slate-400 dark:text-slate-500 group-hover:text-teal-500 transition-[border-color,color] duration-300">
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </div>
                </motion.div>

                {/* Location card */}
                <motion.div 
                  variants={slideInLeft}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 hover:border-sky-500/40 dark:hover:border-sky-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/5 transition-[transform,box-shadow,border-color] duration-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 group-hover:bg-sky-500/10 group-hover:text-sky-500 transition-[background-color,color] duration-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {lang({ en: "Location", vi: "Vị trí" })}
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {lang({ en: "Ho Chi Minh City, Vietnam", vi: "TP. Hồ Chí Minh, Việt Nam" })}
                    </p>
                  </div>
                </motion.div>

                {/* Availability card */}
                <motion.div 
                  variants={slideInLeft}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 hover:border-indigo-500/40 dark:hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/5 transition-[transform,box-shadow,border-color] duration-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-500 transition-[background-color,color] duration-300">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {lang({ en: "Availability", vi: "Thời gian làm việc" })}
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {lang({ en: "Active / Reply within 24h", vi: "Hoạt động / Phản hồi trong 24h" })}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Modern Form Card */}
          <motion.div
            className="lg:col-span-7 bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/20 dark:shadow-none flex flex-col justify-center relative overflow-hidden transition-[box-shadow,border-color] duration-300 hover:shadow-2xl hover:shadow-slate-200/40 dark:hover:shadow-black/10 hover:border-slate-300 dark:hover:border-slate-700"
            initial={initial}
            whileInView="visible"
            viewport={viewportOnce}
            variants={scaleIn}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">
                    {lang({ en: "Message Sent Successfully!", vi: "Gửi Tin Nhắn Thành Công!" })}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-8 text-sm sm:text-base leading-relaxed">
                    {lang({
                      en: "Thank you for reaching out! I appreciate your message and will get back to you as soon as possible.",
                      vi: "Cảm ơn bạn đã gửi tin nhắn! Tôi sẽ xem xét và phản hồi lại bạn sớm nhất có thể.",
                    })}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStatus("idle")}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {lang({ en: "Send another message", vi: "Gửi tin nhắn khác" })}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form-state"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Form Header */}
                  <div className="space-y-1 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      {lang({ en: "Send Me a Message", vi: "Gửi Tin Nhắn Cho Tôi" })}
                      <span className="text-teal-500">.</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lang({
                        en: "Fill out the form below and I'll get back to you shortly.",
                        vi: "Điền thông tin bên dưới và tôi sẽ phản hồi bạn trong thời gian sớm nhất.",
                      })}
                    </p>
                  </div>
                  {/* Name and Email side-by-side on tablet/desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {lang({ en: "Your Name", vi: "Họ và Tên" })} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={lang({ en: "John Doe", vi: "Nguyễn Văn A" })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.name 
                            ? "border-rose-500 focus:ring-rose-500/10 focus:border-rose-500" 
                            : "border-slate-200 dark:border-slate-800/80 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-teal-500/10"
                        } bg-white/50 dark:bg-slate-950/20 text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none focus:ring-4 transition-[border-color,box-shadow] duration-250`}
                      />
                      {errors.name && (
                        <span className="flex items-center gap-1 text-xs text-rose-500 font-medium">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="johndoe@example.com"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.email 
                            ? "border-rose-500 focus:ring-rose-500/10 focus:border-rose-500" 
                            : "border-slate-200 dark:border-slate-800/80 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-teal-500/10"
                        } bg-white/50 dark:bg-slate-950/20 text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none focus:ring-4 transition-[border-color,box-shadow] duration-250`}
                      />
                      {errors.email && (
                        <span className="flex items-center gap-1 text-xs text-rose-500 font-medium">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {lang({ en: "Subject", vi: "Tiêu đề" })}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder={lang({ en: "How can I help you?", vi: "Tôi có thể giúp gì cho bạn?" })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800/80 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-teal-500/10 bg-white/50 dark:bg-slate-950/20 text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none focus:ring-4 transition-[border-color,box-shadow] duration-250"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {lang({ en: "Message", vi: "Nội dung" })} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={lang({
                        en: "Type your message here...",
                        vi: "Nhập nội dung tin nhắn của bạn...",
                      })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.message 
                          ? "border-rose-500 focus:ring-rose-500/10 focus:border-rose-500" 
                          : "border-slate-200 dark:border-slate-800/80 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-teal-500/10"
                      } bg-white/50 dark:bg-slate-950/20 text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none focus:ring-4 transition-[border-color,box-shadow] duration-250 resize-none`}
                    />
                    {errors.message && (
                      <span className="flex items-center gap-1 text-xs text-rose-500 font-medium">
                        <AlertCircle className="h-3 w-3" />
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Submission Alert Info/Error */}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm"
                    >
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>
                        {lang({
                          en: "Oops! Something went wrong. Please try sending again or contact directly via email.",
                          vi: "Đã xảy ra lỗi khi gửi. Vui lòng thử lại hoặc liên hệ trực tiếp qua email.",
                        })}
                      </p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    className="w-full group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-teal-500/20 transition-colors hover:bg-teal-700 active:bg-teal-800 disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {lang({ en: "Sending...", vi: "Đang gửi..." })}
                      </>
                    ) : (
                      <>
                        {lang({ en: "Send Message", vi: "Gửi Tin Nhắn" })}
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Spacer to push footer down */}
        <div className="flex-1" />

        {/* Integrated Footer */}
        <footer className="w-full mt-auto pt-4 pb-0 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-sm text-slate-500 dark:text-slate-400">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}.{" "}
              {lang({ en: "All rights reserved.", vi: "Đã đăng ký bản quyền." })}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-1">
            <span className="pl-3 pr-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-slate-800 mr-1 select-none">
              {lang({ en: "Follow me", vi: "Theo dõi tôi" })}
            </span>
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
