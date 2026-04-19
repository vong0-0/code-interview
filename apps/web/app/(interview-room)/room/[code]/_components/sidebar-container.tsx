"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { jetbrainsMono } from "@/lib/fonts";

interface SidebarContainerProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function SidebarContainer({
  title,
  icon,
  children,
  className,
  headerAction,
}: SidebarContainerProps) {
  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border/50", className)}>
      {/* Header */}
      <div className="flex items-center justify-between h-11 px-4 border-b border-border/50 bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          {icon && <div className="text-muted-foreground/80">{icon}</div>}
          <span className={cn(
            jetbrainsMono.className,
            "text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
          )}>
            {title}
          </span>
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-border">
        <div className="p-4 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
