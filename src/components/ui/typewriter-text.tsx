"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useTypewriter } from "@/hooks/use-typewriter";

interface TypewriterTextProps {
  text?: string;
  words?: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  startDelay?: number;
  cursorClassName?: string;
}

export function TypewriterText({
  text,
  words,
  className,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseDuration = 1200,
  startDelay = 300,
  cursorClassName,
}: TypewriterTextProps) {
  const { displayedText, hasCursor, longestWordLength, wordList } = useTypewriter({
    text,
    words,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    startDelay,
  });

  if (wordList.length === 0) return null;

  return (
    <span
      className={cn(
        "flex w-full max-w-full min-w-0 items-center justify-center whitespace-normal lg:inline-flex lg:w-auto lg:min-w-[var(--typewriter-min-width)] lg:flex-nowrap lg:justify-start lg:whitespace-nowrap",
        className,
      )}
      style={
        {
          "--typewriter-min-width": `${longestWordLength}ch`,
          minHeight: "1em",
        } as CSSProperties
      }
      aria-live="polite"
    >
      <span className="min-w-0 break-words">{displayedText}</span>
      {hasCursor && (
        <span
          aria-hidden="true"
          className={cn(
            "ml-1 inline-block h-[0.88em] w-[0.08em] shrink-0 self-center animate-pulse rounded-sm bg-teal-400 dark:bg-teal-300",
            cursorClassName
          )}
        />
      )}
    </span>
  );
}
