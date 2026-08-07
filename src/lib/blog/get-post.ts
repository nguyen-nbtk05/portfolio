import { isLanguage, type Language } from "../language";
import {
  readBlogPostMeta,
  readRequiredLocalizedBodies,
  type BlogRepositoryOptions,
} from "./content";
import { calculateLocalizedReadTime } from "./read-time";
import { isValidBlogSlug } from "./slug";
import type { BlogPost } from "./types";

export interface GetBlogPostOptions extends BlogRepositoryOptions {
  allowVault?: boolean;
}

export async function getPostBySlug(
  slug: string,
  locale: Language,
  options: GetBlogPostOptions = {},
): Promise<BlogPost | null> {
  if (!isValidBlogSlug(slug) || !isLanguage(locale)) {
    return null;
  }

  try {
    const meta = await readBlogPostMeta(slug, options);
    if (
      !meta ||
      meta.status !== "published" ||
      (meta.access === "vault" && !options.allowVault)
    ) {
      return null;
    }

    const bodies = await readRequiredLocalizedBodies(slug, options);
    return {
      slug,
      ...meta,
      status: "published",
      tags: [...meta.tags],
      href: `/blog/${slug}`,
      readTime: calculateLocalizedReadTime(bodies),
      locale,
      content: bodies[locale],
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") throw error;

    console.error(`[blog] Unable to load article "${slug}".`);
    return null;
  }
}

export async function getPublishedPostAccess(
  slug: string,
  options: BlogRepositoryOptions = {},
) {
  if (!isValidBlogSlug(slug)) return null;

  try {
    const meta = await readBlogPostMeta(slug, options);
    return meta?.status === "published" ? meta.access : null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") throw error;

    console.error(`[blog] Unable to inspect article "${slug}".`);
    return null;
  }
}

export type { BlogRepositoryOptions } from "./content";
