"use client";

import { useLanguage } from "@/providers/language-provider";
import { useEffect, useState } from "react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "vi" : "en")}
      className="cursor-pointer px-2 py-1.5 text-sm font-medium rounded-md hover:bg-slate-200 hover:text-yellow-500 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle language"
    >
      {language === "en" ? "VI" : "EN"}
    </button>
  );
}
