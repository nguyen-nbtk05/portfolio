"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { LenisContext } from "@/hooks/use-lenis";
import {
  getSectionScrollTop,
  scrollToSection,
} from "@/lib/scroll-to-section";
import {
  canonicalizeHomeSectionHash,
  getCanonicalSectionHash,
  getHomeSectionIdFromHash,
  HOME_SECTION_IDS,
} from "@/lib/section-navigation";

const SNAP_SECTION_IDS = HOME_SECTION_IDS;
const SNAP_SECTION_ID_SET = new Set<string>(SNAP_SECTION_IDS);
const MAGNETIC_ZONE = 50;
const SNAP_DURATION = 1.5;
const SNAP_RESET_DELAY_MS = 1_800;

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafId = useRef<number>(0);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.5,
    });

    const publishTimer = window.setTimeout(() => {
      setLenis(instance);
    }, 0);

    function raf(time: number) {
      instance.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }

    rafId.current = requestAnimationFrame(raf);

    return () => {
      window.clearTimeout(publishTimer);
      cancelAnimationFrame(rafId.current);
      instance.destroy();
    };
  }, []);

  useEffect(() => {
    if (!lenis || pathname !== "/") return;

    let sectionTops: number[] = [];
    let recomputeRaf = 0;
    let snapResetTimer = 0;
    let isSnapping = false;
    let isActive = true;

    const computeSectionPositions = () => {
      sectionTops = SNAP_SECTION_IDS.flatMap((id) => {
        const element = document.getElementById(id);

        return element ? [getSectionScrollTop(element)] : [];
      });
    };

    const scheduleRecompute = () => {
      if (!isActive) return;
      if (recomputeRaf) cancelAnimationFrame(recomputeRaf);
      recomputeRaf = requestAnimationFrame(() => {
        recomputeRaf = 0;
        computeSectionPositions();
      });
    };

    computeSectionPositions();

    const sectionSelector = SNAP_SECTION_IDS.map((id) => `#${id}`).join(", ");
    const mutationObserver = new MutationObserver((records) => {
      const hasSectionChange = records.some((record) =>
        [...record.addedNodes, ...record.removedNodes].some(
          (node) =>
            node instanceof Element &&
            ((node.id && SNAP_SECTION_ID_SET.has(node.id)) ||
              node.querySelector(sectionSelector)),
        ),
      );

      if (hasSectionChange) scheduleRecompute();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const resizeObserver = new ResizeObserver(scheduleRecompute);
    resizeObserver.observe(document.body);

    void document.fonts?.ready.then(scheduleRecompute);
    window.addEventListener("resize", scheduleRecompute);

    const onScroll = () => {
      if (isSnapping || Math.abs(lenis.velocity) > 0.8) return;

      let nearestTop = -1;
      let nearestDistance = Infinity;

      for (const sectionTop of sectionTops) {
        const distance = Math.abs(lenis.scroll - sectionTop);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestTop = sectionTop;
        }
      }

      if (
        nearestTop >= 0 &&
        nearestDistance > 1 &&
        nearestDistance <= MAGNETIC_ZONE
      ) {
        isSnapping = true;
        lenis.scrollTo(nearestTop, {
          duration: SNAP_DURATION,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            isSnapping = false;
          },
        });
        snapResetTimer = window.setTimeout(() => {
          isSnapping = false;
        }, SNAP_RESET_DELAY_MS);
      }
    };

    lenis.on("scroll", onScroll);

    return () => {
      isActive = false;
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      if (recomputeRaf) cancelAnimationFrame(recomputeRaf);
      if (snapResetTimer) window.clearTimeout(snapResetTimer);
      window.removeEventListener("resize", scheduleRecompute);
      lenis.off("scroll", onScroll);
    };
  }, [lenis, pathname]);

  useEffect(() => {
    if (!lenis) return;

    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    const isBlogRoute =
      pathname === "/blog" || /^\/blog\/[^/]+\/?$/.test(pathname);

    if (isBlogRoute && !window.location.hash) {
      const resetBlogScroll = () => {
        lenis.resize();
        lenis.scrollTo(0, { immediate: true, force: true });
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      };

      resetBlogScroll();
      const resetScrollRaf = requestAnimationFrame(resetBlogScroll);

      return () => cancelAnimationFrame(resetScrollRaf);
    }

    if (pathname !== "/") return;

    let hashScrollRaf = 0;
    let handledHashLocation: string | null = null;
    let preferInstantHashScroll = pathname === "/" && previousPathname !== "/";

    const scheduleHashScroll = (immediate = preferInstantHashScroll) => {
      if (!window.location.hash) {
        handledHashLocation = null;
        return;
      }

      const targetId = getHomeSectionIdFromHash(window.location.hash);
      if (!targetId) return;

      canonicalizeHomeSectionHash(targetId);

      const hashLocation = `${window.location.pathname}${window.location.search}${getCanonicalSectionHash(targetId)}`;
      if (handledHashLocation === hashLocation) return;

      if (hashScrollRaf) cancelAnimationFrame(hashScrollRaf);
      hashScrollRaf = requestAnimationFrame(() => {
        hashScrollRaf = 0;

        const target = document.getElementById(targetId);
        if (!target) return;

        handledHashLocation = hashLocation;
        scrollToSection(target, lenis, { immediate });
        preferInstantHashScroll = false;
      });
    };

    const handleHistoryNavigation = () => {
      preferInstantHashScroll = false;
      handledHashLocation = null;
      scheduleHashScroll(false);
    };

    scheduleHashScroll();

    const mutationObserver = new MutationObserver(() => scheduleHashScroll());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("hashchange", handleHistoryNavigation);
    window.addEventListener("popstate", handleHistoryNavigation);

    return () => {
      mutationObserver.disconnect();
      if (hashScrollRaf) cancelAnimationFrame(hashScrollRaf);
      window.removeEventListener("hashchange", handleHistoryNavigation);
      window.removeEventListener("popstate", handleHistoryNavigation);
    };
  }, [lenis, pathname]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
