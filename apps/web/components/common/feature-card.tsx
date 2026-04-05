"use client";

import { LucideIcon } from "lucide-react";
import { type MouseEvent, useRef, useState } from "react";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  index: string;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  index,
  title,
  description,
  className,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-1 transition-all duration-500 backdrop-blur-xl",
        "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
        className,
      )}
    >
      {/* ── Spotlight Effect ── */}
      <div
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
        }}
      />

      {/* ── Card Content Shell ── */}
      <div className="relative z-10 flex h-full flex-col gap-6 rounded-[calc(1rem-1px)] bg-card/60 p-6 md:p-8">
        <div className="flex items-center justify-between">
          {/* Icon Box */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border/50 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/10 group-hover:ring-primary/30">
            <Icon className="h-6 w-6 text-foreground/70 transition-colors group-hover:text-primary" />
          </div>

          <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground/30 transition-colors group-hover:text-primary/50">
            {index}
          </span>
        </div>

        <div className="space-y-3">
          <h3
            className={cn(
              jetbrainsMono.className,
              "text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary",
            )}
          >
            {title}
          </h3>
          <p className="text-[15px] leading-relaxed text-muted-foreground/80 transition-colors group-hover:text-foreground/90">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
