import {
  BlogContentError,
  listArticleSlugs,
  readBlogPostMeta,
  readRequiredLocalizedBodies,
  type BlogRepositoryOptions,
} from "./content";
import { calculateLocalizedReadTime } from "./read-time";
import type {
  AdjacentBlogPosts,
  BlogPostMeta,
  BlogPostSummary,
} from "./types";

async function createSummary(
  slug: string,
  meta: BlogPostMeta,
  options: BlogRepositoryOptions,
): Promise<BlogPostSummary> {
  if (meta.status !== "published") {
    return {
      slug,
      ...meta,
      tags: [...meta.tags],
      href: null,
      readTime: null,
    };
  }

  const bodies = await readRequiredLocalizedBodies(slug, options);
  return {
    slug,
    ...meta,
    tags: [...meta.tags],
    href: `/blog/${slug}`,
    readTime: calculateLocalizedReadTime(bodies),
  };
}

export async function getAllPosts(
  options: BlogRepositoryOptions = {},
): Promise<BlogPostSummary[]> {
  const slugs = await listArticleSlugs(options);
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const meta = await readBlogPostMeta(slug, options);
        if (!meta) {
          throw new BlogContentError(
            `Blog article directory "${slug}" is missing meta.json`,
          );
        }

        return meta.status === "draft"
          ? null
          : createSummary(slug, meta, options);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") throw error;

        console.error(`[blog] Skipping invalid article "${slug}".`);
        return null;
      }
    }),
  );

  return posts
    .filter((post): post is BlogPostSummary => post !== null)
    .sort((left, right) => {
      const dateOrder = right.publishedAt.localeCompare(left.publishedAt);
      return dateOrder || left.slug.localeCompare(right.slug);
    });
}

export async function getAdjacentPosts(
  slug: string,
  options: BlogRepositoryOptions = {},
): Promise<AdjacentBlogPosts> {
  const posts = (await getAllPosts(options)).filter(
    (post) => post.status === "published",
  );
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

export async function getPublishedSlugs(
  options: BlogRepositoryOptions = {},
): Promise<string[]> {
  return (await getAllPosts(options))
    .filter((post) => post.status === "published")
    .map((post) => post.slug);
}

export async function getAllTags(
  options: BlogRepositoryOptions = {},
): Promise<string[]> {
  const tags = (await getAllPosts(options)).flatMap((post) => post.tags);
  return [...new Set(tags)].sort((left, right) => left.localeCompare(right));
}

export type { BlogRepositoryOptions } from "./content";
