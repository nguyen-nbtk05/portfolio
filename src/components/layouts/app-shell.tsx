"use client";

import { useState } from "react";
import { Navbar } from "@/components/layouts/navbar";
import { SplashScreen } from "@/components/layouts/splash-screen";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [showApp, setShowApp] = useState(false);

  if (!showApp) {
    return <SplashScreen onComplete={() => setShowApp(true)} />;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </>
  );
}

