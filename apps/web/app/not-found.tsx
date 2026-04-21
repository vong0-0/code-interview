"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Orbit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

export function NotFound() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleNavigate = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center overflow-hidden relative font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse" />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center gap-6">
        {/* Animated 404 Heading */}
        <div className="relative group">
          <h1
            className={cn(
              "text-[150px] md:text-[200px] font-black leading-none tracking-tighter select-none",
              "bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground/80 to-primary/40",
              "animate-in fade-in zoom-in duration-700",
            )}
          >
            404
          </h1>
          <Orbit className="absolute -top-4 -right-10 size-16 text-emerald-500/50 animate-spin transition-transform duration-[10000ms] linear" />
        </div>

        {/* Sub-text */}
        <div className="space-y-4 max-w-md animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Orbit Not Found
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed px-6">
            It seems your session has drifted into uncharted space. The page you
            are looking for doesn&apos;t exist or has moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center pt-8 animate-in slide-in-from-bottom-20 fade-in duration-1000 delay-500">
          <Button
            size="lg"
            variant="default"
            disabled={isPending}
            onClick={handleNavigate}
            className={cn(
              "h-12 min-w-[200px] px-8 rounded-full font-semibold transition-all duration-300",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]",
              "hover:scale-[1.02] active:scale-[0.98]",
            )}
          >
            {isPending ? "Connecting..." : "Back to Home"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
