"use client";

import { Network } from "lucide-react";
import { BlogBackLink } from "@/components/blog/blog-back-link";
import { BlogCard } from "@/components/blog/blog-card";
import { useLanguage } from "@/hooks/use-language";
import type { BlogPostSummary } from "@/lib/blog/types";

type BlogArchiveProps = {
  posts: BlogPostSummary[];
};

export function BlogArchive({ posts }: BlogArchiveProps) {
  const { lang } = useLanguage();
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const comingSoonCount = posts.filter((post) => post.status === "comingSoon").length;

  return (
    <div>
      <header className="mb-12 border-b border-slate-200 pb-8 dark:border-slate-800">
        <BlogBackLink>
          {lang({ en: "Back to portfolio", vi: "Quay lại portfolio" })}
        </BlogBackLink>

        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
              <Network aria-hidden="true" className="h-4 w-4" />
              {lang({ en: "Technical field notes", vi: "Ghi chép kỹ thuật" })}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
              Blog<span className="text-teal-500">.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
              {lang({
                en: "Technical notes, experiments, and field observations from real-world systems.",
                vi: "Ghi chú kỹ thuật, thử nghiệm và quan sát thực tế từ các hệ thống vận hành.",
              })}
            </p>
          </div>

          <div className="flex gap-6 font-mono text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            <span><strong className="mr-1 text-base text-slate-950 dark:text-slate-50">{String(publishedCount).padStart(2, "0")}</strong>{lang({ en: "published", vi: "đã đăng" })}</span>
            {comingSoonCount > 0 ? (
              <span><strong className="mr-1 text-base text-slate-950 dark:text-slate-50">{String(comingSoonCount).padStart(2, "0")}</strong>{lang({ en: "upcoming", vi: "sắp ra mắt" })}</span>
            ) : null}
          </div>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
          {lang({ en: "No field notes are available yet.", vi: "Chưa có ghi chép nào." })}
        </div>
      ) : (
      <section aria-label={lang({ en: "Blog articles", vi: "Các bài viết blog" })}>
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {String(posts.length).padStart(2, "0")} {lang({ en: "field notes", vi: "ghi chép" })}
        </span>
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.55)]"
        />
      </div>
      <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post, index) => (
          <BlogCard
            key={post.slug}
            post={post}
            articleIndex={index + 1}
            headingLevel="h2"
          />
        ))}
      </div>
      </section>
      )}
    </div>
  );
}
