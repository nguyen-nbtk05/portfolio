export const LANGUAGES = ["en", "vi"] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGE_COOKIE_NAME = "portfolio-language";

export type Localized<T> = Record<Language, T>;

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && LANGUAGES.includes(value as Language);
}
