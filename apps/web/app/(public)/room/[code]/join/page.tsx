import { FadeIn } from "@/components/common/fade-in";
import JoinRoomCard from "@/components/common/join-room-card";

export default function Page() {
  return (
    <section className="flex items-center justify-center flex-1">
      <FadeIn>
        <JoinRoomCard />
      </FadeIn>
    </section>
  );
}
