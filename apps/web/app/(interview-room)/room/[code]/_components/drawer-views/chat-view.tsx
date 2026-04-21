import { useChatSync } from "@/hooks/use-chat-sync";
import type { ServerChatMessagePayload } from "@code-interview/types";
import { format } from "date-fns";
import * as React from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatViewProps {
  roomCode: string;
  userName?: string;
  initialMessages?: ServerChatMessagePayload[];
}

export function ChatView({ roomCode, userName, initialMessages = [] }: ChatViewProps) {
  const { messages, sendMessage, messagesEndRef } = useChatSync(roomCode, initialMessages);
  const [inputText, setInputText] = React.useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 min-h-[45vh] animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Chat Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto pb-4 pr-1 scrollbar-thin scrollbar-thumb-border">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 opacity-20 select-none pointer-events-none">
            <MessageSquare className="size-10 mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderName === userName;
            
            return (
              <div 
                key={message.id} 
                className={cn(
                  "flex items-start gap-3",
                  isMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isMe && (
                  <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200 dark:border-blue-800">
                    <User className="size-4" />
                  </div>
                )}
                
                <div className={cn(
                  "flex flex-col max-w-[85%]",
                  isMe ? "items-end" : "items-start"
                )}>
                  {!isMe && (
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 ml-1">
                      {message.senderName}
                    </span>
                  )}
                  
                  <div className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm",
                    isMe 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted/40 backdrop-blur-sm border border-border/50 rounded-tl-none"
                  )}>
                    <p className="leading-relaxed break-words">{message.content}</p>
                  </div>
                  
                  <span className="text-[9px] text-muted-foreground/60 mt-1 mx-1 font-medium">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t border-border/50 mt-auto">
        <div className="relative group flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full bg-muted/20 border border-border/50 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold">⏎</span>
            </div>
          </div>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="size-10 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-90 disabled:opacity-50 disabled:grayscale"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
