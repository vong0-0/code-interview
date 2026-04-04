import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function GetStartedButton({ className }: { className?: string }) {
  return (
    <button
      className={cn(
        "rounded-[4px] border border-solid border-transparent font-medium text-white px-4 py-1.5 text-sm bg-primary dark:text-black hover:translate-y-[-4px] hover:bg-transparent hover:border-primary hover:text-black hover:shadow-[0px_4px_0px_0px_var(--primary)] dark:hover:text-white transition-all duration-300",
        className,
      )}
    >
      Get Started
    </button>
  );
}

export function SignInButton({ className }: { className?: string }) {
  return (
    <Button
      variant={"ghost"}
      className={cn("text-muted-foreground font-semibold", className)}
    >
      Sign In
    </Button>
  );
}

export function JoinRoomButton({ className }: { className?: string }) {
  return (
    <button
      className={cn(
        "w-full rounded-[4px] border border-solid border-transparent font-medium text-white px-4 py-2.5 text-sm bg-primary dark:text-black hover:translate-y-[-4px] hover:bg-transparent hover:border-primary hover:text-black hover:shadow-[0px_4px_0px_0px_var(--primary)] dark:hover:text-white transition-all duration-300",
        className,
      )}
    >
      Join Room
    </button>
  );
}
