"use client";

import { SectionLabel } from "@/components/common/section-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleSignInButton } from "@/components/common/buttons";
import { signIn } from "@/lib/auth-client";

export default function SignInCard() {
  const handleGoogleSignIn = () => {
    signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_WEB_URL}/dashboard`,
    });
  };

  return (
    <Card className="w-full max-w-[400px] mx-auto py-8 rounded-md">
      <CardHeader>
        <SectionLabel className="text-[10px] text-muted">
          interviewer access only
        </SectionLabel>
        <CardTitle className="text-2xl mt-4 font-bold">
          Sign in to CodeInterview
        </CardTitle>
        <CardDescription className="text-sm">
          Manage your interview rooms and question bank.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Separator className="mt-2" />

        <div className="my-6">
          <GoogleSignInButton onClick={handleGoogleSignIn} />
        </div>

        <div className="flex items-center gap-3 mb-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <p className="text-xs text-muted-foreground text-center px-4 mt-6">
          Don&apos;t have an account? Signing in will create one automatically.
        </p>
      </CardContent>
    </Card>
  );
}
