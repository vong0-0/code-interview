"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth-client";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AvatarDropdown } from "./avatar-dropdown";
import { Skeleton } from "../ui/skeleton";

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  function handleSignOut() {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link
          href={"/dashboard"}
          className={cn(
            jetbrainsMono.className,
            "text-lg font-bold tracking-tight",
          )}
        >
          <span className="dark:text-white">Code</span>
          <span className="text-primary">Interview</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>{children}</SidebarContent>
      <SidebarFooter className="hidden md:flex">
        {isPending ? (
          <div className="flex w-full items-center gap-3 px-2 py-2">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : (
          session && (
            <div className="hidden md:block">
              <AvatarDropdown
                variant="expanded"
                user={session.user}
                items={[]}
                onLogOut={handleSignOut}
              />
            </div>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
