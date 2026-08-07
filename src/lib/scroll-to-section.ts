import type Lenis from "lenis";

const SECTION_SCROLL_DURATION = 1.2;

type ScrollToSectionOptions = {
  immediate?: boolean;
};

function getRootScrollPaddingTop() {
  const value = window.getComputedStyle(document.documentElement).scrollPaddingTop;
  const pixels = Number.parseFloat(value);

  return Number.isFinite(pixels) ? pixels : 0;
}

/**
 * Align a full-height page section with the viewport start. Lenis subtracts
 * the root scroll padding for element targets, so add that same computed value
 * back to preserve the section alignment used by the magnetic snap behavior.
 */
export function scrollToSection(
  target: HTMLElement,
  scroller: Pick<Lenis, "resize" | "scrollTo"> | null,
  options: ScrollToSectionOptions = {},
) {
  const { immediate = false } = options;

  if (scroller) {
    // App Router can replace a short page with the much taller homepage before
    // Lenis' debounced ResizeObserver refreshes its scroll limit. Refresh it
    // synchronously so the target is not clamped to the previous route height.
    scroller.resize();
    scroller.scrollTo(
      target,
      immediate
        ? {
            force: true,
            immediate: true,
            offset: getRootScrollPaddingTop(),
          }
        : {
            duration: SECTION_SCROLL_DURATION,
            offset: getRootScrollPaddingTop(),
          },
    );
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}
