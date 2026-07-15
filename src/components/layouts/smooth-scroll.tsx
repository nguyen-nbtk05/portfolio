"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { LenisContext } from "@/hooks/use-lenis";

// Section IDs in DOM order — these are magnetic snap targets
const SNAP_SECTION_IDS = ["hero", "about", "skills", "projects", "blog", "contact"];

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
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

    // Initial compute after DOM is ready
    const initTimer = setTimeout(computeSectionPositions, 300);
    window.addEventListener("resize", computeSectionPositions);

    let isSnapping = false;

    function onScroll() {
      if (isSnapping) return;

      const velocity = Math.abs(instance.velocity);
      const scroll = instance.scroll;

      // Only activate magnetic pull when scroll is decelerating
      // (velocity < 1 means user is almost done scrolling)
      if (velocity > 1.5) return;

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
      const MAGNETIC_ZONE = 100; // px — how close before the "magnet" activates
      if (nearestTop >= 0 && nearestDistance > 1 && nearestDistance <= MAGNETIC_ZONE) {
        isSnapping = true;
        instance.scrollTo(nearestTop, {
          duration: 1.2,
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
      clearTimeout(initTimer);
      window.removeEventListener("resize", computeSectionPositions);
      instance.off("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
      instance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}