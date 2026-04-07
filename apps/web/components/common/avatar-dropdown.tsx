"use client";

import Link from "next/link";
import { LucideIcon, LogOut } from "lucide-react";
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
  trigger?: React.ReactNode;
  onLogOut?: () => void;
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

// ─── Default trigger ──────────────────────────────────────────────────────────

function DefaultTrigger({ user }: { user: AvatarDropdownUser }) {
  return (
    <Avatar className="h-8 w-8 cursor-pointer">
      <AvatarImage src={user.image ?? undefined} alt={user.name} />
      <AvatarFallback className="text-xs">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AvatarDropdown({
  user,
  items,
  trigger,
  onLogOut,
}: AvatarDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {trigger ? <span>{trigger}</span> : <DefaultTrigger user={user} />}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-white dark:bg-black z-50"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        {/* User info */}
        <DropdownMenuLabel className="flex items-center gap-3 p-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
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
                  <DropdownMenuItem
                    key={item.href}
                    className="cursor-pointer py-2"
                    asChild
                  >
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
          className="text-destructive cursor-pointer py-2"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
