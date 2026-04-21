import { useQuestionSync } from "@/hooks/use-question-sync";
import { QuestionEmptyState } from "./question-empty-state";
import type { ServerQuestionPayload } from "@code-interview/types";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface QuestionViewProps {
  initialQuestion?: ServerQuestionPayload | null;
  isInterviewer?: boolean;
  onBrowse?: () => void;
}

export function QuestionView({
  initialQuestion = null,
  isInterviewer = false,
  onBrowse,
}: QuestionViewProps) {
  const { question } = useQuestionSync(initialQuestion);

  if (!question) {
    return (
      <QuestionEmptyState 
        isInterviewer={isInterviewer} 
        onBrowse={onBrowse} 
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2
        className={cn(
          jetbrainsMono.className,
          "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight",
        )}
      >
        {question.title}
      </h2>

      <div className="space-y-4 text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {question.description}
      </div>

      {/* For now, we will show a note about examples if we don't have them in the payload yet */}
      <div className="pt-4 border-t border-border/40">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
          Problem Constraints & Examples
        </p>
        <div className="bg-muted/30 border border-border/50 rounded-lg p-5 space-y-3 shadow-inner italic text-sm text-muted-foreground/80">
          Refer to the description above for specific examples and constraints.
        </div>
      </div>
    </div>
  );
}
