"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function formatPageNumber(page: number) {
  return String(page).padStart(2, "0");
}

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BlogPaginationProps) {
  const { lang } = useLanguage();
  const hasPreviousPage = currentPage > 0;
  const hasNextPage = currentPage < totalPages - 1;

  return (
    <nav
      aria-label={lang({ en: "Blog pagination", vi: "Phân trang bài viết" })}
      className="flex items-center justify-center gap-3 sm:justify-end"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        aria-label={lang({ en: "Previous articles", vi: "Các bài viết trước" })}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300/80 bg-white/80 text-slate-700 shadow-sm transition-[border-color,background-color,color,box-shadow] hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-300/80 disabled:hover:bg-white/80 disabled:hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-teal-500/70 dark:hover:bg-teal-500/10 dark:hover:text-teal-300 dark:focus-visible:ring-offset-slate-950 dark:disabled:hover:border-slate-700 dark:disabled:hover:bg-slate-900/80 dark:disabled:hover:text-slate-200"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      </button>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="min-w-[5.75rem] rounded-full border border-slate-200/80 bg-white/65 px-3 py-2 text-center text-xs font-semibold tabular-nums tracking-[0.16em] text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/65 dark:text-slate-300"
      >
        <span className="sr-only">
          {lang({
            en: `Page ${currentPage + 1} of ${totalPages}`,
            vi: `Trang ${currentPage + 1} trên ${totalPages}`,
          })}
        </span>
        <span aria-hidden="true">
          <span className="text-slate-950 dark:text-slate-50">
            {formatPageNumber(currentPage + 1)}
          </span>
          <span className="mx-1.5 text-slate-400">/</span>
          <span>{formatPageNumber(totalPages)}</span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label={lang({ en: "Next articles", vi: "Các bài viết tiếp theo" })}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300/80 bg-white/80 text-slate-700 shadow-sm transition-[border-color,background-color,color,box-shadow] hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-300/80 disabled:hover:bg-white/80 disabled:hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-teal-500/70 dark:hover:bg-teal-500/10 dark:hover:text-teal-300 dark:focus-visible:ring-offset-slate-950 dark:disabled:hover:border-slate-700 dark:disabled:hover:bg-slate-900/80 dark:disabled:hover:text-slate-200"
      >
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </nav>
  );
}
