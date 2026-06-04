"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { Section } from "../ui/section";
import { useLanguage } from "@/hooks/use-language";
import { blogPosts } from "@/data/blogs";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function BlogSection() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <Section
      id="blog"
      title={lang({ en: "Blog", vi: "Blog" })}
      subtitle={lang({
        en: "Short notes about networking, automation, and security in real-world systems.",
        vi: "Những ghi chú ngắn về networking, automation và security trong hệ thống thực tế.",
      })}
    >
      <motion.div
        className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={initial}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.1)}
      >
        {blogPosts.map((post) => (
          <motion.article
            key={post.id}
            variants={fadeUp}
            whileHover={reduceMotion ? undefined : { y: -5 }}
            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-950 dark:hover:shadow-black/20"
          >
            <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-teal-500" />
                {post.publishedAt}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-teal-500" />
                {lang(post.readTime)}
              </span>
            </div>

            <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
              {lang(post.title)}
            </h3>

            <p className="mb-5 flex-grow text-slate-600 dark:text-slate-400">
              {lang(post.excerpt)}
            </p>

            <div className="mb-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={post.link}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
            >
              {lang({ en: "Read post", vi: "Đọc bài viết" })}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
