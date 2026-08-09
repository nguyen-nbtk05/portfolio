import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const pixelFont = localFont({
  src: "../../public/fonts/PressStart2P-Regular.ttf",
  display: "swap",
  variable: "--font-pixel",
});