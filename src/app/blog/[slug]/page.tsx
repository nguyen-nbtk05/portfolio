import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { BlogBackLink } from "@/components/blog/blog-back-link";
import { MdxRenderer } from "@/components/blog/mdx-renderer";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { SectionBackground } from "@/components/ui/section-background";
import { getPostBySlug } from "@/lib/blog/get-post";
import { getAdjacentPosts, getPublishedSlugs } from "@/lib/blog/get-posts";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  isLanguage,
  type Language,
} from "@/lib/language";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = false;

async function getRequestLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
  return isLanguage(value) ? value : DEFAULT_LANGUAGE;
}

function formatDate(value: string, locale: Language) {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getRequestLanguage()]);
  const post = await getPostBySlug(slug, locale);

  if (!post) notFound();

  const title = post.title[locale];
  const description = post.excerpt[locale];

  return {
    title: `${title} | Blog`,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  };
}

function AdjacentLink({
  href,
  label,
  title,
  direction,
}: {
  href: string;
  label: string;
  title: string;
  direction: "previous" | "next";
}) {
  return (
    <Link
      href={href}
      className={`group rounded-xl border border-slate-200 bg-white/70 p-5 transition-colors hover:border-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-teal-700 ${direction === "next" ? "text-right" : "text-left"}`}
    >
      <span className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal-600 dark:text-teal-400 ${direction === "next" ? "justify-end" : "justify-start"}`}>
        {direction === "previous" ? <ArrowLeft aria-hidden="true" className="h-4 w-4" /> : null}
        {label}
        {direction === "next" ? <ArrowRight aria-hidden="true" className="h-4 w-4" /> : null}
      </span>
      <span className="line-clamp-2 font-semibold text-slate-900 group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-teal-300">
        {title}
      </span>
    </Link>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const [{ slug }, locale] = await Promise.all([params, getRequestLanguage()]);
  const [post, adjacent] = await Promise.all([
    getPostBySlug(slug, locale),
    getAdjacentPosts(slug),
  ]);

  if (!post) notFound();

  const readMinutes = post.readTime[locale];

  return (
    <section lang={locale} className="relative isolate min-h-screen overflow-hidden pb-24 pt-32 sm:pt-36">
      <SectionBackground variant="blog" />
      <ReadingProgress targetId="article-body" />

      <article className="relative z-10 mx-auto w-full px-[1cm]">
        <header className="mx-auto max-w-4xl border-b border-slate-200 pb-9 dark:border-slate-800">
          <BlogBackLink>
            {locale === "vi" ? "Quay lại Blog" : "Back to Blog"}
          </BlogBackLink>

          <div className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
            {post.tags.slice(0, 2).join(" · ")}
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
            {post.title[locale]}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            {post.excerpt[locale]}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="h-4 w-4 text-teal-500" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 aria-hidden="true" className="h-4 w-4 text-teal-500" />
              {locale === "vi" ? `${readMinutes} phút đọc` : `${readMinutes} min read`}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-slate-200/70 px-2.5 py-1 font-mono text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div
          id="article-body"
          data-cursor="text"
          className="mx-auto max-w-[72ch] py-10 text-[1.02rem] [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200 [&_img]:dark:border-slate-800"
        >
          <MdxRenderer source={post.content} sourcePath={`${post.slug}/${locale}.mdx`} />
        </div>

        <nav aria-label={locale === "vi" ? "Bài viết liền kề" : "Adjacent articles"} className="mx-auto grid max-w-4xl gap-4 border-t border-slate-200 pt-8 md:grid-cols-2 dark:border-slate-800">
          {adjacent.previous?.href ? (
            <AdjacentLink
              href={adjacent.previous.href}
              label={locale === "vi" ? "Bài trước" : "Previous"}
              title={adjacent.previous.title[locale]}
              direction="previous"
            />
          ) : <span aria-hidden="true" />}
          {adjacent.next?.href ? (
            <AdjacentLink
              href={adjacent.next.href}
              label={locale === "vi" ? "Bài tiếp" : "Next"}
              title={adjacent.next.title[locale]}
              direction="next"
            />
          ) : <span aria-hidden="true" />}
        </nav>
      </article>
    </section>
  );
}
