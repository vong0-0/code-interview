"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EllipsisVertical, LogOut, Users } from "lucide-react";

import { SiteHeader } from "@/components/common/site-header";
import { Timer } from "@/components/common/timer";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface RoomHeaderProps {
  title: string;
}

export function RoomHeader({ title }: RoomHeaderProps) {
  const router = useRouter();
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Force close dropdown when screen size exceeds sm (640px)
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    if (mediaQuery.matches) setIsMenuOpen(false);

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const handleLeave = () => {
    router.push("/dashboard");
  };

  const participants = (
    <>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge className="bg-green-500" />
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/leerob.png" />
        <AvatarFallback>AS</AvatarFallback>
        <AvatarBadge className="bg-green-500" />
      </Avatar>
    </>
  );

  return (
    <>
      <SiteHeader variant={"transparent"} className="bg-white dark:bg-black">
        {/* Logo / Title */}
        <SiteHeader.Start>
          <div
            className={cn(
              jetbrainsMono.className,
              "text-base sm:text-lg font-bold tracking-tight whitespace-nowrap",
            )}
          >
            <span className="dark:text-white text-zinc-900">Code</span>
            <span className="text-primary hidden sm:inline ml-0.5">Interview</span>
          </div>
        </SiteHeader.Start>

        {/* Center Timer */}
        <SiteHeader.Center>
          <Timer
            duration={60 * 1000}
            mode="countdown"
            onFinish={() => console.log("Timer finished")}
            showControls
          />
        </SiteHeader.Center>

        {/* Right Actions */}
        <SiteHeader.End className="gap-1 sm:gap-4 items-center">
          {/* Desktop Avatars */}
          <AvatarGroup max={2} size="default" className="hidden sm:flex">
            {participants}
          </AvatarGroup>

          <Separator
            orientation="vertical"
            className="h-6 self-center! hidden sm:block"
          />
          <ThemeToggle />
          <Separator
            orientation="vertical"
            className="h-6 self-center! hidden sm:block"
          />

          {/* Mobile Dropdown */}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"} className="sm:hidden">
                <EllipsisVertical className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 overflow-hidden bg-white dark:bg-black"
            >
              <DropdownMenuLabel className="flex items-center gap-2 p-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                <Users className="size-3" />
                Participants
              </DropdownMenuLabel>
              <div className="px-3 pb-3">
                <AvatarGroup max={5} size="default">
                  {participants}
                </AvatarGroup>
              </div>
              <DropdownMenuSeparator className="m-0" />
              <div className="p-2">
                <DropdownMenuItem
                  asChild
                  className="p-0 cursor-pointer"
                  onClick={() => setIsLeaveDialogOpen(true)}
                >
                  <Button
                    variant={"destructive"}
                    className="w-full h-10 font-bold text-xs rounded-sm gap-2"
                  >
                    <LogOut className="size-3.5" />
                    Leave Room
                  </Button>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop End Button */}
          <Button
            variant={"destructive"}
            className="rounded-sm font-bold text-xs hidden sm:block px-6"
            onClick={() => setIsLeaveDialogOpen(true)}
          >
            Leave Room
          </Button>
        </SiteHeader.End>
      </SiteHeader>

      <ConfirmDialog
        open={isLeaveDialogOpen}
        onOpenChange={setIsLeaveDialogOpen}
        title="Leave Interview Room?"
        description="Are you sure you want to leave the interview room? Any unsaved progress may be lost."
        confirmLabel="Leave Room"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleLeave}
      />
    </>
  );
}
