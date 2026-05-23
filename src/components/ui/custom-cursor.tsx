"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type CursorType = "default" | "pointer" | "text";

const TEXT_TAGS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "span",
  "li",
  "input",
  "textarea",
  "label",
]);

const CURSOR_IMAGE: Record<CursorType, string> = {
  default: "/cursors/default.png",
  pointer: "/cursors/pointer.png",
  text: "/cursors/xterm.png",
};

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const [supportsFinePointer, setSupportsFinePointer] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const syncPointerSupport = () => setSupportsFinePointer(mediaQuery.matches);
    syncPointerSupport();

    mediaQuery.addEventListener("change", syncPointerSupport);
    return () => mediaQuery.removeEventListener("change", syncPointerSupport);
  }, []);

  useEffect(() => {
    if (!supportsFinePointer) return;

    const updateMousePosition = (event: MouseEvent) => {
      pointerRef.current.x = event.clientX - 2;
      pointerRef.current.y = event.clientY - 2;

      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }

      const renderCursor = () => {
        const element = cursorRef.current;
        if (!element) return;
        element.style.transform = `translate3d(${pointerRef.current.x}px, ${pointerRef.current.y}px, 0)`;
        frameRef.current = null;
      };

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(renderCursor);
      }
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      let nextType: CursorType = "default";
      const computedCursor = window.getComputedStyle(target).cursor;
      const tagName = target.tagName.toLowerCase();

      if (
        target.closest("a, button, [role='button'], [data-cursor='pointer']") ||
        computedCursor === "pointer"
      ) {
        nextType = "pointer";
      } else if (target.closest("[data-cursor='default']")) {
        nextType = "default";
      } else if (
        target.closest("input, textarea, [contenteditable='true']") ||
        computedCursor === "text" ||
        computedCursor === "vertical-text" ||
        TEXT_TAGS.has(tagName)
      ) {
        nextType = "text";
      }

      setCursorType((current) => (current === nextType ? current : nextType));
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };

    window.addEventListener("mousemove", updateMousePosition, {
      passive: true,
    });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [supportsFinePointer]);

  if (!supportsFinePointer) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none fixed left-0 top-0 z-[9999] h-6 w-6 will-change-transform ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-150`}
      style={{ transform: "translateZ(0)" }}
      aria-hidden
    >
      <Image
        src={CURSOR_IMAGE[cursorType]}
        alt=""
        width={24}
        height={24}
        draggable={false}
        unoptimized
        className={`h-6 w-6 select-none object-contain transition-transform duration-150 ${
          cursorType === "pointer" ? "scale-105" : "scale-100"
        }`}
      />
    </div>
  );
}
