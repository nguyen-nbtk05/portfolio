export const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidBlogSlug(value: unknown): value is string {
  return typeof value === "string" && BLOG_SLUG_PATTERN.test(value);
}

export function slugifyBlogTitle(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[đĐ]/g, (character) => (character === "đ" ? "d" : "D"))
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
