"use client";

import { GetStartedButton, SignInButton } from "@/components/common/buttons";
import { SiteFooter } from "@/components/common/site-footer";
import { SiteHeader } from "@/components/common/site-header";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Home, LayoutDashboard, BookOpen } from "lucide-react";
import { AvatarDropdown } from "@/components/common/avatar-dropdown";
import { AuthActionsSkeleton } from "@/components/common/skeletons/nav-skeletons";

const menuItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Question Bank", href: "/question-bank", icon: BookOpen },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const { data: session, isPending } = useSession();
  const router = useRouter();
  console.log(session);

  // ─── Scroll Lock ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleSignOut = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <>
      <SiteHeader variant={"transparent"} className="bg-white dark:bg-black">
        {/* Logo */}
        <SiteHeader.Start>
          <Link
            href={"/"}
            className={cn(
              jetbrainsMono.className,
              "text-lg font-bold tracking-tight",
            )}
          >
            <span className="dark:text-white">Code</span>
            <span className="text-primary">Interview</span>
          </Link>
        </SiteHeader.Start>
        {/* Desktop nav */}
        <SiteHeader.End className="gap-2 md:gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-4">
            {isPending ? (
              <AuthActionsSkeleton isLandingPage={isLandingPage} />
            ) : session ? (
              <>
                <AvatarDropdown
                  user={session.user}
                  items={menuItems}
                  onLogOut={handleSignOut}
                />
              </>
            ) : (
              <div className="hidden md:block">
                {isLandingPage && (
                  <>
                    <SignInButton />
                    <GetStartedButton
                      onClick={() => {
                        const input =
                          document.getElementById("room-code-input");
                        if (input) {
                          input.focus();
                          input.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }
                      }}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          {!isPending && !session && (
            <button
              className="flex md:hidden items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </SiteHeader.End>
      </SiteHeader>

      {/* Mobile full-screen menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-2xl transition-all duration-500 ease-in-out md:hidden",
          mobileMenuOpen && !session
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0",
        )}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <Link
            href={"/"}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              jetbrainsMono.className,
              "text-lg font-bold tracking-tight",
            )}
          >
            <span className="dark:text-white">Code</span>
            <span className="text-primary">Interview</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col">
          {/* Navigation Group - Only show if logged in */}
          {session && (
            <div className="flex flex-col gap-2 mb-10">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-3 text-xl font-medium text-foreground/80 hover:text-primary transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      {Icon && (
                        <Icon size={20} className="group-hover:text-primary" />
                      )}
                    </div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Auth/Actions Group */}
          <div className="flex flex-col gap-3 mt-auto pb-10">
            <SignInButton
              onClick={() => setMobileMenuOpen(false)}
              className="w-full justify-start rounded-xl px-4 py-6 text-lg font-semibold bg-muted hover:bg-muted/80 transition-all"
            />
            {isLandingPage && (
              <GetStartedButton
                className="w-full py-4 text-center text-lg font-bold shadow-lg shadow-primary/20"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    const input = document.getElementById("room-code-input");
                    if (input) {
                      input.focus();
                      input.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }, 400);
                }}
              />
            )}
          </div>
        </div>
      </div>
      {children}
      <SiteFooter />
    </>
  );
}
