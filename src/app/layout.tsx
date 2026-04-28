import type { Metadata } from "next";
import { inter, pixelFont } from "@/lib/fonts";
import "@/app/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import SmoothScroll from "@/components/layouts/smooth-scroll";

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
      <body className={`${inter.className} ${pixelFont.variable} font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}