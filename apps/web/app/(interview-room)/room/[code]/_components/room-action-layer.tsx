"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose 
} from "@/components/drawer";
import { Button } from "@/components/ui/button";
import { X, FileText, MessageSquare } from "lucide-react";
import { DifficultyBadge } from "@/components/common/custom-badge";
import { DraggableSpeedDial, SpeedDialAction } from "@/components/common/draggable-speed-dial";
import { QuestionView } from "./drawer-views/question-view";
import { ChatView } from "./drawer-views/chat-view";

import type { ServerChatMessagePayload, ServerQuestionPayload } from "@code-interview/types";

import { useQuestionSync } from "@/hooks/use-question-sync";
import { QuestionPickerModal } from "./drawer-views/question-picker-modal";

interface RoomActionLayerProps {
  roomCode: string;
  userName?: string;
  isInterviewer?: boolean;
  initialMessages?: ServerChatMessagePayload[];
  initialQuestion?: ServerQuestionPayload | null;
}

export function RoomActionLayer({
  roomCode,
  userName,
  isInterviewer = false,
  initialMessages = [],
  initialQuestion = null,
}: RoomActionLayerProps) {
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState<"question" | "chat">("question");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const { question } = useQuestionSync(initialQuestion);

  const actions: SpeedDialAction[] = [
    {
      id: "chat",
      icon: MessageSquare,
      label: "Live Chat",
      onClick: () => {
        setActiveView("chat");
        setOpen(true);
      },
    },
    {
      id: "question",
      icon: FileText,
      label: "View Details",
      onClick: () => {
        setActiveView("question");
        setOpen(true);
      },
    },
  ];

  return (
    <>
      {/* Reusable Interaction Layer */}
      <DraggableSpeedDial
        actions={actions}
        initialPosition={{ x: 24, y: 24 }}
      />

      {/* Modular Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="bg-background text-foreground border-border max-h-[85vh]">
          <div className="mx-auto w-full max-w-lg flex flex-col h-full overflow-hidden">
            {/* Unified Header */}
            <DrawerHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4 shrink-0 px-4">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  {activeView === "question" ? (
                    <FileText className="size-4 text-blue-500" />
                  ) : (
                    <MessageSquare className="size-4 text-emerald-500" />
                  )}
                  <DrawerTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {activeView === "question" ? "Problem Description" : "Interview Chat"}
                  </DrawerTitle>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {activeView === "question" && question && (
                  <DifficultyBadge difficulty={question.difficulty} />
                )}
                {isInterviewer && activeView === "question" && (
                   <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => setIsPickerOpen(true)}
                   className="h-7 px-2 text-[10px] uppercase tracking-wider font-bold hover:bg-primary/10 hover:text-primary transition-colors border border-primary/20"
                 >
                   Change
                 </Button>
                )}
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="size-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>

            {/* Content Area Rendering Modular Views */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-border">
              {activeView === "question" ? (
                <QuestionView
                  initialQuestion={initialQuestion}
                  isInterviewer={isInterviewer}
                  onBrowse={() => setIsPickerOpen(true)}
                />
              ) : (
                <ChatView
                  roomCode={roomCode}
                  userName={userName}
                  initialMessages={initialMessages}
                />
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {isInterviewer && (
        <QuestionPickerModal
          roomCode={roomCode}
          open={isPickerOpen}
          onOpenChange={setIsPickerOpen}
        />
      )}
    </>
  );
}
