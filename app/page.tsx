"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loadGame, saveGame, resetGame, createInitialState } from "@/lib/storage/game-storage";
import { Difficulty } from "@/types/game";

type Step = "checking" | "welcome-back" | "intro" | "name" | "difficulty" | "confirm-reset";

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("checking");
  const [existingName, setExistingName] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [notice, setNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    const result = loadGame();
    if (result.status === "ok") {
      setExistingName(result.state.name);
      setStep("welcome-back");
    } else {
      if (result.status === "corrupted") setNotice("Seu save anterior estava corrompido e foi reiniciado.");
      if (result.status === "incompatible-version") setNotice("Seu save era de uma versão antiga e foi reiniciado.");
      if (result.status === "unavailable")
        setNotice("Não foi possível acessar o armazenamento local — seu progresso não será salvo neste navegador.");
      setStep("intro");
    }
  }, []);

  const beginNewGameFlow = () => {
    setName("");
    setStep("name");
  };

  const startGame = (difficulty: Difficulty) => {
    const state = createInitialState(name, difficulty);
    saveGame(state);
    router.push("/game");
  };

  const confirmReset = () => {
    resetGame();
    setExistingName(null);
    beginNewGameFlow();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <TownBackdrop />

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === "checking" && <div key="checking" className="h-40" />}

          {step === "welcome-back" && (
            <StepCard key="welcome-back">
              <Logo />
              <p className="text-center text-parchment-100/70 mb-6">
                Welcome back, <span className="font-semibold text-parchment-50">{existingName}</span>!
                Your town is waiting.
              </p>
              <div className="flex flex-col gap-3">
                <Button size="lg" onClick={() => router.push("/game")}>
                  Continue Adventure
                </Button>
                <Button size="lg" variant="outline" onClick={() => setStep("confirm-reset")}>
                  New Game
                </Button>
              </div>
            </StepCard>
          )}

          {step === "confirm-reset" && (
            <StepCard key="confirm-reset">
              <h2 className="font-display text-xl font-semibold text-center mb-2">Start a new adventure?</h2>
              <p className="text-center text-sm text-parchment-100/70 mb-6">
                This will permanently erase {existingName}&apos;s progress. This can&apos;t be undone.
              </p>
              <div className="flex flex-col gap-3">
                <Button size="lg" variant="coral" onClick={confirmReset}>
                  Yes, erase and start over
                </Button>
                <Button size="lg" variant="ghost" onClick={() => setStep("welcome-back")}>
                  Cancel
                </Button>
              </div>
            </StepCard>
          )}

          {step === "intro" && (
            <StepCard key="intro">
              <Logo />
              {notice && (
                <p className="mb-4 text-center text-xs text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-lg p-2">
                  {notice}
                </p>
              )}
              <p className="text-center text-parchment-100/70 mb-6">
                Explore a small town, meet its people, and learn real-world English one quest at a
                time.
              </p>
              <Button size="lg" className="w-full" onClick={beginNewGameFlow}>
                Start Adventure
              </Button>
            </StepCard>
          )}

          {step === "name" && (
            <StepCard key="name">
              <h2 className="font-display text-xl font-semibold text-center mb-1">What&apos;s your name?</h2>
              <p className="text-center text-sm text-parchment-100/60 mb-6">
                This is how the townsfolk will greet you.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (name.trim()) setStep("difficulty");
                }}
                className="flex flex-col gap-3"
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  aria-label="Your name"
                  maxLength={20}
                  className="rounded-lg border border-ink-700 bg-ink-800/60 px-4 py-3 text-center text-lg text-parchment-50 placeholder:text-parchment-100/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                />
                <Button size="lg" type="submit" disabled={!name.trim()}>
                  Next
                </Button>
              </form>
            </StepCard>
          )}

          {step === "difficulty" && (
            <StepCard key="difficulty">
              <h2 className="font-display text-xl font-semibold text-center mb-1">
                Choose your difficulty
              </h2>
              <p className="text-center text-sm text-parchment-100/60 mb-6">
                You can always find more challenging quests as you level up.
              </p>
              <div className="flex flex-col gap-3">
                <DifficultyOption
                  title="Beginner"
                  subtitle="A1 · New to English"
                  onClick={() => startGame("A1")}
                />
                <DifficultyOption
                  title="Elementary"
                  subtitle="A2 · Know some basics"
                  onClick={() => startGame("A2")}
                />
              </div>
            </StepCard>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <Card>
        <CardContent className="pt-6">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function Logo() {
  return (
    <div className="mb-6 text-center">
      <p className="text-4xl mb-2">🗺️</p>
      <h1 className="font-display text-3xl font-bold tracking-tight">English Quest</h1>
      <p className="text-sm text-lagoon-300 mt-1">Learn English. Explore the world.</p>
    </div>
  );
}

function DifficultyOption({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-ink-700 bg-ink-800/50 p-4 text-left transition-colors hover:border-amber-400 hover:bg-ink-800 focus-visible:outline-none"
    >
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-parchment-100/60">{subtitle}</p>
    </button>
  );
}

function TownBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg viewBox="0 0 400 200" className="absolute bottom-0 w-full opacity-30" preserveAspectRatio="none">
        <rect x="0" y="120" width="60" height="80" fill="#25404F" />
        <rect x="70" y="90" width="50" height="110" fill="#1B2F3B" />
        <rect x="130" y="140" width="70" height="60" fill="#25404F" />
        <rect x="210" y="100" width="55" height="100" fill="#1B2F3B" />
        <rect x="275" y="130" width="60" height="70" fill="#25404F" />
        <rect x="340" y="95" width="60" height="105" fill="#1B2F3B" />
      </svg>
      <div className="absolute -top-24 right-[-80px] h-72 w-72 rounded-full bg-lagoon-500/10 blur-3xl" />
      <div className="absolute top-1/3 left-[-100px] h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
    </div>
  );
}
