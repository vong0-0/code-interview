import SignInCard from "@/components/common/sign-in-card";
import { FadeIn } from "@/components/common/fade-in";

export default function Page() {
  return (
    <section className="flex items-center justify-center flex-1">
      <FadeIn>
        <SignInCard />
      </FadeIn>
    </section>
  );
}
