"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "@/components/layouts/navbar";
import { SplashScreen } from "@/components/layouts/splash-screen";
import { BackToTopButton } from "@/components/ui/back-to-top-button";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import {
  ROUTE_FADE_EASE,
  ROUTE_FADE_IN_SECONDS,
} from "@/lib/route-transition";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [showApp, setShowApp] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (!showApp) {
    return <SplashScreen onComplete={() => setShowApp(true)} />;
  }

  return (
    <>
      <Navbar />
      <motion.main
        key={pathname}
        className="min-h-screen"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduceMotion ? 0 : ROUTE_FADE_IN_SECONDS,
          ease: ROUTE_FADE_EASE,
        }}
      >
        {children}
      </motion.main>
      <ScrollProgress />
      <BackToTopButton />
    </>
  );
}

