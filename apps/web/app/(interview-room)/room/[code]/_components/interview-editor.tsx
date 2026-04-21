"use client";

import * as React from "react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { jetbrainsMono } from "@/lib/fonts";
import {
  ATOM_ONE_DARK_NAME,
  CLAUDE_LIGHT_NAME,
  registerThemes,
} from "@/lib/monaco-themes";
import { useTheme } from "@/lib/theme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROGRAMMING_LANGUAGES } from "@/app/constants/questions";
import { EditorSkeleton } from "@/components/common/editor-skeleton";

interface InterviewEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  onRunCode?: () => void;
  isExecuting?: boolean;
  className?: string;
}

import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InterviewEditor({
  value,
  onChange,
  language = "javascript",
  onLanguageChange,
  onRunCode,
  isExecuting = false,
  className,
}: InterviewEditorProps) {
  const theme = useTheme();

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background overflow-hidden border-2 border-border/50",
        className,
      )}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-muted/30 px-3 py-1.5 border-b border-border/50 h-11 shrink-0">
        <div className="flex items-center gap-1">
          <span className={cn(
            jetbrainsMono.className,
            "text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter"
          )}>
            Language:
          </span>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="h-8 w-[140px] bg-transparent border-none hover:bg-background/40 font-mono text-[10px] font-bold uppercase tracking-widest focus:ring-0 focus:ring-offset-0 transition-colors">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-md border-border/50">
              {PROGRAMMING_LANGUAGES.map((lang) => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                  className="font-mono text-[10px] font-bold uppercase tracking-widest focus:bg-primary/10"
                >
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Run Code Button */}
        <Button 
          size="sm" 
          onClick={onRunCode}
          disabled={isExecuting}
          className={cn(
            "h-8 px-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-md shadow-lg shadow-primary/20 transition-all active:scale-95 gap-2",
            isExecuting && "opacity-80 cursor-not-allowed",
            jetbrainsMono.className
          )}
        >
          {isExecuting ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Play className="size-3 fill-current" />
          )}
          <span className="text-[10px] uppercase tracking-widest hidden sm:inline">
            {isExecuting ? "Executing..." : "Run Code"}
          </span>
        </Button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          loading={<EditorSkeleton />}
          height="100%"
          language={language}
          theme={theme === "dark" ? ATOM_ONE_DARK_NAME : CLAUDE_LIGHT_NAME}
          beforeMount={registerThemes}
          value={value}
          onChange={(val) => onChange(val || "")}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: jetbrainsMono.style.fontFamily,
            lineNumbers: "on",
            roundedSelection: true,
            padding: { top: 20, bottom: 20 },
            cursorStyle: "line",
            renderLineHighlight: "all",
            folding: true,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            automaticLayout: true,
            tabSize: 2,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            wordBasedSuggestions: "allDocuments",
          }}
        />
      </div>
    </div>
  );
}
