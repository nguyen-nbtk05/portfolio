"use client";

import { useEffect, useRef } from "react";

export default function MagneticGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    // Store particle data directly to avoid React state overhead
    let particles: { cx: number; cy: number; x: number; y: number }[] = [];
    const spacing = 42;
    const mouse = { x: -1000, y: -1000, radius: 190 };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Handle High-DPI/Retina screens for crisp dots
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initParticles(parent.clientWidth, parent.clientHeight);
      }
    };

    const initParticles = (width: number, height: number) => {
      particles = [];
      const rows = Math.ceil(height / spacing) + 1;
      const cols = Math.ceil(width / spacing) + 1;

      // Center the grid
      const offsetX = (width - cols * spacing) / 2 + spacing / 2;
      const offsetY = (height - rows * spacing) / 2 + spacing / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + offsetX;
          const y = j * spacing + offsetY;
          particles.push({
            cx: x,
            cy: y,
            x: x,
            y: y,
          });
        }
      }
    };

    const trackMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const untrackMouse = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", resize);
    // Listen to window instead of parent since parent is pointer-events-none
    window.addEventListener("mousemove", trackMouse);
    window.addEventListener("mouseout", untrackMouse);

    resize();

    const render = () => {
      const width = canvas.parentElement?.clientWidth || canvas.width;
      const height = canvas.parentElement?.clientHeight || canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Determine theme dynamically without re-rendering component
      const isDark = document.documentElement.classList.contains("dark");
      ctx.fillStyle = isDark
        ? "rgba(148, 163, 184, 0.28)"
        : "rgba(71, 85, 105, 0.22)";

      particles.forEach((p) => {
        const dx = mouse.x - p.cx;
        const dy = mouse.y - p.cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const maxDistance = mouse.radius;
        const pullStrength = 22;

        if (distance < maxDistance && distance > 0) {
          const force = (maxDistance - distance) / maxDistance;
          // Calculate vector pointing to the mouse
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;

          const pullX = forceDirectionX * force * pullStrength;
          const pullY = forceDirectionY * force * pullStrength;

          const targetX = p.cx + pullX;
          const targetY = p.cy + pullY;

          // Easing towards the pulled position
          p.x += (targetX - p.x) * 0.15;
          p.y += (targetY - p.y) * 0.15;
        } else {
          // Easing back to original position
          p.x += (p.cx - p.x) * 0.1;
          p.y += (p.cy - p.y) * 0.1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.05, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", trackMouse);
      window.removeEventListener("mouseout", untrackMouse);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(96% 88% at 50% 54%, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.58) 54%, transparent 90%)",
        WebkitMaskImage:
          "radial-gradient(96% 88% at 50% 54%, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.58) 54%, transparent 90%)",
      }}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
}
