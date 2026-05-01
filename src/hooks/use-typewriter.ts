"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

interface UseTypewriterOptions {
  text?: string;
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  startDelay?: number;
}

export function useTypewriter({
  text,
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseDuration = 1200,
  startDelay = 300,
}: UseTypewriterOptions) {
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

  return {
    displayedText: reduceMotion ? currentWord : displayed,
    hasCursor: !reduceMotion,
    longestWordLength,
    wordList,
  };
}
