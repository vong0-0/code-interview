import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";

export function GetStartedButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-[4px] border border-solid border-transparent font-medium text-white px-4 py-1.5 text-sm bg-primary dark:text-black hover:translate-y-[-4px] hover:bg-transparent hover:border-primary hover:text-black hover:shadow-[0px_4px_0px_0px_var(--primary)] dark:hover:text-white transition-all duration-300",
        className,
      )}
    >
      Get Started
    </button>
  );
}

export function SignInButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant={"ghost"}
      {...props}
      className={cn("text-muted-foreground font-semibold", className)}
      asChild
    >
      <Link href={"/sign-in"}>Sign In</Link>
    </Button>
  );
}

export function JoinRoomButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "w-full rounded-[4px] border border-solid border-transparent font-medium text-white px-4 py-2.5 text-sm bg-primary dark:text-black hover:translate-y-[-4px] hover:bg-transparent hover:border-primary hover:text-black hover:shadow-[0px_4px_0px_0px_var(--primary)] dark:hover:text-white transition-all duration-300",
        className,
      )}
    >
      Join Room
    </button>
  );
}

export function GoogleSignInButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={cn(
        "h-auto space-x-1 text-foreground bg-white dark:bg-black border-2 border-border px-2 py-2 rounded-sm w-full text-sm hover:bg-background transition-all duration-300",
        className,
      )}
    >
      <FcGoogle className="size-5" />
      <p>Continue with Google</p>
    </Button>
  );
}

export function CreateRoomButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "w-full rounded-[4px] border border-solid border-transparent font-medium text-white px-4 py-2.5 text-sm bg-primary dark:text-black hover:translate-y-[-4px] hover:bg-transparent hover:border-primary hover:text-black hover:shadow-[0px_4px_0px_0px_var(--primary)] dark:hover:text-white transition-all duration-300",
        className,
      )}
    >
      Create Room
    </button>
  );
}

export function ResetFilterButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-8 px-2 text-muted-foreground", className)}
      {...props}
    >
      Reset
      <X className="ml-1.5 h-4 w-4" />
    </Button>
  );
}
