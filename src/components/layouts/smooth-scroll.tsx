"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { LenisContext } from "@/hooks/use-lenis";
import { scrollToSection } from "@/lib/scroll-to-section";
import {
  canonicalizeHomeSectionHash,
  getCanonicalSectionHash,
  getHomeSectionIdFromHash,
  HOME_SECTION_IDS,
} from "@/lib/section-navigation";

// Section IDs in DOM order — these are magnetic snap targets
const SNAP_SECTION_IDS = HOME_SECTION_IDS;
const SNAP_SECTION_ID_SET = new Set<string>(SNAP_SECTION_IDS);

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

    setTimeout(() => {
      setLenis(instance);
    }, 0);

    // --- Magnetic snap: sections act like magnets ---
    // Cache section top positions (recompute on resize)
    let sectionTops: { id: string; top: number }[] = [];

    function computeSectionPositions() {
      sectionTops = [];
      for (const id of SNAP_SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) {
          // offsetTop gives absolute position relative to document
          let top = 0;
          let current: HTMLElement | null = el;
          while (current) {
            top += current.offsetTop;
            current = current.offsetParent as HTMLElement | null;
          }
          sectionTops.push({ id, top });
        }
      }
    }

    // Recompute section tops on the next animation frame so the browser has
    // finished any pending layout/paint work.
    let recomputeRaf = 0;
    const scheduleRecompute = () => {
      if (recomputeRaf) cancelAnimationFrame(recomputeRaf);
      recomputeRaf = requestAnimationFrame(() => {
        recomputeRaf = 0;
        computeSectionPositions();
      });
    };

    // Initial compute. On first paint the splash screen is still mounted and
    // the actual page sections are not in the DOM yet, so this will likely be
    // empty — the observer below will recompute as soon as they appear.
    computeSectionPositions();

    // Watch for the page sections being mounted after the splash screen exits.
    const sectionSelector = SNAP_SECTION_IDS.map((id) => `#${id}`).join(", ");
    const mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type !== "childList") continue;
        for (const node of record.addedNodes) {
          if (
            node instanceof Element &&
            ((node.id && SNAP_SECTION_ID_SET.has(node.id)) ||
              node.querySelector(sectionSelector))
          ) {
            scheduleRecompute();
            return;
          }
        }
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Fonts/images can shift layout and therefore section tops.
    if (document.fonts) {
      document.fonts.ready.then(scheduleRecompute);
    }

    window.addEventListener("resize", scheduleRecompute);

    let isSnapping = false;

    function onScroll() {
      if (isSnapping) return;

      const velocity = Math.abs(instance.velocity);
      const scroll = instance.scroll;

      // Only activate magnetic pull when scroll is decelerating
      // (velocity < 0.8 means user is almost completely stopped)
      if (velocity > 0.8) return;

      // Find the nearest section top
      let nearestTop = -1;
      let nearestDistance = Infinity;

      for (const section of sectionTops) {
        const distance = Math.abs(scroll - section.top);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestTop = section.top;
        }
      }

      // Magnetic zone: if within threshold, gently pull to exact position
      // Skip if already perfectly aligned (distance <= 1px)
      const MAGNETIC_ZONE = 50; // px — how close before the "magnet" activates
      if (nearestTop >= 0 && nearestDistance > 1 && nearestDistance <= MAGNETIC_ZONE) {
        isSnapping = true;
        instance.scrollTo(nearestTop, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            isSnapping = false;
          },
        });
        // Safety reset in case onComplete doesn't fire
        setTimeout(() => {
          isSnapping = false;
        }, 800);
      }
    }

    instance.on("scroll", onScroll);

    function raf(time: number) {
      instance.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }

    rafId.current = requestAnimationFrame(raf);

    return () => {
      mutationObserver.disconnect();
      if (recomputeRaf) cancelAnimationFrame(recomputeRaf);
      window.removeEventListener("resize", scheduleRecompute);
      instance.off("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
      instance.destroy();
    };
  }, []);

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

      // Next can restore the previous history-entry position after the route
      // commits. Reset once now and once on the next frame so the new route
      // starts at its header before its fade-in becomes visible.
      resetBlogScroll();
      const resetScrollRaf = requestAnimationFrame(resetBlogScroll);

      return () => cancelAnimationFrame(resetScrollRaf);
    }

    let hashScrollRaf = 0;
    let handledHashLocation: string | null = null;
    // Only a transition from another route to the homepage should jump to its
    // hash immediately. Checking the prior pathname avoids mistaking a navbar
    // click during Lenis startup for a cross-route navigation.
    let preferInstantHashScroll =
      pathname === "/" && previousPathname !== "/";

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

    // App Router changes are tracked by pathname. The observer covers delayed
    // section mounts, including the initial splash screen transition.
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
