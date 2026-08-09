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

export function scrollToSection(
  target: HTMLElement,
  scroller: Pick<Lenis, "resize" | "scrollTo"> | null,
  options: ScrollToSectionOptions = {},
) {
  const { immediate = false } = options;

  if (scroller) {
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
