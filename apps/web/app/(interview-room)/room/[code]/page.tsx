"use client";

import * as React from "react";
import { RoomHeader } from "./_components/room-header";
import { RoomActionLayer } from "./_components/room-action-layer";
import { InterviewWorkspace } from "./_components/interview-workspace";

export default function Page(props: { params: Promise<{ code: string }> }) {
  const { code } = React.use(props.params);

  // Mock title for now; later will be fetched from API
  const title = "Valid Anagram Solution";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <RoomHeader title={title} />
      
      <main className="flex-1 min-h-0 relative">
        <InterviewWorkspace />
      </main>

      <RoomActionLayer />
    </div>
  );
}
