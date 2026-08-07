"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Network } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogPagination } from "@/components/blog/blog-pagination";
import {
  clampBlogPage,
  getBlogPageCount,
  getBlogPageItems,
  getBlogPageSize,
} from "@/components/blog/pagination";
import { useLanguage } from "@/hooks/use-language";
import type { BlogPostSummary } from "@/lib/blog/types";

type BlogShowcaseProps = {
  posts: BlogPostSummary[];
};

function subscribeToViewport(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("resize", onStoreChange, { passive: true });
  return () => window.removeEventListener("resize", onStoreChange);
}

function getViewportPageSize() {
  if (typeof window === "undefined") return 1;
  return getBlogPageSize(window.innerWidth);
}

function getServerPageSize() {
  return 1;
}

function RouteDecoration({ itemCount, startIndex }: { itemCount: number; startIndex: number }) {
  const nodes = Array.from({ length: Math.max(1, itemCount) });

  return (
    <div aria-hidden="true" className="relative my-5 hidden h-5 items-center sm:flex">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
      <div className="relative grid w-full grid-flow-col auto-cols-fr items-center">
        {nodes.map((_, index) => (
          <span key={index} className="flex items-center justify-center">
            <span className="relative flex h-3 w-3 items-center justify-center rounded-full border border-teal-500/70 bg-slate-50 shadow-[0_0_0_4px_rgba(248,250,252,0.9)] dark:bg-slate-950 dark:shadow-[0_0_0_4px_rgba(2,6,23,0.9)]">
              <span className="h-1 w-1 rounded-full bg-teal-500" />
              <span className="absolute top-3.5 font-mono text-[9px] tabular-nums text-slate-400 dark:text-slate-600">
                {String(startIndex + index + 1).padStart(2, "0")}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function BlogShowcase({ posts }: BlogShowcaseProps) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const pageSize = useSyncExternalStore(
    subscribeToViewport,
    getViewportPageSize,
    getServerPageSize,
  );
  const [anchorIndex, setAnchorIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const comingSoonCount = posts.filter((post) => post.status === "comingSoon").length;
  const totalPages = getBlogPageCount(posts.length, pageSize);
  const requestedPage = Math.floor(anchorIndex / pageSize);
  const currentPage = clampBlogPage(requestedPage, posts.length, pageSize);
  const visiblePosts = getBlogPageItems(posts, currentPage, pageSize);
  const startIndex = currentPage * pageSize;

  const handlePageChange = (nextPage: number) => {
    const safeNextPage = clampBlogPage(nextPage, posts.length, pageSize);
    setDirection(safeNextPage >= currentPage ? 1 : -1);
    setAnchorIndex(safeNextPage * pageSize);
  };

  return (
    <div>
      <header className="grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
            <Network aria-hidden="true" className="h-4 w-4" />
            {lang({ en: "Field notes", vi: "Ghi chép thực địa" })}
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
            Blog<span className="text-teal-500">.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            {lang({
              en: "Short notes about networking, automation, and security in real-world systems.",
              vi: "Những ghi chú ngắn về mạng, tự động hóa và bảo mật trong các hệ thống thực tế.",
            })}
          </p>
        </div>

        <div className="flex items-center justify-between gap-5 border-t border-slate-200/80 pt-4 lg:min-w-[15rem] lg:justify-end lg:border-l lg:border-t-0 lg:py-1 lg:pl-8 dark:border-slate-800">
          <div className="flex gap-4 font-mono">
            <div>
              <div className="text-xl font-bold tabular-nums text-slate-950 dark:text-slate-50">
                {String(publishedCount).padStart(2, "0")}
              </div>
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                {lang({ en: "Published", vi: "Đã đăng" })}
              </div>
            </div>
            {comingSoonCount > 0 ? (
              <div>
                <div className="text-xl font-bold tabular-nums text-slate-950 dark:text-slate-50">
                  {String(comingSoonCount).padStart(2, "0")}
                </div>
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  {lang({ en: "Upcoming", vi: "Sắp ra mắt" })}
                </div>
              </div>
            ) : null}
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-4 dark:text-teal-400 dark:hover:text-teal-300 dark:focus-visible:ring-offset-slate-950"
          >
            {lang({ en: "View all", vi: "Xem tất cả" })}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {posts.length > 0 ? (
        <RouteDecoration itemCount={visiblePosts.length} startIndex={startIndex} />
      ) : null}

      {posts.length > 0 ? (
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={`${pageSize}-${currentPage}`}
            initial={{ opacity: 0, x: reduceMotion ? 0 : direction * 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : direction * -12 }}
            transition={{
              duration: reduceMotion ? 0.12 : 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            {visiblePosts.map((post, index) => (
              <BlogCard
                key={post.slug}
                post={post}
                articleIndex={startIndex + index + 1}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
          {lang({
            en: "No field notes are published yet.",
            vi: "Chưa có ghi chép nào được xuất bản.",
          })}
        </div>
      )}

      <div className="mt-5">
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
