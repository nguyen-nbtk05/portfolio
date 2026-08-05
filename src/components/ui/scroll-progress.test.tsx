import { act, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type Lenis from "lenis";
import { LenisContext } from "@/hooks/use-lenis";
import { ScrollProgress } from "@/components/ui/scroll-progress";

describe("ScrollProgress", () => {
  it("tracks Lenis progress from top to bottom", async () => {
    let scrollCallback: ((instance: Lenis) => void) | undefined;
    let currentProgress = 0;

    const fakeLenis = {
      limit: 1_000,
      get progress() {
        return currentProgress;
      },
      on: vi.fn((_event: string, callback: (instance: Lenis) => void) => {
        scrollCallback = callback;
        return vi.fn();
      }),
    } as unknown as Lenis;

    const { container } = render(
      <LenisContext.Provider value={fakeLenis}>
        <ScrollProgress />
      </LenisContext.Provider>,
    );

    const fill = container.querySelector("[data-scroll-progress-fill]");
    expect(fill).not.toBeNull();

    for (const value of [0, 0.5, 1]) {
      currentProgress = value;
      act(() => scrollCallback?.(fakeLenis));

      await waitFor(() => {
        expect(fill).toHaveStyle(
          `transform: ${value === 1 ? "none" : `scaleY(${value})`}`,
        );
      });
    }
  });

  it("does not intercept pointer interaction", () => {
    const { container } = render(<ScrollProgress />);

    expect(container.firstElementChild).toHaveClass("pointer-events-none");
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});
