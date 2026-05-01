"use client";

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
      className={cn("inline-flex max-w-full items-center whitespace-nowrap", className)}
      style={{ minWidth: `${longestWordLength}ch`, minHeight: "1em" }}
      aria-live="polite"
    >
      <span>{displayedText}</span>
      {hasCursor && (
        <span
          aria-hidden="true"
          className={cn(
            "ml-1 inline-block h-[0.88em] w-[0.08em] animate-pulse rounded-sm bg-amber-400 align-[-0.05em] dark:bg-amber-300",
            cursorClassName
          )}
        />
      )}
    </span>
  );
}
