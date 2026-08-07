import type { BlogAccess, BlogPostMeta } from "./types";

export function isVisiblePostForAccess(
  meta: BlogPostMeta,
  access: BlogAccess,
) {
  return meta.status !== "draft" && meta.access === access;
}
