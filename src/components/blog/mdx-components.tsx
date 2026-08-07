import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";

type HeadingProps = ComponentPropsWithoutRef<"h2">;

function MdxLink({ href, className, ...props }: ComponentPropsWithoutRef<"a">) {
  const isExternal = href?.startsWith("http://") || href?.startsWith("https://");

  return (
    <a
      href={href}
      className={cn(
        "font-medium text-teal-600 underline decoration-teal-500/35 underline-offset-4 transition-colors hover:text-teal-500 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-teal-400 dark:hover:text-teal-300",
        className,
      )}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      {...props}
    />
  );
}

function MdxTable({ className, ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table
        className={cn("w-full min-w-[36rem] border-collapse text-left text-sm", className)}
        {...props}
      />
    </div>
  );
}

const headingClassName =
  "scroll-mt-28 font-bold tracking-tight text-slate-950 dark:text-slate-50";

export const mdxComponents: MDXComponents = {
  h1: ({ className, ...props }: HeadingProps) => (
    <h1
      className={cn(headingClassName, "mb-5 mt-12 text-3xl sm:text-4xl", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: HeadingProps) => (
    <h2
      className={cn(headingClassName, "mb-4 mt-12 text-2xl sm:text-3xl", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className={cn(headingClassName, "mb-3 mt-9 text-xl sm:text-2xl", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p
      className={cn("my-5 leading-8 text-slate-700 dark:text-slate-300", className)}
      {...props}
    />
  ),
  a: MdxLink,
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className={cn("my-5 list-disc space-y-2 pl-6 text-slate-700 marker:text-teal-500 dark:text-slate-300", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className={cn("my-5 list-decimal space-y-2 pl-6 text-slate-700 marker:font-semibold marker:text-teal-600 dark:text-slate-300 dark:marker:text-teal-400", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className={cn("pl-1 leading-7", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className={cn(
        "my-8 border-l-2 border-teal-500 bg-teal-50/70 px-5 py-3 italic text-slate-700 dark:bg-teal-500/5 dark:text-slate-300",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => (
    <code
      className={cn(
        "rounded bg-slate-200/75 px-1.5 py-0.5 font-mono text-[0.9em] text-teal-800 dark:bg-slate-800 dark:text-teal-200",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className={cn(
        "my-8 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100 shadow-lg shadow-slate-950/10 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit",
        className,
      )}
      {...props}
    />
  ),
  table: MdxTable,
  thead: ({ className, ...props }: ComponentPropsWithoutRef<"thead">) => (
    <thead className={cn("bg-slate-100 dark:bg-slate-900", className)} {...props} />
  ),
  th: ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th
      className={cn("border-b border-slate-200 px-4 py-3 font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td
      className={cn("border-b border-slate-200 px-4 py-3 text-slate-700 last:border-b-0 dark:border-slate-800 dark:text-slate-300", className)}
      {...props}
    />
  ),
  hr: ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
    <hr
      className={cn("my-12 border-0 border-t border-slate-200 dark:border-slate-800", className)}
      {...props}
    />
  ),
};
