import { Inter } from "next/font/google";
import localFont from "next/font/local";

// 1. Font Google cho text thông thường
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// 2. Font Local cho phong cách Pixel (giả sử bạn đã bỏ file vào public/fonts)
export const pixelFont = localFont({
  src: "../../public/fonts/PressStart2P-Regular.ttf", // Đường dẫn tới file font vật lý
  display: "swap",
  variable: "--font-pixel",
});