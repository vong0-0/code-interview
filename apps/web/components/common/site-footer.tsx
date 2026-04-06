import { cn } from "@/lib/utils";
import { jetbrainsMono } from "@/lib/fonts";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Question Bank", href: "/question-bank" },
  { label: "Sign In", href: "/sign-in" },
];

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-border bg-background px-6 py-8 md:px-8",
        className,
      )}
    >
      <div className="mx-auto flex max-w-9xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left — brand */}
        <div className="flex flex-col gap-1">
          <p
            className={cn(
              jetbrainsMono.className,
              "text-sm font-bold tracking-tight",
            )}
          >
            <span className="text-foreground">Code</span>
            <span className="text-primary">Interview</span>
          </p>
          <p
            className={cn(
              jetbrainsMono.className,
              "text-[10px] uppercase tracking-widest text-muted-foreground",
            )}
          >
            Built with Next.js · Socket.io · PostgreSQL
          </p>
        </div>

        {/* Right — links + copyright */}
        <div className="flex flex-col gap-3 md:items-end">
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CodeInterview. Engineered Precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
