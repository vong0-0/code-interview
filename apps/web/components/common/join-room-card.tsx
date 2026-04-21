"use client";

import { SectionLabel } from "@/components/common/section-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JoinRoomButton } from "@/components/common/buttons";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function JoinRoomCard() {
  const [name, setName] = useState("");
  const params = useParams();
  const router = useRouter();
  const roomCode = params?.code as string;

  const handleJoin = () => {
    if (!name.trim() || !roomCode) return;
    router.push(`/room/${roomCode}?name=${encodeURIComponent(name.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoin();
    }
  };

  return (
    <Card className="w-full h-full max-w-[550px] py-8 rounded-md">
      <CardHeader>
        <SectionLabel className="text-[10px] text-muted">
          join room
        </SectionLabel>
        <CardTitle className="text-2xl mt-4 font-bold">
          Enter your name
        </CardTitle>
        <CardDescription className="text-sm">
          You can join without logging in by providing your full name. This name
          will be visible to the interviewer and included in the session logs.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 w-full mx-auto my-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input 
              id="full-name" 
              name="full-name" 
              placeholder="e.g John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <JoinRoomButton 
            onClick={handleJoin}
            disabled={!name.trim()}
            className="md:w-auto md:text-nowrap disabled:opacity-50 disabled:hover:translate-y-0" 
          />
        </div>

        <div className="text-xs text-muted-foreground">
          <Alert className="rounded-sm">
            <InfoIcon />
            <AlertDescription>
              By joining, you agree to be recorded for interview purposes. All
              code and comminication within this room is property of the host
              organization.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
