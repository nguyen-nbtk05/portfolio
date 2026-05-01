"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { SplashScreen } from "@/components/layouts/splash-screen";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const fallbackId = window.setTimeout(() => {
      setShowApp(true);
    }, 3200);

    return () => window.clearTimeout(fallbackId);
  }, []);

  if (!showApp) {
    return <SplashScreen onComplete={() => setShowApp(true)} />;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
