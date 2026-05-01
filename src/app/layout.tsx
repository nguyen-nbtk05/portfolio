import type { Metadata } from "next";
import { inter, pixelFont } from "@/lib/fonts";
import "@/app/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import SmoothScroll from "@/components/layouts/smooth-scroll";

import { LanguageProvider } from "@/providers/language-provider";
import { AppShell } from "@/components/layouts/app-shell";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Computer Networks Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} ${pixelFont.variable} font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <LanguageProvider>
              <AppShell>
                {children}
              </AppShell>
            </LanguageProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
