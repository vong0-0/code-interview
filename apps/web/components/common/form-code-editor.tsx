"use client";

import * as React from "react";
import Editor from "@monaco-editor/react";
import { FieldValues, Path, Control } from "react-hook-form";
import { FormField } from "./form-field";
import { cn } from "@/lib/utils";
import { jetbrainsMono } from "@/lib/fonts";
import { useTheme } from "@/lib/theme";
import {
  ATOM_ONE_DARK_NAME,
  CLAUDE_LIGHT_NAME,
  registerThemes,
} from "@/lib/monaco-themes";
import { Code } from "lucide-react";
import { EditorSkeleton } from "./skeletons/editor-skeleton";

interface FormCodeEditorProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  id: string;
  language?: string;
  className?: string;
  minHeight?: string;
  disabled?: boolean;
  hideLabel?: boolean;
}

export function FormCodeEditor<T extends FieldValues>({
  name,
  control,
  label,
  id,
  language,
  className,
  minHeight = "300px",
  disabled,
  hideLabel = true,
}: FormCodeEditorProps<T>) {
  const theme = useTheme();

  return (
    <FormField
      name={name}
      control={control}
      label={label}
      id={id}
      orientation="vertical"
      hideLabel={hideLabel}
    >
      {(field) => (
        <div
          className={cn(
            "relative overflow-hidden rounded-sm border-2 border-muted bg-background transition-all duration-200 focus-within:border-primary/30",
            disabled && "opacity-60 grayscale-[0.5] select-none",
            className,
          )}
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between bg-muted/30 px-4 py-2.5 border-b border-muted">
            <div className="flex items-center gap-2">
              <Code className="size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Starter Code
                </span>
                <span className="font-mono text-[9px] text-muted-foreground/60 capitalize">
                  {language || "Select a language..."}
                </span>
              </div>
            </div>
            {/* Window Controls (Decorative) */}
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-muted-foreground/20" />
              <div className="size-2 rounded-full bg-muted-foreground/20" />
            </div>
          </div>

          {/* Monaco Editor */}
          <div
            style={{ minHeight }}
            className={cn(disabled && "pointer-events-none")}
          >
            <Editor
              loading={<EditorSkeleton />}
              height={minHeight}
              language={language || "javascript"}
              theme={theme === "dark" ? ATOM_ONE_DARK_NAME : CLAUDE_LIGHT_NAME}
              beforeMount={registerThemes}
              value={field.value || ""}
              onChange={(value) => !disabled && field.onChange(value || "")}
              options={{
                readOnly: disabled,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                fontFamily: jetbrainsMono.style.fontFamily,
                lineNumbers: "on",
                roundedSelection: true,
                padding: { top: 16, bottom: 16 },
                cursorStyle: disabled ? "underline" : "line",
                renderLineHighlight: disabled ? "none" : "all",
                folding: true,
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
                automaticLayout: true,
                tabSize: 2,
                domReadOnly: disabled,
              }}
            />
          </div>
        </div>
      )}
    </FormField>
  );
}
