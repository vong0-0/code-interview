"use client";

import { GetStartedButton, SignInButton } from "@/components/common/buttons";
import { SiteFooter } from "@/components/common/site-footer";
import { SiteHeader } from "@/components/common/site-header";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

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
          <div className="hidden md:flex items-center gap-4">
            <SignInButton />
            {isLandingPage && (
              <GetStartedButton
                onClick={() => {
                  const input = document.getElementById("room-code-input");
                  if (input) {
                    input.focus();
                    input.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              />
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="flex md:hidden items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </SiteHeader.End>
      </SiteHeader>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-2 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-lg">
          <SignInButton />
          {isLandingPage && (
            <GetStartedButton
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
                }, 100);
              }}
            />
          )}
        </div>
      )}
      {children}
      <SiteFooter />
    </>
  );
}
