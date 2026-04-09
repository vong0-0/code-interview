"use client";

import { JoinRoomButton } from "@/components/common/buttons";
import { SectionLabel } from "@/components/common/section-label";
import { Input } from "@/components/ui/input";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/lib/theme";
import {
  ATOM_ONE_DARK_NAME,
  CLAUDE_LIGHT_NAME,
  registerThemes,
} from "@/lib/monaco-themes";

import { FadeIn } from "@/components/common/fade-in";
import { Code, MessageSquareText, Timer } from "lucide-react";
import { FeatureCard } from "@/components/common/feature-card";
import { StepList } from "@/components/common/step-flow";
import { Button } from "@/components/ui/button";
import { EditorSkeleton } from "@/components/common/skeletons/editor-skeleton";

export default function Page() {
  const theme = useTheme();

  return (
    <>
      <HeroSection theme={theme} />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </>
  );
}

function CtaSection() {
  return (
    <section id="cta-section">
      <FadeIn duration={1000} delay={200}>
        <div className="section-container flex-center flex-col gap-8 bg-white dark:bg-black">
          <h2
            className={cn(
              jetbrainsMono.className,
              "text-center relative text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl",
            )}
          >
            Ready to run your first interview?
          </h2>

          {/* CTA button */}
          <Button className="bg-foreground text-background h-auto px-6 py-3 text-base font-medium rounded-sm hover:bg-foreground/80 transition-colors duration-300">
            Start Interviewing Now
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}

function HowItWorksSection() {
  const interviewerSteps = [
    {
      title: "Sign in",
      description: "Access your dashboard with GitHub or Google.",
    },
    {
      title: "Create a room",
      description: "Generate a unique session link in one click.",
    },
    {
      title: "Share code",
      description: "Send the room code to your candidate.",
    },
    { title: "Start", description: "Begin the live technical assessment." },
  ];

  const candidateSteps = [
    {
      title: "Receive code",
      description: "Get the session invite from your interviewer.",
    },
    {
      title: "Enter code",
      description: "No account required. Just enter the code.",
    },
    {
      title: "Type name",
      description: "Identify yourself before entering the room.",
    },
    { title: "Start", description: "Join the session and show your skills." },
  ];
  return (
    <section id="how-it-works-section">
      <div className="section-container min-h-[600px] flex flex-col justify-center">
        <FadeIn direction={"down"} delay={100} duration={500}>
          <SectionLabel className="text-start">how it works</SectionLabel>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-9">
              <div className="w-fit relative">
                <h2
                  className={cn(
                    jetbrainsMono.className,
                    "text-2xl font-medium",
                  )}
                >
                  Interviewer
                </h2>
                <div className="absolute top-1/2 -translate-y-1/2 -right-[110%] w-full h-px bg-muted-foreground"></div>
              </div>
              <StepList steps={interviewerSteps} />
            </div>
            <div className="space-y-9">
              <div className="w-fit relative">
                <h2
                  className={cn(
                    jetbrainsMono.className,
                    "text-2xl font-medium",
                  )}
                >
                  Candidate
                </h2>
                <div className="absolute top-1/2 -translate-y-1/2 -right-[110%] w-full h-px bg-muted-foreground"></div>
              </div>
              <StepList steps={candidateSteps} />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      index: "01",
      title: "Real-time Code Editor",
      description:
        "Industry-standard Monaco editor with syntax highlighting, auto-complete, and multi-cursor support for seamless collaboration.",
      icon: Code,
    },
    {
      index: "02",
      title: "Built-in Timer",
      description:
        "Keep track of interview duration with a synced countdown. Pause, resume, and extend time with a single click.",
      icon: Timer,
    },
    {
      index: "03",
      title: "Live Chat",
      description:
        "Communicate instantly with an integrated chat panel. Perfect for clarifying requirements and providing hints.",
      icon: MessageSquareText,
    },
  ];

  return (
    <section id="features-section">
      <div className="section-container min-h-[600px] flex flex-col justify-center bg-white dark:bg-black">
        <SectionLabel className="text-start">features</SectionLabel>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <FadeIn
              key={feature.index}
              delay={idx * 150}
              direction="up"
              offset={20}
            >
              <FeatureCard
                icon={feature.icon}
                index={feature.index}
                title={feature.title}
                description={feature.description}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroSection({ theme }: { theme: "light" | "dark" }) {
  return (
    <section id="hero-section">
      <FadeIn>
        <div className="section-container relative overflow-hidden">
          {/* ── Dark Mode Glow (Fog) ── */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[160px] filter transition-all duration-300 dark:block" />
          <div className="pointer-events-none absolute left-1/4 top-1/3 z-0 hidden size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] filter transition-all duration-300 dark:block" />

          <div className="relative z-10 flex flex-col gap-4 max-w-5xl mx-auto">
            <SectionLabel className="text-center md:text-start">
              real-time coding interview platform
            </SectionLabel>

            <h1
              className={cn(
                jetbrainsMono.className,
                "space-y-2.5 text-center md:text-start font-black text-4xl md:text-6xl leading-10 md:leading-14 tracking-tighter dark:text-white",
              )}
            >
              <p>The Interview Room.</p>
              <p className="text-muted-foreground">Built for Engineers.</p>
            </h1>

            <p className="max-w-xl w-full mx-auto md:mx-0 text-foreground text-center md:text-start my-4">
              Conduct technical interviews with a real-time collaborative code
              editor, live chat, and built-in timer. No distractions, just code.
            </p>

            <div className="flex flex-col gap-2 md:flex-row max-w-xl w-full mx-auto md:mx-0">
              <Input
                id="room-code-input"
                placeholder="Enter room code (e.g. ABC-123)"
              />
              <JoinRoomButton className="md:w-auto md:text-nowrap" />
            </div>

            <Link
              href={"/"}
              className="group md:mt-2 flex items-center justify-center gap-1 md:justify-start"
            >
              <span className="group-hover:text-primary text-foreground/50 text-xs md:text-sm font-medium transition-all duration-300">
                Are you an interviewer? Sign in to create a room
              </span>
              <ArrowRight className="size-4 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"></ArrowRight>
            </Link>
          </div>

          <div className="mx-auto mt-16 max-w-6xl w-full">
            <div className="relative rounded-xl border border-border/50 bg-background p-1 shadow-2xl shadow-black/10 backdrop-blur-xl hover:border-primary/30 hover:shadow-primary/10 dark:shadow-primary/5">
              {/* Window Controls */}
              <div className="flex items-center gap-1.5 px-4 py-3">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-yellow-500/80" />
                <div className="size-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">
                  main.py — CodeInterview
                </span>
              </div>

              <Editor
                loading={<EditorSkeleton />}
                height="300px"
                className="overflow-hidden rounded-b-lg border-t border-border/20"
                defaultLanguage="python"
                theme={
                  theme === "dark" ? ATOM_ONE_DARK_NAME : CLAUDE_LIGHT_NAME
                }
                beforeMount={registerThemes}
                value={`def solve_challenge(data):\n    # Implement the optimized sorting algorithm here\n    result = []\n    for item in data:\n        if item.is_valid():\n            result.append(item.process())\n    \n    return sorted(result)`}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  fontFamily: jetbrainsMono.style.fontFamily,
                  lineNumbers: "on",
                  roundedSelection: true,
                  scrollbar: {
                    vertical: "hidden",
                    horizontal: "hidden",
                  },
                  padding: { top: 16, bottom: 16 },
                  cursorStyle: "line",
                  renderLineHighlight: "none",
                  folding: false,
                  cursorBlinking: "solid",
                  cursorWidth: 0,
                  selectionHighlight: false,
                  occurrencesHighlight: "off",
                  guides: {
                    indentation: false,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
