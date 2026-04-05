"use client";

import { useInView } from "@/app/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms เช่น 0, 100, 200, 350
  direction?: "up" | "down" | "left" | "right" | "none";
  offset?: number; // px ที่จะเลื่อน เช่น 4, 8, 16
  duration?: number; // ms เช่น 300, 500, 700
  threshold?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  offset = 8,
  duration = 500,
  threshold = 0.1,
  once = true,
}: FadeInProps) {
  const { ref, inView } = useInView({ threshold, once });

  const translateMap = {
    up: { x: 0, y: offset },
    down: { x: 0, y: -offset },
    left: { x: offset, y: 0 },
    right: { x: -offset, y: 0 },
    none: { x: 0, y: 0 },
  }[direction];

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transform: inView
          ? "translate(0, 0)"
          : `translate(${translateMap.x}px, ${translateMap.y}px)`,
      }}
      className={cn(
        "transition-all ease-out",
        inView ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
