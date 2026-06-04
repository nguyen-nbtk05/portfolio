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
  "contact",
]);

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  backgroundVariant?: SectionBackgroundVariant;
}

export function Section({
  id,
  title,
  subtitle,
  children,
  className,
  backgroundVariant,
}: SectionProps) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";
  const resolvedBackgroundVariant =
    backgroundVariant ??
    (SECTION_BACKGROUND_VARIANTS.has(id) ? (id as SectionBackgroundVariant) : undefined);

  return (
    <section
      id={id}
      className={cn(
        "flex min-h-[100vh] items-center py-6 sm:py-8 lg:py-10",
        resolvedBackgroundVariant ? "relative isolate overflow-hidden" : null,
        className,
      )}
    >
      {resolvedBackgroundVariant ? <SectionBackground variant={resolvedBackgroundVariant} /> : null}
      <div className="container relative z-10 mx-auto px-[1cm] w-full">
        {(title || subtitle) && (
          <motion.div
            initial={initial}
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mb-12 md:mb-16"
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {title}
                <span className="text-teal-500">.</span>
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
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
