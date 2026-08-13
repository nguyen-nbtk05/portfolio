"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { BlogPostSummary } from "@/lib/blog/types";

type BlogCardProps = {
  post: BlogPostSummary;
  articleIndex: number;
  headingLevel?: "h2" | "h3";
};

function formatPublishedDate(value: string, language: "en" | "vi") {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function BlogCard({ post, articleIndex, headingLevel = "h3" }: BlogCardProps) {
  const { lang, language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const Heading = headingLevel;
  const visibleTags = post.tags.slice(0, 2);
  const hiddenTagCount = Math.max(0, post.tags.length - visibleTags.length);
  const readTime = post.readTime?.[language] ?? null;
  const isReadable = post.status === "published" && Boolean(post.href);

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-lg shadow-slate-200/25 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 before:absolute before:inset-x-5 before:top-0 before:h-px before:origin-left before:scale-x-0 before:bg-gradient-to-r before:from-teal-400 before:via-cyan-400 before:to-transparent before:transition-transform before:duration-300 hover:border-teal-300/80 hover:shadow-xl hover:shadow-teal-900/10 hover:before:scale-x-100 sm:p-6 dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/25 dark:hover:border-teal-700/70 dark:hover:shadow-black/40"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
          {lang({ en: "Article", vi: "Bài viết" })} {String(articleIndex).padStart(2, "0")}
        </span>
        {post.featured ? (
          <span className="rounded-full border border-teal-300/70 bg-teal-50 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-teal-700 dark:border-teal-700/70 dark:bg-teal-500/10 dark:text-teal-300">
            {lang({ en: "Featured", vi: "Nổi bật" })}
          </span>
        ) : null}
      </div>

      <div className="mb-4 flex min-h-5 flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays aria-hidden="true" className="h-4 w-4 text-teal-500" />
          <time dateTime={post.publishedAt}>{formatPublishedDate(post.publishedAt, language)}</time>
        </span>
        {readTime !== null ? (
          <span className="inline-flex items-center gap-1.5">
            <Clock3 aria-hidden="true" className="h-4 w-4 text-teal-500" />
            {lang({ en: `${readTime} min read`, vi: `${readTime} phút đọc` })}
          </span>
        ) : null}
      </div>

      <Heading
        lang={language}
        className="mb-3 line-clamp-2 min-h-[3.5rem] break-words hyphens-auto text-justify [text-align-last:left] [text-justify:inter-word] text-xl font-bold leading-7 tracking-tight text-slate-950 dark:text-slate-50"
      >
        {lang(post.title)}
      </Heading>

      <p
        lang={language}
        className="mb-5 line-clamp-3 min-h-[4.5rem] flex-grow break-words hyphens-auto text-justify [text-align-last:left] [text-justify:inter-word] text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base"
      >
        {lang(post.excerpt)}
      </p>

      <div className="mb-5 flex min-h-7 items-center gap-2 overflow-hidden">
        {visibleTags.map((tag) => (
          <span
            key={tag}
            title={tag}
            className="min-w-0 max-w-[9.5rem] flex-1 truncate rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
        {hiddenTagCount > 0 ? (
          <span
            aria-label={lang({
              en: `${hiddenTagCount} more tags`,
              vi: `Thêm ${hiddenTagCount} thẻ`,
            })}
            className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400"
          >
            +{hiddenTagCount}
          </span>
        ) : null}
      </div>

      <div className="mt-auto border-t border-slate-200/80 pt-4 dark:border-slate-800">
        {isReadable && post.href ? (
          <Link
            href={post.href}
            className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-4 dark:text-teal-400 dark:hover:text-teal-300 dark:focus-visible:ring-offset-slate-950"
          >
            {lang({ en: "Read article", vi: "Đọc bài viết" })}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.55)]"
            />
            {lang({ en: "Coming soon", vi: "Sắp ra mắt" })}
          </span>
        )}
      </div>
    </motion.article>
  );
}
