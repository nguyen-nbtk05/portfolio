"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  
  const handleScroll = () => {
    const targetPosition = window.innerHeight; // Cuộn đúng 100vh (hết Hero section)
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    
    // THAY ĐỔI DURATION
    const duration = 1200; 
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      
      // Hàm toán học Easing (EaseInOutCubic) giúp quán tính cuộn cực mượt
      const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const percentage = Math.min(progress / duration, 1);
      window.scrollTo(0, startPosition + distance * ease(percentage));

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  return (
    <motion.div
      role="button" 
      className="flex flex-col items-center justify-center gap-2 outline-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      onClick={handleScroll}
    >
      <div className="w-[30px] h-[50px] rounded-full border-2 border-slate-400 dark:border-slate-500 flex justify-center p-2 relative">
        <motion.div
          animate={{
            y: [0, 15, 15],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-1.5 h-1.5 rounded-full bg-amber-500"
        />
      </div>
      
      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500">
        Scroll Down
      </span>
    </motion.div>
  );
}