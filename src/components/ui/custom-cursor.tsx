"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [cursorType, setCursorType] = useState<"default" | "pointer" | "text">("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);

      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]')
      ) {
        setCursorType("pointer");
      } 
      else if (
        computedStyle.cursor === "text" ||
        ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "li", "input", "textarea"].includes(target.tagName.toLowerCase())
      ) {
        setCursorType("text");
      } 
      else {
        setCursorType("default");
      }
    };

    // Khi chuột văng ra khỏi cửa sổ trình duyệt -> Ẩn
    const handleMouseLeave = () => setIsVisible(false);
    // Khi chuột quay lại -> Hiện
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  // Hàm chọn file ảnh dựa trên trạng thái
  const getCursorImage = () => {
    if (cursorType === "pointer") return "/cursors/pointer.png";
    // if (cursorType === "text") return "/cursors/xterm.png";
    return "/cursors/default.png";
  };

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
      animate={{
        x: mousePosition.x - 2, 
        y: mousePosition.y - 2,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ 
        type: "tween", 
        ease: "backOut", 
        duration: 0.05
      }}
    >
      <motion.div
        animate={{ scale: cursorType === "pointer" ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative w-6 h-6" 
      >
        <Image
          src={getCursorImage()}
          alt={`Cursor ${cursorType}`}
          width={24}
          height={24}
          priority
          className="object-contain"
          draggable={false} 
        />
      </motion.div>
    </motion.div>
  );
}