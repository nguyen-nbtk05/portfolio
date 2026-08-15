"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionBackground, type SectionBackgroundVariant } from "@/components/ui/section-background";

const SECTION_BACKGROUND_VARIANTS = new Set<string>([
  "hero",
  "about",
  "skills",
  "projects",
  "blog",
  "contact",
]);

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  backgroundVariant?: SectionBackgroundVariant;
  "data-cursor"?: string;
}

export function Section({
  id,
  title,
  subtitle,
  children,
  className,
  headerClassName,
  titleClassName,
  subtitleClassName,
  backgroundVariant,
  "data-cursor": dataCursor,
}: SectionProps) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";
  const resolvedBackgroundVariant =
    backgroundVariant ??
    (SECTION_BACKGROUND_VARIANTS.has(id) ? (id as SectionBackgroundVariant) : undefined);

  return (
    <section
      id={id}
      data-cursor={dataCursor}
      className={cn(
        "flex min-h-[100svh] items-start pb-12 pt-12 sm:pb-16 sm:pt-16 lg:min-h-[100vh] lg:items-center lg:py-10",
        resolvedBackgroundVariant
          ? "relative isolate overflow-x-clip lg:overflow-hidden"
          : null,
        className,
      )}
    >
      {resolvedBackgroundVariant ? <SectionBackground variant={resolvedBackgroundVariant} /> : null}
      <div className="site-container relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-[1cm]">
        {(title || subtitle) && (
          <motion.div
            initial={initial}
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className={cn("mb-12 md:mb-16", headerClassName)}
          >
            {title && (
              <h2 className={cn("text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl mb-4", titleClassName)}>
                {title}
                <span className="text-teal-500">.</span>
              </h2>
            )}
            {subtitle && (
              <p
                className={cn(
                  "max-w-2xl text-lg text-slate-600 dark:text-slate-400",
                  subtitleClassName,
                )}
              >
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        <motion.div
          initial={initial}
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
