"use client";

import * as React from "react";

type ThemeMode = "light" | "dark";
type ThemePreference = ThemeMode | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: ThemePreference;
  enableSystem?: boolean;
  storageKey?: string;
  disableTransitionOnChange?: boolean;
}

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*{-webkit-transition:none !important;transition:none !important;}",
    ),
  );
  document.head.appendChild(style);

  return () => {
    window.getComputedStyle(document.body);
    document.head.removeChild(style);
  };
}

function applyResolvedTheme(attribute: "class" | "data-theme", resolved: ThemeMode) {
  const root = document.documentElement;
  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    return;
  }
  root.setAttribute(attribute, resolved);
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const resolveTheme = (preference: ThemePreference): ThemeMode => {
      if (preference !== "system") {
        return preference;
      }

      if (!enableSystem) {
        return defaultTheme === "dark" ? "dark" : "light";
      }

      return media.matches ? "dark" : "light";
    };

    const getStoredPreference = (): ThemePreference | null => {
      const stored = window.localStorage.getItem(storageKey);
      return isThemePreference(stored) ? stored : null;
    };

    const applyPreference = (preference: ThemePreference, withTransitionControl: boolean) => {
      const resolved = resolveTheme(preference);

      if (!disableTransitionOnChange || !withTransitionControl) {
        applyResolvedTheme(attribute, resolved);
        return;
      }

      const restoreTransitions = disableTransitionsTemporarily();
      applyResolvedTheme(attribute, resolved);
      window.setTimeout(restoreTransitions, 0);
    };

    const currentPreference = getStoredPreference() ?? defaultTheme;
    applyPreference(currentPreference, false);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== storageKey) return;
      const nextPreference = getStoredPreference() ?? defaultTheme;
      applyPreference(nextPreference, true);
    };

    const handleSystemChange = () => {
      const nextPreference = getStoredPreference() ?? defaultTheme;
      if (nextPreference === "system") {
        applyPreference("system", true);
      }
    };

    window.addEventListener("storage", handleStorage);
    media.addEventListener("change", handleSystemChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      media.removeEventListener("change", handleSystemChange);
    };
  }, [attribute, defaultTheme, disableTransitionOnChange, enableSystem, storageKey]);

  return <>{children}</>;
}
