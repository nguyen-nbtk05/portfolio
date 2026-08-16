import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import type { Language } from "../language";
import type { BlogLanguages, BlogPostMeta, LocalizedText } from "./types";
import { isValidBlogSlug } from "./slug";
import { parseBlogPostMeta } from "./validation";

export interface BlogRepositoryOptions {
  contentDirectory?: string;
}

export const DEFAULT_BLOG_CONTENT_DIRECTORY = path.join(
  process.cwd(),
  "src/content/blog",
);

export class BlogContentError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "BlogContentError";
  }
}

function hasSubstantiveBlogBody(source: string): boolean {
  const withoutSkeleton = source
    .replace(/^\s*#{1,6}\s+.*$/gm, " ")
    .replace(/Write the article here\./giu, " ")
    .replace(/Viết nội dung bài viết tại đây\./giu, " ")
    .replace(/\.\.\./g, " ")
    .replace(/[`*_>#~|\-]/g, " ");

  return /[\p{L}\p{N}]/u.test(withoutSkeleton);
}

function hasErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === code
  );
}

export function resolveBlogContentDirectory(
  options: BlogRepositoryOptions = {},
): string {
  return options.contentDirectory
    ? path.resolve(/* turbopackIgnore: true */ options.contentDirectory)
    : DEFAULT_BLOG_CONTENT_DIRECTORY;
}

function resolveArticleDirectory(
  slug: string,
  options: BlogRepositoryOptions,
): string | null {
  if (!isValidBlogSlug(slug)) {
    return null;
  }

  const contentDirectory = resolveBlogContentDirectory(options);
  const articleDirectory = path.resolve(contentDirectory, slug);
  const relativePath = path.relative(contentDirectory, articleDirectory);

  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath) ||
    relativePath !== slug
  ) {
    return null;
  }

  return articleDirectory;
}

export async function listArticleSlugs(
  options: BlogRepositoryOptions = {},
): Promise<string[]> {
  const contentDirectory = resolveBlogContentDirectory(options);
  let entries;

  try {
    entries = await readdir(contentDirectory, { withFileTypes: true });
  } catch (error) {
    throw new BlogContentError(
      `Unable to read the blog content directory: ${contentDirectory}`,
      { cause: error },
    );
  }

  const slugs: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (!isValidBlogSlug(entry.name)) {
      throw new BlogContentError(
        `Invalid blog directory slug "${entry.name}" in ${contentDirectory}`,
      );
    }

    slugs.push(entry.name);
  }

  return slugs.sort((left, right) => left.localeCompare(right));
}

export async function readBlogPostMeta(
  slug: string,
  options: BlogRepositoryOptions = {},
): Promise<BlogPostMeta | null> {
  const articleDirectory = resolveArticleDirectory(slug, options);
  if (!articleDirectory) {
    return null;
  }

  const metadataPath = path.join(articleDirectory, "meta.json");
  let source: string;

  try {
    source = await readFile(metadataPath, "utf8");
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) {
      return null;
    }

    throw new BlogContentError(`Unable to read ${metadataPath}`, { cause: error });
  }

  let value: unknown;
  try {
    value = JSON.parse(source) as unknown;
  } catch (error) {
    throw new BlogContentError(`Malformed JSON in ${metadataPath}`, {
      cause: error,
    });
  }

  try {
    return parseBlogPostMeta(value, metadataPath);
  } catch (error) {
    throw new BlogContentError(
      error instanceof Error ? error.message : `Invalid metadata in ${metadataPath}`,
      { cause: error },
    );
  }
}

export async function readBlogPostBody(
  slug: string,
  locale: Language,
  options: BlogRepositoryOptions = {},
): Promise<string | null> {
  const articleDirectory = resolveArticleDirectory(slug, options);
  if (!articleDirectory) {
    return null;
  }

  const bodyPath = path.join(articleDirectory, `${locale}.mdx`);
  try {
    return await readFile(bodyPath, "utf8");
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) {
      return null;
    }

    throw new BlogContentError(`Unable to read ${bodyPath}`, { cause: error });
  }
}

export async function readRequiredLocalizedBodies(
  slug: string,
  languages: BlogLanguages,
  options: BlogRepositoryOptions = {},
): Promise<LocalizedText> {
  const entries = await Promise.all(
    languages.map(async (locale) => {
      const body = await readBlogPostBody(slug, locale, options);
      if (body === null || !hasSubstantiveBlogBody(body)) {
        throw new BlogContentError(
          `Published blog post "${slug}" requires substantive ${locale}.mdx content`,
        );
      }
      return [locale, body] as const;
    }),
  );

  return Object.fromEntries(entries) as LocalizedText;
}
