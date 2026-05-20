"use client";

import { cn } from "@/lib/utils";

export type SectionBackgroundVariant =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "contact";

type SectionBackgroundStyle = {
  baseClassName: string;
  textureClassName?: string;
  accentClassName?: string;
  edgeClassName?: string;
};

const SECTION_BACKGROUND_STYLES: Record<SectionBackgroundVariant, SectionBackgroundStyle> = {
  hero: {
    baseClassName:
      "bg-[radial-gradient(circle_at_12%_16%,rgba(251,191,36,0.12),transparent_36%),radial-gradient(circle_at_86%_12%,rgba(148,163,184,0.14),transparent_40%),linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(241,245,249,0.92)_58%,rgba(248,250,252,0.98)_100%)] dark:bg-[radial-gradient(circle_at_12%_16%,rgba(245,158,11,0.12),transparent_38%),radial-gradient(circle_at_86%_12%,rgba(100,116,139,0.18),transparent_42%),linear-gradient(180deg,rgba(2,6,23,0.96)_0%,rgba(15,23,42,0.94)_58%,rgba(2,6,23,0.98)_100%)]",
    accentClassName:
      "bg-[radial-gradient(circle_at_52%_76%,rgba(251,146,60,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_52%_76%,rgba(249,115,22,0.1),transparent_52%)]",
  },
  about: {
    baseClassName: "bg-slate-50 dark:bg-slate-950",
    textureClassName:
      "bg-[radial-gradient(circle_at_18%_22%,rgba(234,179,8,0.16),transparent_30%),radial-gradient(circle_at_82%_58%,rgba(100,116,139,0.16),transparent_34%),linear-gradient(135deg,rgba(100,116,139,0.12)_0_1px,transparent_1px_36px)] dark:bg-[radial-gradient(circle_at_18%_22%,rgba(234,179,8,0.12),transparent_30%),radial-gradient(circle_at_82%_58%,rgba(148,163,184,0.09),transparent_34%),linear-gradient(135deg,rgba(148,163,184,0.08)_0_1px,transparent_1px_36px)]",
    edgeClassName:
      "bg-gradient-to-r from-transparent via-yellow-500/45 to-transparent",
  },
  skills: {
    baseClassName:
      "bg-[linear-gradient(180deg,rgba(248,250,252,0.96)_0%,rgba(241,245,249,0.86)_100%)] dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.92)_0%,rgba(15,23,42,0.78)_100%)]",
    textureClassName:
      "bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.28)_1px,transparent_0)] bg-[size:20px_20px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.18)_1px,transparent_0)]",
    accentClassName:
      "bg-[radial-gradient(circle_at_80%_16%,rgba(251,191,36,0.18),transparent_38%),radial-gradient(circle_at_20%_88%,rgba(148,163,184,0.18),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_16%,rgba(251,191,36,0.14),transparent_40%),radial-gradient(circle_at_20%_88%,rgba(51,65,85,0.26),transparent_46%)]",
  },
  projects: {
    baseClassName:
      "bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(241,245,249,0.78)_100%)] dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.9)_0%,rgba(15,23,42,0.76)_100%)]",
    textureClassName:
      "bg-[linear-gradient(120deg,rgba(148,163,184,0.14)_0,transparent_46%),linear-gradient(30deg,rgba(148,163,184,0.11)_0,transparent_52%)] dark:bg-[linear-gradient(120deg,rgba(148,163,184,0.12)_0,transparent_52%),linear-gradient(30deg,rgba(71,85,105,0.22)_0,transparent_56%)]",
    accentClassName:
      "bg-[radial-gradient(circle_at_84%_18%,rgba(251,191,36,0.16),transparent_35%),radial-gradient(circle_at_18%_84%,rgba(148,163,184,0.16),transparent_38%)] dark:bg-[radial-gradient(circle_at_84%_18%,rgba(245,158,11,0.13),transparent_38%),radial-gradient(circle_at_18%_84%,rgba(100,116,139,0.2),transparent_42%)]",
  },
  contact: {
    baseClassName:
      "bg-[linear-gradient(180deg,rgba(255,251,235,0.7)_0%,rgba(248,250,252,0.92)_56%,rgba(248,250,252,0.96)_100%)] dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.62)_0%,rgba(15,23,42,0.86)_56%,rgba(2,6,23,0.94)_100%)]",
    textureClassName:
      "bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(circle_at_center,black_24%,transparent_76%)] dark:bg-[radial-gradient(circle_at_center,rgba(100,116,139,0.2)_1px,transparent_1px)]",
    accentClassName:
      "bg-[radial-gradient(circle_at_50%_42%,rgba(251,191,36,0.26),transparent_42%),radial-gradient(circle_at_68%_66%,rgba(251,146,60,0.14),transparent_40%)] dark:bg-[radial-gradient(circle_at_50%_42%,rgba(245,158,11,0.22),transparent_44%),radial-gradient(circle_at_68%_66%,rgba(249,115,22,0.14),transparent_46%)]",
    edgeClassName:
      "bg-gradient-to-r from-transparent via-amber-500/35 to-transparent",
  },
};

export function SectionBackground({ variant }: { variant: SectionBackgroundVariant }) {
  const style = SECTION_BACKGROUND_STYLES[variant];

  return (
    <>
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 -z-30", style.baseClassName)}
      />
      {style.textureClassName ? (
        <div
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 -z-20", style.textureClassName)}
        />
      ) : null}
      {style.accentClassName ? (
        <div
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 -z-10", style.accentClassName)}
        />
      ) : null}
      {style.edgeClassName ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 -z-10 h-px",
            style.edgeClassName,
          )}
        />
      ) : null}
    </>
  );
}
