"use client";

import * as React from "react";
import { RoomHeader } from "./_components/room-header";

export default function Page(props: { params: Promise<{ code: string }> }) {
  const { code } = React.use(props.params);

  // Mock title for now; later will be fetched from API
  const title = "LRU Cache Implementation";

  return (
    <div className="flex flex-col min-h-screen">
      <RoomHeader title={title} />
      
      {/* 
        Main content will go here (Code Editor, Sidebar, etc.)
        Example:
        <main className="flex-1 overflow-hidden">
          <InterviewWorkspace />
        </main>
      */}
    </div>
  );
}
