"use client";

import { FileQuestion, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface QuestionEmptyStateProps {
  isInterviewer?: boolean;
  onBrowse?: () => void;
}

export function QuestionEmptyState({ 
  isInterviewer,
  onBrowse 
}: QuestionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="size-20 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 relative z-10 border border-blue-500/20 shadow-xl shadow-blue-500/5">
          <FileQuestion className="size-10" />
        </div>
        <div className="absolute -top-2 -right-2 size-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 animate-pulse border border-emerald-500/30">
          <Sparkles className="size-4" />
        </div>
        <div className="absolute -bottom-1 -left-1 size-6 rounded-full bg-indigo-500/10 border border-indigo-500/20" />
      </div>

      <div className="max-w-[280px] space-y-2">
        <h3 className={cn(
          jetbrainsMono.className,
          "text-lg font-bold tracking-tight"
        )}>
          No Question Selected
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isInterviewer 
            ? "Get started by selecting a problem from the question bank to begin the evaluation."
            : "Please wait for the interviewer to select a coding challenge for this session."
          }
        </p>
      </div>

      {isInterviewer && (
        <Button 
          variant="outline" 
          onClick={onBrowse}
          className="rounded-xl border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all gap-2 h-11 px-6 group"
        >
          <Search className="size-4 group-hover:scale-110 transition-transform" />
          Browse Question Bank
        </Button>
      )}
      
      {!isInterviewer && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
          <div className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Awaiting selection
          </span>
        </div>
      )}
    </div>
  );
}
