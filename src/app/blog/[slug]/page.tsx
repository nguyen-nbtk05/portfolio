import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Home,
} from "lucide-react";
import { BlogBackLink } from "@/components/blog/blog-back-link";
import { BlogContactRail } from "@/components/blog/blog-contact-rail";
import { BlogTableOfContents } from "@/components/blog/blog-table-of-contents";
import { MdxRenderer } from "@/components/blog/mdx-renderer";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { VaultAccessPanel } from "@/components/blog/vault-access-panel";
import { SectionBackground } from "@/components/ui/section-background";
import { getPostBySlug, getPublishedPostAccess } from "@/lib/blog/get-post";
import { getAdjacentPosts, getPublishedSlugs } from "@/lib/blog/get-posts";
import { extractBlogTableOfContents } from "@/lib/blog/heading-slug";
import { isVaultConfigured, isVaultUnlocked } from "@/lib/blog/vault-auth";
import { siteConfig } from "@/data/config";
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
export const revalidate = 0;
export const dynamicParams = true;

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
  const access = await getPublishedPostAccess(slug);

  if (!access) notFound();

  if (access === "vault") {
    return {
      title: locale === "vi" ? "Góc riêng | Blog" : "Private Vault | Blog",
      description:
        locale === "vi"
          ? "Khu vực ghi chép riêng tư được bảo vệ bằng mật khẩu."
          : "Password-protected private notes.",
      robots: { index: false, follow: false, nocache: true },
    };
  }

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

function ArticleBreadcrumb({
  title,
  locale,
}: {
  title: string;
  locale: Language;
}) {
  return (
    <nav
      aria-label={locale === "vi" ? "Điều hướng bài viết" : "Article navigation"}
      className="mb-4 flex min-w-0 items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
    >
      <Link
        href="/"
        aria-label={locale === "vi" ? "Trang chủ" : "Home"}
        className="shrink-0 rounded-sm p-1 transition-colors hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:text-teal-400"
      >
        <Home aria-hidden="true" className="h-4 w-4" />
      </Link>
      <ChevronRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-600"
      />
      <Link
        href="/blog"
        className="shrink-0 rounded-sm px-1 py-0.5 font-medium transition-colors hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:text-teal-400"
      >
        {locale === "vi" ? "Bài viết" : "Post"}
      </Link>
      <ChevronRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-600"
      />
      <span className="min-w-0 truncate px-1 text-slate-700 dark:text-slate-200">
        {title}
      </span>
    </nav>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const [{ slug }, locale] = await Promise.all([params, getRequestLanguage()]);
  const access = await getPublishedPostAccess(slug);

  if (!access) notFound();

  const vaultUnlocked = access === "vault" ? await isVaultUnlocked() : false;

  if (access === "vault" && !vaultUnlocked) {
    return (
      <section
        lang={locale}
        className="relative isolate min-h-screen overflow-hidden pb-20 pt-20"
      >
        <SectionBackground variant="blog" />
        <div className="site-container relative z-10 mx-auto w-full px-[1cm]">
          <BlogBackLink>
            {locale === "vi" ? "Quay lại Blog" : "Back to Blog"}
          </BlogBackLink>
          <VaultAccessPanel
            configured={isVaultConfigured()}
            className="mx-auto mt-8 max-w-2xl"
          />
        </div>
      </section>
    );
  }

  const [post, adjacent] = await Promise.all([
    getPostBySlug(slug, locale, { allowVault: vaultUnlocked }),
    getAdjacentPosts(slug, access),
  ]);

  if (!post) notFound();

  const readMinutes = post.readTime[locale];
  const tableOfContents = extractBlogTableOfContents(post.content);

  return (
    <section lang={locale} className="relative isolate min-h-screen overflow-x-clip pb-20 pt-24">
      <SectionBackground variant="blog" />
      <ReadingProgress targetId="article-body" />

      <article className="site-container relative z-10 mx-auto w-full px-[1cm]">
        <div className="mx-auto grid max-w-[100rem] gap-8 2xl:grid-cols-[minmax(0,1fr)_minmax(0,53rem)_minmax(0,1fr)] 2xl:items-start 2xl:gap-12">
          <BlogContactRail />
          <div className="mx-auto w-full max-w-[55rem] min-w-0 2xl:mx-0">
            <header className="border-b border-slate-200 pb-6 dark:border-slate-800">
              <ArticleBreadcrumb title={post.title[locale]} locale={locale} />

              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
                {post.tags.slice(0, 2).join(" · ")}
              </div>
              <h1 className="hyphens-auto text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-[2.75rem] sm:text-justify sm:[text-align-last:left] sm:[text-justify:inter-word] dark:text-slate-50">
                {post.title[locale]}
              </h1>
              <p className="mt-4 hyphens-auto text-lg leading-8 text-slate-600 sm:text-justify sm:[text-align-last:left] sm:[text-justify:inter-word] dark:text-slate-400">
                {post.excerpt[locale]}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <Image
                    src="/cover.jpg"
                    alt={locale === "vi" ? `Avatar của ${siteConfig.name}` : `${siteConfig.name}'s avatar`}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {siteConfig.name}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays aria-hidden="true" className="h-4 w-4 text-teal-500" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 aria-hidden="true" className="h-4 w-4 text-teal-500" />
                  {locale === "vi" ? `${readMinutes} phút đọc` : `${readMinutes} min read`}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-200/70 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div
              id="article-body"
              data-cursor="text"
              className="w-full py-8 text-[1.02rem] [&>:first-child]:mt-0 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200 [&_img]:dark:border-slate-800"
            >
              <MdxRenderer source={post.content} sourcePath={`${post.slug}/${locale}.mdx`} />
            </div>

            <nav aria-label={locale === "vi" ? "Bài viết liền kề" : "Adjacent articles"} className="grid gap-4 border-t border-slate-200 pt-8 md:grid-cols-2 dark:border-slate-800">
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
          </div>

          <BlogTableOfContents items={tableOfContents} locale={locale} />
        </div>
      </article>
    </section>
  );
}
