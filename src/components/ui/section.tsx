"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      <div className="container mx-auto px-[1cm]">
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
                <span className="text-yellow-500">.</span>
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
