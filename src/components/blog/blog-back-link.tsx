import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BlogBackLinkProps = {
  children: ReactNode;
};

export function BlogBackLink({ children }: BlogBackLinkProps) {
  return (
    <Link
      href="/#blog"
      scroll={false}
      className="mb-3 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-slate-600 transition-colors hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-400 dark:hover:text-teal-400"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      {children}
    </Link>
  );
}
