"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  LockKeyhole,
  LockKeyholeOpen,
  Search,
  X,
} from "lucide-react";
import { BlogBackLink } from "@/components/blog/blog-back-link";
import { BlogCard } from "@/components/blog/blog-card";
import { VaultAccessPanel } from "@/components/blog/vault-access-panel";
import { useLanguage } from "@/hooks/use-language";
import type { BlogPostSummary } from "@/lib/blog/types";

type BlogArchiveProps = {
  posts: BlogPostSummary[];
  vaultPosts: BlogPostSummary[];
  vaultUnlocked: boolean;
  vaultConfigured: boolean;
};

const ALL_TOPICS = "all";
const VAULT_TOPIC = "vault";

type SortOrder = "newest" | "oldest" | "title-asc" | "title-desc";

function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function BlogArchive({
  posts,
  vaultPosts,
  vaultUnlocked,
  vaultConfigured,
}: BlogArchiveProps) {
  const { lang, language } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(ALL_TOPICS);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [locking, setLocking] = useState(false);
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const comingSoonCount = posts.filter((post) => post.status === "comingSoon").length;
  const isVaultSelected = selectedTopic === VAULT_TOPIC;
  const activePosts = isVaultSelected ? vaultPosts : posts;

  const topics = useMemo(
    () =>
      [...new Set(posts.flatMap((post) => post.tags))].sort((left, right) =>
        left.localeCompare(right),
      ),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);

    const matchingPosts = activePosts.filter((post) => {
      const matchesTopic =
        isVaultSelected ||
        selectedTopic === ALL_TOPICS ||
        post.tags.includes(selectedTopic);
      const searchableContent = [
        post.title.en,
        post.title.vi,
        post.excerpt.en,
        post.excerpt.vi,
        post.slug,
        ...post.tags,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return (
        matchesTopic &&
        (normalizedQuery.length === 0 || searchableContent.includes(normalizedQuery))
      );
    });

    return [...matchingPosts].sort((left, right) => {
      if (sortOrder === "oldest") {
        return left.publishedAt.localeCompare(right.publishedAt);
      }

      if (sortOrder === "title-asc" || sortOrder === "title-desc") {
        const titleOrder = left.title[language].localeCompare(
          right.title[language],
          language === "vi" ? "vi" : "en",
          { sensitivity: "base" },
        );

        return sortOrder === "title-asc" ? titleOrder : -titleOrder;
      }

      return right.publishedAt.localeCompare(left.publishedAt);
    });
  }, [activePosts, isVaultSelected, language, query, selectedTopic, sortOrder]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedTopic !== ALL_TOPICS ||
    sortOrder !== "newest";

  const clearFilters = () => {
    setQuery("");
    setSelectedTopic(ALL_TOPICS);
    setSortOrder("newest");
  };

  const selectVault = () => {
    setQuery("");
    setSortOrder("newest");
    setSelectedTopic(VAULT_TOPIC);
  };

  const lockVault = async () => {
    setLocking(true);
    try {
      await fetch("/api/blog/vault/session", { method: "DELETE" });
      clearFilters();
      router.refresh();
    } finally {
      setLocking(false);
    }
  };

  return (
    <div>
      <header className="mb-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <BlogBackLink>
          {lang({ en: "Back to portfolio", vi: "Quay lại portfolio" })}
        </BlogBackLink>

        <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            {lang({ en: "All Blogs", vi: "Tất cả bài viết" })}
            <span className="text-teal-500">.</span>
          </h1>

          <div className="flex gap-6 text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            <span>
              <strong className="mr-1 text-base text-slate-950 dark:text-slate-50">
                {String(publishedCount).padStart(2, "0")}
              </strong>
              {lang({ en: "published", vi: "đã đăng" })}
            </span>
            {comingSoonCount > 0 ? (
              <span>
                <strong className="mr-1 text-base text-slate-950 dark:text-slate-50">
                  {String(comingSoonCount).padStart(2, "0")}
                </strong>
                {lang({ en: "upcoming", vi: "sắp ra mắt" })}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <section aria-label={lang({ en: "Blog articles", vi: "Các bài viết blog" })}>
        <div className="mb-5 rounded-2xl border border-slate-200/90 bg-white/75 p-4 shadow-sm shadow-slate-200/20 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/10">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.3fr)_auto]">
            <label className="relative block">
              <span className="sr-only">
                {lang({ en: "Search articles", vi: "Tìm kiếm bài viết" })}
              </span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                disabled={isVaultSelected && !vaultUnlocked}
                placeholder={lang({
                  en: "Search by title, keyword, or topic...",
                  vi: "Tìm theo tiêu đề, từ khóa hoặc chủ đề...",
                })}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 pl-10 pr-4 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900/75 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">
                {lang({ en: "Sort articles", vi: "Sắp xếp bài viết" })}
              </span>
              <ArrowUpDown
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                disabled={isVaultSelected && !vaultUnlocked}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white/80 pl-10 pr-9 text-sm text-slate-700 outline-none transition-[border-color,box-shadow] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900/75 dark:text-slate-300"
              >
                <option value="newest">
                  {lang({ en: "Newest first", vi: "Mới nhất trước" })}
                </option>
                <option value="oldest">
                  {lang({ en: "Oldest first", vi: "Cũ nhất trước" })}
                </option>
                <option value="title-asc">
                  {lang({ en: "Title: A–Z", vi: "Tiêu đề: A–Z" })}
                </option>
                <option value="title-desc">
                  {lang({ en: "Title: Z–A", vi: "Tiêu đề: Z–A" })}
                </option>
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[0.65rem] text-slate-400"
              >
                ▼
              </span>
            </label>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-800 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
              >
                <X aria-hidden="true" className="h-4 w-4" />
                {lang({ en: "Clear", vi: "Xóa lọc" })}
              </button>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-800">
            <span className="mr-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {lang({ en: "Topics", vi: "Chủ đề" })}
            </span>
            <button
              type="button"
              onClick={() => setSelectedTopic(ALL_TOPICS)}
              aria-pressed={selectedTopic === ALL_TOPICS}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-[background-color,border-color,color,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                selectedTopic === ALL_TOPICS
                  ? "border-teal-500 bg-teal-500 text-white shadow-sm shadow-teal-500/20"
                  : "border-slate-200 bg-white/80 text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-900/75 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
              }`}
            >
              {lang({ en: "All topics", vi: "Tất cả" })}
            </button>
            {topics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                aria-pressed={selectedTopic === topic}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-[background-color,border-color,color,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  selectedTopic === topic
                    ? "border-teal-500 bg-teal-500 text-white shadow-sm shadow-teal-500/20"
                    : "border-slate-200 bg-white/80 text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-900/75 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
                }`}
              >
                {topic}
              </button>
            ))}

            <span className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
            <button
              type="button"
              onClick={selectVault}
              aria-pressed={isVaultSelected}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-[background-color,border-color,color,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                isVaultSelected
                  ? "border-violet-500 bg-violet-500 text-white shadow-sm shadow-violet-500/20"
                  : "border-violet-200 bg-violet-50/80 text-violet-700 hover:border-violet-300 hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/70"
              }`}
            >
              {vaultUnlocked ? (
                <LockKeyholeOpen aria-hidden="true" className="h-3.5 w-3.5" />
              ) : (
                <LockKeyhole aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {lang({ en: "Private Vault", vi: "Góc riêng tư" })}
            </button>
            {vaultUnlocked ? (
              <button
                type="button"
                onClick={lockVault}
                disabled={locking}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              >
                <LockKeyhole aria-hidden="true" className="h-3.5 w-3.5" />
                {lang({ en: "Lock", vi: "Khóa lại" })}
              </button>
            ) : null}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-3 dark:border-slate-800">
            <span
              className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
              aria-live="polite"
            >
              {isVaultSelected && !vaultUnlocked
                ? lang({ en: "Private area locked", vi: "Khu vực riêng đang khóa" })
                : lang({
                    en: `${String(filteredPosts.length).padStart(2, "0")} of ${String(activePosts.length).padStart(2, "0")} articles`,
                    vi: `${String(filteredPosts.length).padStart(2, "0")} / ${String(activePosts.length).padStart(2, "0")} bài viết`,
                  })}
            </span>
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                isVaultSelected
                  ? "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.55)]"
                  : "bg-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.55)]"
              }`}
            />
          </div>
        </div>

        {isVaultSelected && !vaultUnlocked ? (
          <VaultAccessPanel configured={vaultConfigured} />
        ) : filteredPosts.length > 0 ? (
          <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <BlogCard
                key={post.slug}
                post={post}
                articleIndex={index + 1}
                headingLevel="h2"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-950/50">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {isVaultSelected && activePosts.length === 0
                ? lang({
                    en: "No private articles are available yet.",
                    vi: "Chưa có bài viết riêng tư nào.",
                  })
                : lang({
                    en: "No matching articles found.",
                    vi: "Không tìm thấy bài viết phù hợp.",
                  })}
            </p>
            {activePosts.length > 0 ? (
              <>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {lang({
                    en: "Try another keyword or clear the current filters.",
                    vi: "Hãy thử từ khóa khác hoặc xóa bộ lọc hiện tại.",
                  })}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-950/70"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                  {lang({ en: "Clear filters", vi: "Xóa bộ lọc" })}
                </button>
              </>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
