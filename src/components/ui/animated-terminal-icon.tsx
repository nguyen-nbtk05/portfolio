"use client";

import { Terminal } from "lucide-react";
import { motion } from "motion/react";

interface AnimatedTerminalIconProps {
  reduceMotion?: boolean | null;
  className?: string;
}

export function AnimatedTerminalIcon({
  reduceMotion,
  className = "h-4 w-4 text-teal-500",
}: AnimatedTerminalIconProps) {
  return (
    <motion.span
      aria-hidden="true"
      animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="flex shrink-0"
    >
      <Terminal className={className} />
    </motion.span>
  );
}
