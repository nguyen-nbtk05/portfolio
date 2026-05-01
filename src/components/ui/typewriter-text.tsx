"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

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
  const reduceMotion = useReducedMotion();
  const timeoutRef = useRef<number | null>(null);
  const wordList = useMemo(() => {
    const candidates = words?.length ? words : [text ?? ""];
    return candidates.map((word) => word.trim()).filter(Boolean);
  }, [text, words]);
  const [displayed, setDisplayed] = useState(reduceMotion ? wordList[0] ?? "" : "");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const longestWordLength = Math.max(...wordList.map((word) => word.length), 1);
  const currentWord = wordList[wordIndex % wordList.length] ?? "";

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (reduceMotion || wordList.length === 0) {
      return;
    }

    const canCycle = wordList.length > 1;
    let delay = typingSpeed;

    if (!isDeleting && charIndex < currentWord.length) {
      delay = charIndex === 0 ? startDelay : typingSpeed;
      timeoutRef.current = window.setTimeout(() => {
        const nextIndex = charIndex + 1;
        setDisplayed(currentWord.slice(0, nextIndex));
        setCharIndex(nextIndex);
      }, delay);
    } else if (!isDeleting && charIndex === currentWord.length) {
      if (!canCycle) return;
      timeoutRef.current = window.setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && charIndex > 0) {
      delay = deletingSpeed;
      timeoutRef.current = window.setTimeout(() => {
        const nextIndex = charIndex - 1;
        setDisplayed(currentWord.slice(0, nextIndex));
        setCharIndex(nextIndex);
      }, delay);
    } else if (isDeleting && charIndex === 0) {
      timeoutRef.current = window.setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((index) => (index + 1) % wordList.length);
      }, Math.min(pauseDuration, 500));
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    charIndex,
    currentWord,
    deletingSpeed,
    isDeleting,
    pauseDuration,
    reduceMotion,
    startDelay,
    typingSpeed,
    wordList.length,
  ]);

  if (wordList.length === 0) return null;
  const renderedText = reduceMotion ? currentWord : displayed;

  return (
    <span
      className={cn("inline-flex max-w-full items-center whitespace-nowrap", className)}
      style={{ minWidth: `${longestWordLength}ch`, minHeight: "1em" }}
      aria-live="polite"
    >
      <span>{renderedText}</span>
      {!reduceMotion && (
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
