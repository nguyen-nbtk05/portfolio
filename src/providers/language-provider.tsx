"use client";

import React, { createContext, useEffect, useState } from "react";

export type Language = "en" | "vi";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  lang: <T>(dict: Record<Language, T>) => T;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      const saved = localStorage.getItem("language") as Language;
      if (saved === "en" || saved === "vi") {
        setLanguage(saved);
      }
      setMounted(true);
    });
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const lang = <T,>(dict: Record<Language, T>): T => {
    return dict[language];
  };

  // Provide default context even during SSR
  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, lang }}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}
