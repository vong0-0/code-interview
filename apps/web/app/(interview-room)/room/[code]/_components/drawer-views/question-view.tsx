"use client";

import { FileText } from "lucide-react";
import { DifficultyBadge } from "@/components/common/custom-badge";

import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function QuestionView() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className={cn(
        jetbrainsMono.className,
        "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight"
      )}>
        Valid Anagram
      </h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Given two strings{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-300">
            s
          </code>{" "}
          and{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-300">
            t
          </code>
          , return{" "}
          <code className="text-blue-600 dark:text-blue-400 font-medium">true</code>{" "}
          if{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-300">
            t
          </code>{" "}
          is an anagram of{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-300">
            s
          </code>
          , and{" "}
          <code className="text-red-600 dark:text-red-400 font-medium">false</code>{" "}
          otherwise.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-muted/30 border border-border/50 rounded-lg p-5 space-y-3 shadow-inner">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
            Example 1:
          </p>
          <div className="font-mono text-xs space-y-1">
            <p>
              <span className="text-muted-foreground/60">Input:</span> s =
              "anagram", t = "nagaram"
            </p>
            <p>
              <span className="text-muted-foreground/60">Output:</span>{" "}
              <span className="text-green-600 dark:text-green-400 font-bold">
                true
              </span>
            </p>
          </div>
        </div>
        <div className="bg-muted/30 border border-border/50 rounded-lg p-5 space-y-3 shadow-inner">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
            Example 2:
          </p>
          <div className="font-mono text-xs space-y-1">
            <p>
              <span className="text-muted-foreground/60">Input:</span> s = "rat", t = "car"
            </p>
            <p>
              <span className="text-muted-foreground/60">Output:</span>{" "}
              <span className="text-red-600 dark:text-red-400 font-bold">
                false
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
