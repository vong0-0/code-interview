import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";

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
