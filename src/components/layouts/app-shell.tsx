"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layouts/navbar";
import { SplashScreen } from "@/components/layouts/splash-screen";
import { useLenis } from "@/hooks/use-lenis";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [showApp, setShowApp] = useState(false);
  const [targetSection, setTargetSection] = useState<string | undefined>(undefined);
  const lenis = useLenis();

  useEffect(() => {
    if (showApp && targetSection) {
      // Small delay to allow the elements to fully mount and layout
      const timer = setTimeout(() => {
        const targetEl = document.getElementById(targetSection);
        if (targetEl) {
          const offsetValue = 100;
          if (lenis) {
            lenis.scrollTo(targetEl, { duration: 1.2, offset: offsetValue });
          } else {
            const top = targetEl.getBoundingClientRect().top + window.scrollY - offsetValue;
            window.scrollTo({ top, behavior: "smooth" });
          }
          window.history.pushState(null, "", `#${targetSection}`);
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [showApp, targetSection, lenis]);

  if (!showApp) {
    return (
      <SplashScreen
        onComplete={(section) => {
          setTargetSection(section);
          setShowApp(true);
        }}
      />
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
