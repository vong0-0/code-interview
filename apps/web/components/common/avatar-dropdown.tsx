"use client";

import Link from "next/link";
import { LucideIcon, LogOut, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AvatarDropdownUser {
  name: string;
  email: string;
  image?: string | null;
}

export interface AvatarDropdownItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface AvatarDropdownProps {
  user: AvatarDropdownUser;
  items?: AvatarDropdownItem[];
  /** "collapsed" = avatar trigger + dropdown, "expanded" = full row (sidebar footer style) */
  variant?: "collapsed" | "expanded";
  trigger?: React.ReactNode;
  onLogOut?: () => void;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UserAvatar({
  user,
  size = "sm",
}: {
  user: AvatarDropdownUser;
  size?: "sm" | "md";
}) {
  return (
    <Avatar className={size === "sm" ? "h-8 w-8" : "h-9 w-9"}>
      <AvatarImage src={user.image ?? undefined} alt={user.name} />
      <AvatarFallback className="text-xs">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}

// ─── Shared dropdown content ──────────────────────────────────────────────────

function DropdownContent({
  user,
  items,
  onLogOut,
}: {
  user: AvatarDropdownUser;
  items?: AvatarDropdownItem[];
  onLogOut?: () => void;
}) {
  return (
    <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
      <DropdownMenuLabel className="flex items-center gap-3 p-3">
        <UserAvatar user={user} size="md" />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </div>
      </DropdownMenuLabel>

      {items && items.length > 0 && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </>
      )}

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={onLogOut}
        className="text-destructive focus:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AvatarDropdown({
  user,
  items,
  variant = "collapsed",
  trigger,
  onLogOut,
  className,
}: AvatarDropdownProps) {
  // Expanded — full row with user info + "..." trigger (sidebar footer style)
  if (variant === "expanded") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted",
              className,
            )}
          >
            <UserAvatar user={user} size="sm" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <MoreHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownContent user={user} items={items} onLogOut={onLogOut} />
      </DropdownMenu>
    );
  }

  // Collapsed — avatar only trigger
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ? (
          <span>{trigger}</span>
        ) : (
          <button className={cn("cursor-pointer rounded-full", className)}>
            <UserAvatar user={user} size="sm" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownContent user={user} items={items} onLogOut={onLogOut} />
    </DropdownMenu>
  );
}
