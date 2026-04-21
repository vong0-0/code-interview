"use client";

import { useRoomSocket } from "@/hooks/use-room-socket";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { RoomHeader } from "./_components/room-header";
import { InterviewWorkspace } from "./_components/interview-workspace";
import { RoomActionLayer } from "./_components/room-action-layer";

import { ArrowLeft, RotateCcw } from "lucide-react";

import { useSearchParams } from "next/navigation";

export default function Page(props: { params: Promise<{ code: string }> }) {
  const { code } = React.use(props.params);
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || undefined;

  const { 
    participants, 
    roomData, 
    error, 
    isJoining, 
    retry, 
    initialMessages,
    initialQuestion,
    timerStatus,
    initialTimerRemaining
  } = useRoomSocket(code, name);

  if (isJoining) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background gap-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Joining interview room...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background gap-6 p-4 text-center">
        <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
          <AlertCircle className="size-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Failed to Join Room
          </h1>
          <p className="text-base text-muted-foreground max-w-sm mx-auto">
            {error ||
              "Something went wrong while connecting to the session. Please try again later."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            size="lg"
            className="h-auto py-3 px-6"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Home
          </Button>
          <Button
            variant={"default"}
            onClick={retry}
            size="lg"
            className="h-auto py-3 px-6"
          >
            <RotateCcw className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <RoomHeader 
        roomCode={code}
        title={
          roomData?.roomCode ? `Room: ${roomData.roomCode}` : "Interview Room"
        }
        participants={participants}
        timerStatus={timerStatus}
        initialTimerRemaining={initialTimerRemaining}
        isInterviewer={roomData?.role === "INTERVIEWER"}
      />

      <main className="flex-1 min-h-0 relative">
        <InterviewWorkspace
          roomCode={code}
          userName={roomData?.name}
          userRole={roomData?.role}
          initialCode={roomData?.lastCode}
          initialLanguage={roomData?.language}
          initialMessages={initialMessages}
          initialQuestion={initialQuestion}
        />
      </main>

      <RoomActionLayer 
        roomCode={code} 
        userName={roomData?.name}
        isInterviewer={roomData?.role === "INTERVIEWER"}
        initialMessages={initialMessages}
      />
    </div>
  );
}
