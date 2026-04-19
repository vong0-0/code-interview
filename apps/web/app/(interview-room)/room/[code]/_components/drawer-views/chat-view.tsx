"use client";

import { MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatView() {
  return (
    <div className="flex flex-col h-full space-y-4 min-h-[45vh] animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Chat Messages */}
      <div className="flex-1 space-y-6 overflow-y-auto pb-4">
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200 dark:border-blue-800">
            <User className="size-4" />
          </div>
          <div className="bg-muted/40 backdrop-blur-sm p-3.5 rounded-2xl rounded-tl-none text-sm max-w-[85%] border border-border/50 shadow-sm">
            <p className="font-bold text-[9px] text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 shadow-sm">
              Interviewer
            </p>
            <p className="leading-relaxed">
              Hello! I'm here to support you during this interview. Have you had
              a chance to look at the problem constraints yet?
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 font-extrabold text-[10px] shadow-lg shadow-primary/20">
            YOU
          </div>
          <div className="bg-primary/5 border border-primary/20 backdrop-blur-sm p-3.5 rounded-2xl rounded-tr-none text-sm max-w-[85%] shadow-sm">
            <p className="leading-relaxed italic opacity-80 underline decoration-primary/30 underline-offset-4">
              I'm currently thinking about the time complexity. A frequency
              counter should be O(n), right?
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 bg-muted/20 px-3 py-1 rounded-full">
            New Messages
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200 dark:border-blue-800">
            <User className="size-4" />
          </div>
          <div className="bg-muted/40 backdrop-blur-sm p-3.5 rounded-2xl rounded-tl-none text-sm max-w-[85%] border border-border/50 shadow-sm italic">
            Correct! O(n) is optimal for this problem.
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t border-border/50 mt-auto">
        <div className="relative group flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type a message to the interviewer..."
              className="w-full bg-muted/20 border border-border/50 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold">⏎</span>
            </div>
          </div>
          <Button
            size="icon"
            className="size-10 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-90"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
