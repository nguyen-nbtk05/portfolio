"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ListTree } from "lucide-react";
import { useLenis } from "@/hooks/use-lenis";
import type { BlogTableOfContentsItem } from "@/lib/blog/heading-slug";

type BlogTableOfContentsProps = {
  items: BlogTableOfContentsItem[];
  locale: "en" | "vi";
};

export function BlogTableOfContents({
  items,
  locale,
}: BlogTableOfContentsProps) {
  const lenis = useLenis();
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const programmaticTargetRef = useRef<string | null>(null);
  const releaseTargetTimerRef = useRef(0);

  const handleItemClick = (
    event: MouseEvent<HTMLAnchorElement>,
    item: BlogTableOfContentsItem,
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const heading = document.getElementById(item.id);
    if (!heading) return;

    event.preventDefault();
    programmaticTargetRef.current = item.id;
    setActiveId(item.id);

    if (releaseTargetTimerRef.current) {
      window.clearTimeout(releaseTargetTimerRef.current);
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.hash = item.id;
    window.history.replaceState(
      window.history.state,
      "",
      `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`,
    );

    const scrollPadding = Number.parseFloat(
      window.getComputedStyle(document.documentElement).scrollPaddingTop,
    );
    if (lenis) {
      const targetOffset = Number.isFinite(scrollPadding) ? scrollPadding : 100;
      const distance = Math.abs(
        heading.getBoundingClientRect().top - targetOffset,
      );
      const duration = Math.min(0.85, Math.max(0.4, 0.35 + distance / 2_200));

      const releaseTarget = () => {
        if (programmaticTargetRef.current === item.id) {
          programmaticTargetRef.current = null;
          setActiveId(item.id);
        }
      };

      lenis.resize();
      lenis.scrollTo(heading, {
        duration,
        offset: 0,
        easing: (time) => 1 - Math.pow(1 - time, 4),
        onComplete: releaseTarget,
      });
      releaseTargetTimerRef.current = window.setTimeout(
        releaseTarget,
        duration * 1_000 + 200,
      );
      return;
    }

    const offset = Number.isFinite(scrollPadding) ? -scrollPadding : -100;
    const top = heading.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
    releaseTargetTimerRef.current = window.setTimeout(() => {
      programmaticTargetRef.current = null;
    }, 700);
  };

  useEffect(() => {
    let scrollRaf = 0;

    const updateActiveHeading = () => {
      scrollRaf = 0;

      if (programmaticTargetRef.current) {
        setActiveId(programmaticTargetRef.current);
        return;
      }

      const readingLine = window.innerHeight * 0.28;
      let nextActiveId = items[0]?.id ?? null;

      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (!heading) continue;

        if (heading.getBoundingClientRect().top <= readingLine) {
          nextActiveId = item.id;
        } else {
          break;
        }
      }

      setActiveId(nextActiveId);
    };

    const handleScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(updateActiveHeading);
    };

    updateActiveHeading();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (releaseTargetTimerRef.current) {
        window.clearTimeout(releaseTargetTimerRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="hidden 2xl:sticky 2xl:top-24 2xl:block 2xl:w-full 2xl:max-w-80 2xl:justify-self-start">
      <div className="rounded-2xl border border-slate-200/90 bg-white/75 p-5 shadow-sm shadow-slate-200/20 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/10">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
            <ListTree aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {locale === "vi" ? "Mục lục" : "On this page"}
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              {locale === "vi" ? "Nội dung bài viết" : "Article outline"}
            </p>
          </div>
        </div>

        <nav aria-label={locale === "vi" ? "Mục lục bài viết" : "Table of contents"}>
          <ol className="space-y-1">
            {items.map((item) => {
              const isActive = item.id === activeId;

              return (
                <li key={`${item.level}-${item.id}`} className={item.level === 3 ? "ml-3" : undefined}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => handleItemClick(event, item)}
                    aria-current={isActive ? "location" : undefined}
                    className={`block border-l-2 py-2 pl-3 text-sm font-medium leading-5 transition-[border-color,color,background-color] focus-visible:rounded-r-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                      isActive
                        ? "border-teal-500 bg-teal-50/70 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
                        : "border-slate-200 text-slate-500 hover:border-teal-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:text-slate-100"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </aside>
  );
}
