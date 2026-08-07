export const BLOG_TABLET_BREAKPOINT = 768;
export const BLOG_DESKTOP_BREAKPOINT = 1024;

export function getBlogPageSize(viewportWidth: number) {
  if (viewportWidth >= BLOG_DESKTOP_BREAKPOINT) return 3;
  if (viewportWidth >= BLOG_TABLET_BREAKPOINT) return 2;
  return 1;
}

export function getBlogPageCount(itemCount: number, pageSize: number) {
  const safeItemCount = Math.max(0, Math.floor(itemCount));
  const safePageSize = Math.max(1, Math.floor(pageSize));

  return Math.max(1, Math.ceil(safeItemCount / safePageSize));
}

export function clampBlogPage(page: number, itemCount: number, pageSize: number) {
  const lastPage = getBlogPageCount(itemCount, pageSize) - 1;
  return Math.min(Math.max(0, Math.floor(page)), lastPage);
}

export function getBlogPageItems<T>(items: readonly T[], page: number, pageSize: number) {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const safePage = clampBlogPage(page, items.length, safePageSize);
  const start = safePage * safePageSize;

  return items.slice(start, start + safePageSize);
}
