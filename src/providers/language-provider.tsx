"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  isLanguage,
  type Language,
} from "@/lib/language";

export type { Language } from "@/lib/language";

const LANGUAGE_STORAGE_KEY = "language";
const LANGUAGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readLanguageCookie(): Language | undefined {
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LANGUAGE_COOKIE_NAME}=`));

  if (!cookie) return undefined;

  try {
    const value = decodeURIComponent(cookie.slice(cookie.indexOf("=") + 1));
    return isLanguage(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

function readStoredLanguage(): Language | undefined {
  const value = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isLanguage(value) ? value : undefined;
}

function persistLanguage(language: Language) {
  const storageChanged = readStoredLanguage() !== language;
  const cookieLanguage = readLanguageCookie();
  const cookieChanged = cookieLanguage !== language;
  const serverLanguageChanged =
    (cookieLanguage ?? DEFAULT_LANGUAGE) !== language;

  if (storageChanged) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  if (cookieChanged) {
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(language)}; Path=/; Max-Age=${LANGUAGE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  }

  document.documentElement.lang = language;

  return { serverLanguageChanged };
}

function isBlogPath(pathname: string) {
  return pathname === "/blog" || pathname.startsWith("/blog/");
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  lang: <T>(dict: Record<Language, T>) => T;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;

      const selectedLanguage =
        readStoredLanguage() ?? readLanguageCookie() ?? DEFAULT_LANGUAGE;
      const { serverLanguageChanged } = persistLanguage(selectedLanguage);

      setLanguage(selectedLanguage);
      setMounted(true);

      if (serverLanguageChanged && isBlogPath(pathname)) {
        router.refresh();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  const handleSetLanguage = useCallback(
    (nextLanguage: Language) => {
      const languageChanged = nextLanguage !== language;
      const { serverLanguageChanged } = persistLanguage(nextLanguage);

      if (languageChanged) {
        setLanguage(nextLanguage);
      }

      if ((languageChanged || serverLanguageChanged) && isBlogPath(pathname)) {
        router.refresh();
      }
    },
    [language, pathname, router],
  );

  const lang = useCallback(
    <T,>(dict: Record<Language, T>): T => dict[language],
    [language],
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage: handleSetLanguage, lang }),
    [handleSetLanguage, lang, language],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}
