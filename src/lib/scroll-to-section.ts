import type Lenis from "lenis";

const SECTION_SCROLL_DURATION = 1.2;

type ScrollToSectionOptions = {
  immediate?: boolean;
};

function getRootScrollPaddingTop() {
  const value = window.getComputedStyle(
    document.documentElement,
  ).scrollPaddingTop;
  const pixels = Number.parseFloat(value);

  return Number.isFinite(pixels) ? pixels : 0;
}

function getScrollMarginTop(target: HTMLElement) {
  const value = window.getComputedStyle(target).scrollMarginTop;
  const pixels = Number.parseFloat(value);

  return Number.isFinite(pixels) ? pixels : 0;
}

export function getSectionScrollTop(target: HTMLElement) {
  return Math.max(0, target.getBoundingClientRect().top + window.scrollY);
}

function getSectionAlignmentOffset(target: HTMLElement) {
  // Lenis subtracts these values for element targets. Compensate so a
  // full-page section still aligns exactly with the top of the viewport.
  return getRootScrollPaddingTop() + getScrollMarginTop(target);
}

export function scrollToSection(
  target: HTMLElement,
  scroller: Pick<Lenis, "resize" | "scrollTo"> | null,
  options: ScrollToSectionOptions = {},
) {
  const { immediate = false } = options;

  if (scroller) {
    const offset = getSectionAlignmentOffset(target);

    scroller.resize();
    scroller.scrollTo(
      target,
      immediate
        ? {
            force: true,
            immediate: true,
            offset,
          }
        : {
            duration: SECTION_SCROLL_DURATION,
            offset,
          },
    );
    return;
  }

  window.scrollTo({
    top: Math.max(
      0,
      getSectionScrollTop(target) - getSectionAlignmentOffset(target),
    ),
    behavior: immediate ? "auto" : "smooth",
  });
}
