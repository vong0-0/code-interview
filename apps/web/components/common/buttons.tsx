import { Button } from "../ui/button";

export function GetStartedButton() {
  return (
    <button className="rounded-[4px] border border-solid border-transparent font-medium text-white px-4 py-1.5 text-sm bg-primary dark:text-black hover:translate-y-[-4px] hover:bg-transparent hover:border-primary hover:text-black hover:shadow-[0px_4px_0px_0px_var(--primary)] dark:hover:text-white transition-all duration-300">
      Get Started
    </button>
  );
}

export function SignInButton() {
  return (
    <Button variant={"ghost"} className="text-muted-foreground font-semibold">
      Sign In
    </Button>
  );
}

export function JoinRoomButton() {
  return (
    <button className="w-full rounded-[4px] border border-solid border-transparent font-medium text-white px-4 py-2.5 text-sm bg-primary dark:text-black hover:translate-y-[-4px] hover:bg-transparent hover:border-primary hover:text-black hover:shadow-[0px_4px_0px_0px_var(--primary)] dark:hover:text-white transition-all duration-300">
      Join Room
    </button>
  );
}
