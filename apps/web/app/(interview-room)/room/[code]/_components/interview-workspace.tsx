"use client";

import * as React from "react";
import { InterviewEditor } from "./interview-editor";
import { InterviewTerminal, TerminalLine } from "./interview-terminal";
import { cn } from "@/lib/utils";

import { useCodeSync } from "@/hooks/use-code-sync";
import { SidebarContainer } from "./sidebar-container";
import { FileText, MessageSquare } from "lucide-react";
import { DifficultyBadge } from "@/components/common/custom-badge";
import { QuestionView } from "./drawer-views/question-view";
import { ChatView } from "./drawer-views/chat-view";


import { useQuestionSync } from "@/hooks/use-question-sync";
import type {
  ServerChatMessagePayload,
  ServerQuestionPayload,
} from "@code-interview/types";
import { useLanguageSync } from "@/hooks/use-language-sync";
import { QuestionPickerModal } from "./drawer-views/question-picker-modal";
import { Button } from "@/components/ui/button";

interface InterviewWorkspaceProps {
  roomCode: string;
  userName?: string;
  userRole?: string;
  initialCode?: string | null;
  initialLanguage?: string | null;
  initialMessages?: ServerChatMessagePayload[];
  initialQuestion?: ServerQuestionPayload | null;
}

export function InterviewWorkspace({
  roomCode,
  userName,
  userRole,
  initialCode,
  initialLanguage,
  initialMessages = [],
  initialQuestion = null,
}: InterviewWorkspaceProps) {
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const { code, handleCodeChange, setCode } = useCodeSync(
    roomCode,
    initialCode,
  );
  const { question } = useQuestionSync(initialQuestion);

  const { language, changeLanguage } = useLanguageSync(
    roomCode,
    initialLanguage,
    (remoteCode) => {
      if (remoteCode !== null && remoteCode !== undefined) {
        setCode(remoteCode);
      }
    },
  );

  const [output, setOutput] = React.useState<TerminalLine[]>([]);

  // Resizing and Visibility States
  const [terminalHeight, setTerminalHeight] = React.useState(280);
  const [leftWidth, setLeftWidth] = React.useState(320);
  const [rightWidth, setRightWidth] = React.useState(350);

  const [isLeftCollapsed, setIsLeftCollapsed] = React.useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = React.useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = React.useState(false);
  const [isExecuting, setIsExecuting] = React.useState(false);

  const handleRunCode = React.useCallback(async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    // Simulation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockRunOutput: TerminalLine[] = [
      { 
        type: "stdout", 
        content: `[${new Date().toLocaleTimeString()}] Executing ${language} code...` 
      },
      { 
        type: "command", 
        content: language === "javascript" ? "node main.js" : `run ${language} program` 
      },
      { 
        type: "stdout", 
        content: "Hello, World!" 
      },
      { type: "stdout", content: "" },
      { 
        type: "stdout", 
        content: "---" 
      },
      { 
        type: "stdout", 
        content: "⚠️  Note: This is a mock output. Code execution is not yet connected." 
      },
    ];

    setOutput(mockRunOutput);
    setIsExecuting(false);
    
    // Automatically open terminal if it was minimized
    if (isTerminalMinimized) {
      setTerminalHeight(280);
      setIsTerminalMinimized(false);
    }
  }, [isExecuting, language, isTerminalMinimized]);

  // Storage for previous sizes to restore after expansion
  const lastLeftWidth = React.useRef(320);
  const lastRightWidth = React.useRef(350);
  const lastTerminalHeight = React.useRef(280);

  const [activeResizer, setActiveResizer] = React.useState<
    "terminal" | "left" | "right" | null
  >(null);
  const workspaceRef = React.useRef<HTMLDivElement>(null);

  const startResizing = (type: "terminal" | "left" | "right") => {
    setActiveResizer(type);
    // If it was collapsed/minimized, expand it on start drag
    if (type === "left") setIsLeftCollapsed(false);
    if (type === "right") setIsRightCollapsed(false);
    if (type === "terminal") setIsTerminalMinimized(false);
  };

  const stopResizing = React.useCallback(() => {
    setActiveResizer(null);
  }, []);

  const toggleLeft = React.useCallback(() => {
    if (!isLeftCollapsed) {
      lastLeftWidth.current = leftWidth;
      setLeftWidth(0);
      setIsLeftCollapsed(true);
    } else {
      setLeftWidth(lastLeftWidth.current);
      setIsLeftCollapsed(false);
    }
  }, [leftWidth, isLeftCollapsed]);

  const toggleRight = React.useCallback(() => {
    if (!isRightCollapsed) {
      lastRightWidth.current = rightWidth;
      setRightWidth(0);
      setIsRightCollapsed(true);
    } else {
      setRightWidth(lastRightWidth.current);
      setIsRightCollapsed(false);
    }
  }, [rightWidth, isRightCollapsed]);

  const toggleTerminal = React.useCallback(() => {
    if (!isTerminalMinimized) {
      lastTerminalHeight.current = terminalHeight;
      setTerminalHeight(40);
      setIsTerminalMinimized(true);
    } else {
      setTerminalHeight(lastTerminalHeight.current);
      setIsTerminalMinimized(false);
    }
  }, [terminalHeight, isTerminalMinimized]);

  const resize = React.useCallback(
    (e: PointerEvent) => {
      if (!activeResizer || !workspaceRef.current) return;

      const workspaceRect = workspaceRef.current.getBoundingClientRect();

      if (activeResizer === "terminal") {
        const newHeight = workspaceRect.bottom - e.clientY;
        const maxHeight = workspaceRect.height * 0.8;

        if (newHeight < 80) {
          setTerminalHeight(40);
          setIsTerminalMinimized(true);
        } else {
          setTerminalHeight(Math.min(newHeight, maxHeight));
          setIsTerminalMinimized(false);
        }
      } else if (activeResizer === "left") {
        const newWidth = e.clientX - workspaceRect.left;
        const minWidth = 250;
        const maxWidth = workspaceRect.width * 0.4;

        if (newWidth < 100) {
          setLeftWidth(0);
          setIsLeftCollapsed(true);
        } else {
          setLeftWidth(Math.max(minWidth, Math.min(newWidth, maxWidth)));
          setIsLeftCollapsed(false);
        }
      } else if (activeResizer === "right") {
        const newWidth = workspaceRect.right - e.clientX;
        const minWidth = 250;
        const maxWidth = workspaceRect.width * 0.4;

        if (newWidth < 100) {
          setRightWidth(0);
          setIsRightCollapsed(true);
        } else {
          setRightWidth(Math.max(minWidth, Math.min(newWidth, maxWidth)));
          setIsRightCollapsed(false);
        }
      }
    },
    [activeResizer],
  );

  React.useEffect(() => {
    if (activeResizer) {
      window.addEventListener("pointermove", resize);
      window.addEventListener("pointerup", stopResizing);
    } else {
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stopResizing);
    }

    return () => {
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stopResizing);
    };
  }, [activeResizer, resize, stopResizing]);

  return (
    <div
      ref={workspaceRef}
      className={cn(
        "flex flex-col md:flex-row h-full bg-background overflow-hidden select-none",
        activeResizer === "terminal" && "cursor-ns-resize",
        (activeResizer === "left" || activeResizer === "right") &&
          "cursor-col-resize",
      )}
    >
      {/* 1. Left Sidebar: Question View */}
      <div
        className={cn(
          "hidden md:block shrink-0 h-full overflow-hidden transition-[width]",
          !activeResizer && "duration-300",
        )}
        style={{ width: `${leftWidth}px` }}
      >
        <SidebarContainer
          title="Question"
          icon={<FileText className="size-4 text-blue-500" />}
          headerAction={
            <div className="flex items-center gap-2">
              {question && (
                <DifficultyBadge difficulty={question.difficulty} />
              )}
              {userRole === "INTERVIEWER" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPickerOpen(true)}
                  className="h-7 px-2 text-[10px] uppercase tracking-wider font-bold hover:bg-primary/10 hover:text-primary transition-colors border border-primary/20"
                >
                  Change
                </Button>
              )}
            </div>
          }
        >
          <QuestionView
            initialQuestion={initialQuestion}
            isInterviewer={userRole === "INTERVIEWER"}
            onBrowse={() => setIsPickerOpen(true)}
          />
        </SidebarContainer>
      </div>

      {/* Left Resizer Handle */}
      <div
        onPointerDown={() => startResizing("left")}
        onDoubleClick={toggleLeft}
        className={cn(
          "hidden md:block w-1 hover:w-1.5 bg-border/40 hover:bg-primary/50 cursor-col-resize z-10 transition-all",
          activeResizer === "left" && "bg-primary w-1.5",
          isLeftCollapsed && "bg-primary/20",
        )}
      />

      {/* 2. Center Column: Editor and Terminal */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 min-h-0 border-b border-border/50 relative">
          <InterviewEditor
            value={code}
            onChange={handleCodeChange}
            language={language}
            onLanguageChange={(newLang) => changeLanguage(newLang, code)}
            onRunCode={handleRunCode}
            isExecuting={isExecuting}
          />
        </div>

        {/* Terminal Section with Dynamic Height */}
        <div
          style={{ height: `${terminalHeight}px` }}
          className={cn(
            "shrink-0 min-h-[40px] relative transition-[height]",
            !activeResizer && "duration-300",
          )}
        >
          <InterviewTerminal
            lines={output}
            onClear={() => setOutput([])}
            onResizeStart={() => startResizing("terminal")}
            onToggleMin={toggleTerminal}
            isMinimized={isTerminalMinimized}
          />
        </div>
      </div>

      {/* Right Resizer Handle */}
      <div
        onPointerDown={() => startResizing("right")}
        onDoubleClick={toggleRight}
        className={cn(
          "hidden md:block w-1 hover:w-1.5 bg-border/40 hover:bg-emerald-500/50 cursor-col-resize z-10 transition-all",
          activeResizer === "right" && "bg-emerald-500 w-1.5",
          isRightCollapsed && "bg-emerald-500/20",
        )}
      />

      {/* 3. Right Sidebar: Chat View */}
      <div
        className={cn(
          "hidden md:block shrink-0 h-full overflow-hidden transition-[width]",
          !activeResizer && "duration-300",
        )}
        style={{ width: `${rightWidth}px` }}
      >
        <SidebarContainer
          title="Live Discussion"
          icon={<MessageSquare className="size-4 text-emerald-500" />}
        >
          <ChatView
            roomCode={roomCode}
            userName={userName}
            initialMessages={initialMessages}
          />
        </SidebarContainer>
      </div>

      {userRole === "INTERVIEWER" && (
        <QuestionPickerModal
          roomCode={roomCode}
          open={isPickerOpen}
          onOpenChange={setIsPickerOpen}
        />
      )}
    </div>
  );
}
