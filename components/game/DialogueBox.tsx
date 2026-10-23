"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialogue } from "@/types/game";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/game/SpeakButton";

const DIALOGUE_CHOICE_XP = 15;

export function DialogueBox({
  dialogue,
  npcName,
  onCorrectChoice,
  onWrongChoice,
  onComplete,
}: {
  dialogue: Dialogue;
  npcName: string;
  onCorrectChoice: (xp: number) => void;
  onWrongChoice: () => void;
  onComplete: () => void;
}) {
  const [index, setIndex] = React.useState(0);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const line = dialogue.lines[index];
  const isLast = index === dialogue.lines.length - 1;

  const handleChoice = (correct: boolean, choiceFeedback?: string) => {
    if (correct) {
      setFeedback(null);
      onCorrectChoice(DIALOGUE_CHOICE_XP);
      goNext();
    } else {
      onWrongChoice();
      setFeedback(choiceFeedback ?? "Not quite — try another option.");
    }
  };

  const goNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const speakerLabel = line.speaker === "player" ? "You" : npcName;

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={line.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="rounded-lg border border-ink-700 bg-ink-800/60 p-4"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-lagoon-300">{speakerLabel}</span>
            {line.text && <SpeakButton text={line.text} />}
          </div>
          {line.text && <p className="text-base leading-relaxed">{line.text}</p>}
          {line.note && (
            <p className="mt-2 text-xs text-parchment-100/60 border-t border-ink-700 pt-2">{line.note}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {line.choices ? (
        <div className="flex flex-col gap-2">
          {line.choices.map((choice, i) => (
            <Button
              key={i}
              variant="outline"
              className="justify-start h-auto whitespace-normal py-3 text-left"
              onClick={() => handleChoice(choice.correct, choice.feedback)}
            >
              {choice.text}
            </Button>
          ))}
          {feedback && <p className="text-sm text-coral-400">{feedback}</p>}
        </div>
      ) : (
        <Button onClick={goNext} className="self-end">
          {isLast ? "Continue" : "Next"}
        </Button>
      )}
    </div>
  );
}
