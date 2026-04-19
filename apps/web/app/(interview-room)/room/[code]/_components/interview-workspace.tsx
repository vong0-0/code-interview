"use client";

import * as React from "react";
import { InterviewEditor } from "./interview-editor";
import { InterviewTerminal, TerminalLine } from "./interview-terminal";
import { cn } from "@/lib/utils";

const MOCK_CODE = `function isAnagram(s, t) {
  if (s.length !== t.length) {
    return false;
  }

  const count = {};

  for (let char of s) {
    count[char] = (count[char] || 0) + 1;
  }

  for (let char of t) {
    if (!count[char]) return false;
    count[char]--;
  }

  return true;
}`;

const MOCK_OUTPUT: TerminalLine[] = [
  { type: "command", content: "node main.js" },
  { type: "stdout", content: 'Testing case 1: "anagram", "nagaram"...' },
  { type: "success", content: "Test Passed: Output true" },
  { type: "stdout", content: 'Testing case 2: "rat", "car"...' },
  { type: "success", content: "Test Passed: Output false" },
];

import { SidebarContainer } from "./sidebar-container";
import { QuestionView } from "./drawer-views/question-view";
import { ChatView } from "./drawer-views/chat-view";
import { FileText, MessageSquare } from "lucide-react";
import { DifficultyBadge } from "@/components/common/custom-badge";

export function InterviewWorkspace() {
  const [code, setCode] = React.useState(MOCK_CODE);
  const [language, setLanguage] = React.useState("javascript");
  const [output, setOutput] = React.useState<TerminalLine[]>(MOCK_OUTPUT);
  
  // Resizing and Visibility States
  const [terminalHeight, setTerminalHeight] = React.useState(280);
  const [leftWidth, setLeftWidth] = React.useState(320);
  const [rightWidth, setRightWidth] = React.useState(350);
  
  const [isLeftCollapsed, setIsLeftCollapsed] = React.useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = React.useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = React.useState(false);
  
  // Storage for previous sizes to restore after expansion
  const lastLeftWidth = React.useRef(320);
  const lastRightWidth = React.useRef(350);
  const lastTerminalHeight = React.useRef(280);
  
  const [activeResizer, setActiveResizer] = React.useState<"terminal" | "left" | "right" | null>(null);
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

  const resize = React.useCallback((e: PointerEvent) => {
    if (!activeResizer || !workspaceRef.current) return;

    const workspaceRect = workspaceRef.current.getBoundingClientRect();
    
    if (activeResizer === "terminal") {
      const newHeight = workspaceRect.bottom - e.clientY;
      const minHeight = 40;
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
  }, [activeResizer]);

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
        (activeResizer === "left" || activeResizer === "right") && "cursor-col-resize"
      )}
    >
      {/* 1. Left Sidebar: Question View */}
      <div 
        className={cn(
          "hidden md:block shrink-0 h-full overflow-hidden transition-[width]",
          !activeResizer && "duration-300"
        )}
        style={{ width: `${leftWidth}px` }}
      >
        <SidebarContainer 
          title="Question" 
          icon={<FileText className="size-4 text-blue-500" />}
          headerAction={<DifficultyBadge difficulty="MEDIUM" />}
        >
          <QuestionView />
        </SidebarContainer>
      </div>

      {/* Left Resizer Handle */}
      <div 
        onPointerDown={() => startResizing("left")}
        onDoubleClick={toggleLeft}
        className={cn(
          "hidden md:block w-1 hover:w-1.5 bg-border/40 hover:bg-primary/50 cursor-col-resize z-10 transition-all",
          activeResizer === "left" && "bg-primary w-1.5",
          isLeftCollapsed && "bg-primary/20"
        )}
      />

      {/* 2. Center Column: Editor and Terminal */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 min-h-0 border-b border-border/50 relative">
          <InterviewEditor
            value={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
          />
        </div>

        {/* Terminal Section with Dynamic Height */}
        <div
          style={{ height: `${terminalHeight}px` }}
          className={cn(
            "shrink-0 min-h-[40px] relative transition-[height]",
            !activeResizer && "duration-300"
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
          isRightCollapsed && "bg-emerald-500/20"
        )}
      />

      {/* 3. Right Sidebar: Chat View */}
      <div 
        className={cn(
          "hidden md:block shrink-0 h-full overflow-hidden transition-[width]",
          !activeResizer && "duration-300"
        )}
        style={{ width: `${rightWidth}px` }}
      >
        <SidebarContainer 
          title="Live Discussion" 
          icon={<MessageSquare className="size-4 text-emerald-500" />}
        >
          <ChatView />
        </SidebarContainer>
      </div>
    </div>
  );
}
