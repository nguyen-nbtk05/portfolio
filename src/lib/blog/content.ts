import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import type { Language, Localized } from "../language";
import { isValidBlogSlug } from "./slug";
import type { BlogPostMeta } from "./types";
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
  options: BlogRepositoryOptions = {},
): Promise<Localized<string>> {
  const [en, vi] = await Promise.all([
    readBlogPostBody(slug, "en", options),
    readBlogPostBody(slug, "vi", options),
  ]);

  if (en === null || !hasSubstantiveBlogBody(en)) {
    throw new BlogContentError(
      `Published blog post "${slug}" requires substantive en.mdx content`,
    );
  }

  if (vi === null || !hasSubstantiveBlogBody(vi)) {
    throw new BlogContentError(
      `Published blog post "${slug}" requires substantive vi.mdx content`,
    );
  }

  return { en, vi };
}
