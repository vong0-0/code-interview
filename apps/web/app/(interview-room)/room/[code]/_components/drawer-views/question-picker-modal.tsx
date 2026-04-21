"use client";

import * as React from "react";
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from "@/components/ui/command";
import { DifficultyBadge } from "@/components/common/custom-badge";
import { useQuestions } from "@/lib/hooks/use-questions";
import { socket } from "@/lib/socket";
import { Loader2, Search } from "lucide-react";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface QuestionPickerModalProps {
  roomCode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionPickerModal({
  roomCode,
  open,
  onOpenChange,
}: QuestionPickerModalProps) {
  const { data: questions, isLoading } = useQuestions({}, { enabled: open });

  const handleSelectQuestion = (questionId: string) => {
    socket.emit("question:change", { roomCode, questionId });
    onOpenChange(false);
  };

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title="Select Interview Question"
      description="Search and select a question from your question bank."
    >
      <div className="flex flex-col h-[450px]">
        <CommandInput placeholder="Search questions..." />
        
        <CommandList className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-xs font-medium animate-pulse">Loading your questions...</p>
            </div>
          ) : (
            <>
              <CommandEmpty>
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                    <Search className="size-6 opacity-20" />
                  </div>
                  <p className="text-sm">No questions found.</p>
                </div>
              </CommandEmpty>
              
              <CommandGroup heading="Your Question Bank">
                {questions?.map((q) => (
                  <CommandItem
                    key={q.id}
                    onSelect={() => handleSelectQuestion(q.id)}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className={cn(jetbrainsMono.className, "font-semibold text-sm")}>
                        {q.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </div>
    </CommandDialog>
  );
}
