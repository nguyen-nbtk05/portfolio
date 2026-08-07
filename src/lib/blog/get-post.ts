import { isLanguage, type Language } from "../language";
import {
  readBlogPostMeta,
  readRequiredLocalizedBodies,
  type BlogRepositoryOptions,
} from "./content";
import { calculateLocalizedReadTime } from "./read-time";
import { isValidBlogSlug } from "./slug";
import type { BlogPost } from "./types";

export async function getPostBySlug(
  slug: string,
  locale: Language,
  options: BlogRepositoryOptions = {},
): Promise<BlogPost | null> {
  if (!isValidBlogSlug(slug) || !isLanguage(locale)) {
    return null;
  }

  try {
    const meta = await readBlogPostMeta(slug, options);
    if (!meta || meta.status !== "published") {
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

export type { BlogRepositoryOptions } from "./content";
