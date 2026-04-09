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

export default function JoinRoomCard() {
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
            <Input id="full-name" name="full-name" placeholder="e.g John Doe" />
          </div>
          <JoinRoomButton className="md:w-auto md:text-nowrap" />
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
