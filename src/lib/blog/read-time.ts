import type { BlogReadTime, LocalizedText } from "./types";

export const DEFAULT_WORDS_PER_MINUTE = 200;

function markdownToCountableText(source: string): string {
  return source
    .replace(/^---\s*[\s\S]*?\s*---\s*/u, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/^\s*(?:import|export)\s.+$/gm, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/[`*_~>#|\-]+/g, " ");
}

export function countReadableWords(source: string): number {
  const words = markdownToCountableText(source).match(
    /[\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*/gu,
  );

  return words?.length ?? 0;
}

export function calculateReadTime(
  source: string,
  wordsPerMinute = DEFAULT_WORDS_PER_MINUTE,
): number {
  if (!Number.isFinite(wordsPerMinute) || wordsPerMinute <= 0) {
    throw new RangeError("wordsPerMinute must be a positive number");
  }

  const wordCount = countReadableWords(source);
  return wordCount === 0 ? 0 : Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function calculateLocalizedReadTime(
  content: LocalizedText,
): BlogReadTime {
  return Object.fromEntries(
    Object.entries(content).map(([locale, source]) => [
      locale,
      calculateReadTime(source),
    ]),
  ) as BlogReadTime;
}
