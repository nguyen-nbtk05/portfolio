import type { Language, Localized } from "../language";

export const BLOG_STATUSES = ["published", "draft", "comingSoon"] as const;
export const BLOG_ACCESS_LEVELS = ["public", "vault"] as const;

export type BlogStatus = (typeof BLOG_STATUSES)[number];
export type BlogAccess = (typeof BLOG_ACCESS_LEVELS)[number];

export type LocalizedText = Localized<string>;

export type BlogReadTime = Localized<number>;

export interface BlogPostMeta {
  title: LocalizedText;
  excerpt: LocalizedText;
  publishedAt: string;
  tags: string[];
  featured: boolean;
  status: BlogStatus;
  access: BlogAccess;
}

export interface BlogPostSummary extends BlogPostMeta {
  slug: string;
  href: string | null;
  readTime: BlogReadTime | null;
}

export interface BlogPost
  extends Omit<BlogPostSummary, "href" | "readTime" | "status"> {
  status: "published";
  href: string;
  readTime: BlogReadTime;
  locale: Language;
  content: string;
}

export interface AdjacentBlogPosts {
  /** The next older published article. */
  previous: BlogPostSummary | null;
  /** The next newer published article. */
  next: BlogPostSummary | null;
}
