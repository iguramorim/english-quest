"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizModal } from "@/components/game/QuizModal";
import { buildFocusSession, questionCountFor, FocusDuration } from "@/lib/game/focus";
import { LocationId, Question } from "@/types/game";
import { Timer } from "lucide-react";

type Phase = "picker" | "running" | "summary";

export function FocusSession({
  unlockedLocations,
  onCorrect,
  onClose,
}: {
  unlockedLocations: LocationId[];
  onCorrect: (xp: number) => void;
  onClose: () => void;
}) {
  const [phase, setPhase] = React.useState<Phase>("picker");
  const [duration, setDuration] = React.useState<FocusDuration | null>(null);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [sessionXp, setSessionXp] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);

  React.useEffect(() => {
    if (phase !== "running") return;
    const interval = window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, [phase]);

  const start = (mins: FocusDuration) => {
    setDuration(mins);
    setQuestions(buildFocusSession(unlockedLocations, mins));
    setSessionXp(0);
    setCorrectCount(0);
    setElapsedSeconds(0);
    setPhase("running");
  };

  const handleCorrect = (xp: number) => {
    onCorrect(xp);
    setSessionXp((v) => v + xp);
    setCorrectCount((c) => c + 1);
  };

  const handleFinished = () => setPhase("summary");

  const minutesLabel = `${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, "0")}`;

  if (unlockedLocations.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-parchment-100/70 text-sm">
          Explore a town first to unlock some questions to review!
        </p>
        <Button className="mt-4" onClick={onClose}>
          Back to town
        </Button>
      </div>
    );
  }

  if (phase === "picker") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-parchment-100/70">
          A quick review session — no hearts lost here, just practice. Pick how long you&apos;ve got:
        </p>
        <div className="flex flex-col gap-3">
          <DurationOption
            minutes={5}
            questionCount={questionCountFor(5)}
            onClick={() => start(5)}
          />
          <DurationOption
            minutes={10}
            questionCount={questionCountFor(10)}
            onClick={() => start(10)}
          />
        </div>
      </div>
    );
  }

  if (phase === "running") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 self-end text-xs text-parchment-100/50">
          <Timer className="h-3.5 w-3.5" />
          <span className="tabular-nums">{minutesLabel}</span>
        </div>
        <QuizModal
          questions={questions}
          onCorrect={handleCorrect}
          onWrong={() => {
            /* Review mode: mistakes are part of learning — no heart cost here. */
          }}
          onFinished={handleFinished}
        />
      </div>
    );
  }

  // phase === "summary"
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3 py-2 text-center"
    >
      <p className="text-2xl">🎯</p>
      <p className="font-display text-xl font-bold">Focus session complete!</p>
      <div className="flex gap-4 text-sm">
        <span className="text-amber-300 font-semibold">+{sessionXp} XP</span>
        <span className="text-parchment-100/70">
          {correctCount}/{questions.length} correct
        </span>
        <span className="text-parchment-100/50">{minutesLabel} min</span>
      </div>
      <p className="text-sm text-parchment-100/60 italic mt-1">
        Come back for another block whenever you&apos;ve got a few minutes!
      </p>
      <div className="flex gap-2 mt-2 w-full">
        <Button variant="outline" className="flex-1" onClick={() => setPhase("picker")}>
          Another round
        </Button>
        <Button className="flex-1" onClick={onClose}>
          Back to town
        </Button>
      </div>
    </motion.div>
  );
}

function DurationOption({
  minutes,
  questionCount,
  onClick,
}: {
  minutes: FocusDuration;
  questionCount: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-800/50 p-4 text-left transition-colors hover:border-amber-400 hover:bg-ink-800 focus-visible:outline-none"
    >
      <div>
        <p className="font-semibold">{minutes} minutes</p>
        <p className="text-xs text-parchment-100/60">~{questionCount} questions</p>
      </div>
      <span className="text-2xl">{minutes === 5 ? "☕" : "📖"}</span>
    </button>
  );
}
