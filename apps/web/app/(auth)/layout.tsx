"use client";

import { AppSidebar } from "@/components/common/app-sidebar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen } from "lucide-react";
import { SiteHeader } from "@/components/common/site-header";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { AvatarDropdown } from "@/components/common/avatar-dropdown";
import { signOut, useSession } from "@/lib/auth-client";
import { AuthActionsSkeleton } from "@/components/common/skeletons/nav-skeletons";
import { useRouter } from "next/navigation";

const SIDEBAR_MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Question Bank", href: "/question-bank", icon: BookOpen },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

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
    <SidebarProvider>
      <AppSidebar variant="inset">
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu className="flex flex-col gap-2">
              {SIDEBAR_MENU_ITEMS.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn("w-full px-4 py-2", jetbrainsMono.className)}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </AppSidebar>
      <SidebarInset className="overflow-hidden">
        <SiteHeader
          variant={"default"}
          className="shadow-none backdrop-blur-none md:px-4 lg:px-6 py-2"
        >
          <SiteHeader.Start>
            <SidebarTrigger />
            <Separator orientation="vertical" />
            <p className="text-lg font-semibold">
              {SIDEBAR_MENU_ITEMS.find((item) => item.href === pathname)
                ?.label ?? "Overview"}
            </p>
          </SiteHeader.Start>
          <SiteHeader.End className="gap-2 md:gap-4">
            <ThemeToggle />
            <div className="block md:hidden">
              {isPending ? (
                <AuthActionsSkeleton />
              ) : (
                session && (
                  <AvatarDropdown
                    user={session.user}
                    items={[]}
                    onLogOut={handleSignOut}
                  />
                )
              )}
            </div>
          </SiteHeader.End>
        </SiteHeader>
        <div className="@container/main px-4 py-4 lg:px-6 lg:py-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
