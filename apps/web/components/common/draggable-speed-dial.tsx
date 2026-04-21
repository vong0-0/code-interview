"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { jetbrainsMono } from "@/lib/fonts";
import { Button } from "@/components/ui/button";

export interface SpeedDialAction {
  id: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
}

interface DraggableSpeedDialProps {
  actions: SpeedDialAction[];
  trigger?: string | LucideIcon | React.ReactNode;
  initialPosition?: { x: number; y: number };
  snapPadding?: number;
  className?: string;
  mobileOnly?: boolean;
}

export function DraggableSpeedDial({
  actions,
  trigger,
  initialPosition = { x: 24, y: 24 },
  snapPadding = 24,
  className,
  mobileOnly = true,
}: DraggableSpeedDialProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  
  const dragInfo = useRef({
    isMouseDown: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: position.x,
    startPosYActual: position.y,
    hasMoved: false,
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on resize if requested
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileOnly) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOnly]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragInfo.current = {
      isMouseDown: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y, // This is not used but kept for consistency
      startPosYActual: position.y,
      hasMoved: false,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragInfo.current.isMouseDown) return;

    const deltaX = e.clientX - dragInfo.current.startX;
    const deltaY = dragInfo.current.startY - e.clientY;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      dragInfo.current.hasMoved = true;
      setIsDragging(true);
      setIsExpanded(false);
    }

    if (dragInfo.current.hasMoved) {
      const newX = Math.max(
        10,
        Math.min(window.innerWidth - 60, dragInfo.current.startPosX + deltaX)
      );
      const newY = Math.max(
        10,
        Math.min(window.innerHeight - 60, dragInfo.current.startPosYActual + (dragInfo.current.startY - e.clientY))
      );
      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = () => {
    dragInfo.current.isMouseDown = false;

    if (dragInfo.current.hasMoved) {
      setIsSnapping(true);
      const fabSize = 48;
      
      const distances = {
        left: position.x,
        right: window.innerWidth - (position.x + fabSize),
        bottom: position.y,
        top: window.innerHeight - (position.y + fabSize),
      };

      const minDistance = Math.min(...Object.values(distances));

      if (minDistance === distances.left) {
        setPosition(prev => ({ ...prev, x: snapPadding }));
      } else if (minDistance === distances.right) {
        setPosition(prev => ({ ...prev, x: window.innerWidth - fabSize - snapPadding }));
      } else if (minDistance === distances.bottom) {
        setPosition(prev => ({ ...prev, y: snapPadding }));
      } else if (minDistance === distances.top) {
        setPosition(prev => ({ ...prev, y: window.innerHeight - fabSize - snapPadding }));
      }

      setTimeout(() => {
        setIsSnapping(false);
        setIsDragging(false);
      }, 500);
    } else {
      setIsDragging(false);
      setIsExpanded(!isExpanded);
    }
  };

  const isLeft = position.x < window.innerWidth / 2;

  const renderTrigger = () => {
    // When expanded, we always show a Plus icon that is rotated 135deg to look like an X
    // This provides a much smoother transition than swapping icons.
    if (isExpanded) return <Plus className="size-6 transition-transform" />;
    
    if (!trigger) return <Plus className="size-6 transition-transform" />;

    if (typeof trigger === "string") {
      return (
        <div className="flex flex-col items-center gap-0.5 transition-transform">
          <span className={cn(jetbrainsMono.className, "text-lg font-black leading-none")}>
            {trigger}
          </span>
          <div className="size-1 bg-white/40 rounded-full" />
        </div>
      );
    }

    if (typeof trigger === "function") {
      const Icon = trigger as LucideIcon;
      return <Icon className="size-6 transition-transform" />;
    }

    return trigger;
  };

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-50 pointer-events-none",
        mobileOnly && "md:hidden",
        className
      )}
      style={{
        bottom: `${position.y}px`,
        left: `${position.x}px`,
        width: "48px",
        height: "48px",
      }}
    >
      {/* Action Options */}
      <div
        className={cn(
          "absolute bottom-full flex flex-col gap-4 transition-all duration-500 pointer-events-auto pb-6",
          isExpanded
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-75 pointer-events-none",
          isLeft ? "items-start" : "items-end"
        )}
        style={{
          left: isLeft ? "-10px" : "auto",
          right: !isLeft ? "-10px" : "auto",
          width: "max-content",
        }}
      >
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => {
                action.onClick();
                setIsExpanded(false);
              }}
              style={{ 
                transitionDelay: isExpanded 
                  ? `${(actions.length - 1 - index) * 50}ms` 
                  : "0ms" 
              }}
              className={cn(
                "group flex items-center transition-all duration-300 hover:scale-105 active:scale-95",
                isLeft ? "flex-row" : "flex-row-reverse"
              )}
            >
              <div className={cn(
                "size-11 rounded-2xl bg-background/60 backdrop-blur-md border border-primary/20 shadow-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300",
                action.className
              )}>
                <Icon className={cn("size-5", action.iconClassName)} />
              </div>
              <span className={cn(
                jetbrainsMono.className,
                "mx-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/90 bg-muted/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50",
                "shadow-sm opacity-100 transition-all group-hover:border-primary/30"
              )}>
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Trigger */}
      <Button
        size="icon"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={cn(
          "size-13 rounded-2xl shadow-2xl flex items-center justify-center p-0 touch-none pointer-events-auto transition-all",
          "bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-white/20",
          isDragging && !isSnapping
            ? "cursor-grabbing scale-110 rotate-0 shadow-primary/20"
            : "cursor-grab active:scale-90",
          isSnapping && "transition-all duration-500 ease-out",
          isExpanded && "rotate-[135deg] bg-zinc-900 border-zinc-800 shadow-none"
        )}
      >
        {renderTrigger()}
      </Button>
    </div>

  );
}
