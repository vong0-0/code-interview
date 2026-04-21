"use client";

import * as React from "react";
import { FadeIn } from "@/components/common/fade-in";
import JoinRoomCard from "@/components/common/join-room-card";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Page(props: { params: React.Usable<{ code: string }> }) {
  const { code } = React.use(props.params);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (session) {
      router.replace(`/room/${code}`);
    }
  }, [session, router, code]);

  if (isPending || session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <section className="flex items-center justify-center flex-1">
      <FadeIn>
        <JoinRoomCard />
      </FadeIn>
    </section>
  );
}
