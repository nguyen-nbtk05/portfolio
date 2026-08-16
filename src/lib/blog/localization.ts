import type { Language } from "../language";
import type { BlogLanguages, LocalizedText } from "./types";

export function getBlogContentLanguage(
  languages: BlogLanguages,
  preferredLanguage: Language,
): Language {
  return languages.includes(preferredLanguage)
    ? preferredLanguage
    : languages[0] ?? preferredLanguage;
}

export function getBlogText(
  value: LocalizedText,
  languages: BlogLanguages,
  preferredLanguage: Language,
): string {
  const contentLanguage = getBlogContentLanguage(languages, preferredLanguage);
  return value[contentLanguage] ?? "";
}
