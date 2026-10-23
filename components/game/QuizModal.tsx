"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types/game";
import { Button } from "@/components/ui/button";
import { cn, normalizeAnswer } from "@/lib/utils";
import { SpeakButton } from "@/components/game/SpeakButton";

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface QuizModalProps {
  questions: Question[];
  onFinished: (result: { correctCount: number; total: number }) => void;
  onCorrect: (xp: number) => void;
  onWrong: () => void;
}

type Phase = "answering" | "feedback";

export function QuizModal({ questions, onFinished, onCorrect, onWrong }: QuizModalProps) {
  const [qIndex, setQIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("answering");
  const [wasCorrect, setWasCorrect] = React.useState(false);
  const [correctCount, setCorrectCount] = React.useState(0);

  const question = questions[qIndex];

  const submitAnswer = (correct: boolean) => {
    setWasCorrect(correct);
    setPhase("feedback");
    if (correct) {
      onCorrect(question.xp);
      setCorrectCount((c) => c + 1);
    } else {
      onWrong();
    }
  };

  const goNext = () => {
    if (qIndex + 1 >= questions.length) {
      onFinished({ correctCount, total: questions.length });
    } else {
      setQIndex((i) => i + 1);
      setPhase("answering");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-parchment-100/50">
        <span>
          Question {qIndex + 1} of {questions.length}
        </span>
        <span>{question.difficulty}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18 }}
        >
          <QuestionBody
            question={question}
            phase={phase}
            wasCorrect={wasCorrect}
            onSubmit={submitAnswer}
          />
        </motion.div>
      </AnimatePresence>

      {phase === "feedback" && (
        <div
          className={cn(
            "rounded-lg border p-3 text-sm",
            wasCorrect ? "border-moss-500 bg-moss-500/15" : "border-coral-500 bg-coral-500/10"
          )}
        >
          <p className="font-semibold mb-1">{wasCorrect ? "Correct!" : "Not quite."}</p>
          <p className="text-parchment-100/80">{question.explanation}</p>
          <Button className="mt-3" size="sm" onClick={goNext}>
            {qIndex + 1 >= questions.length ? "Finish" : "Next question"}
          </Button>
        </div>
      )}
    </div>
  );
}

function QuestionBody({
  question,
  phase,
  wasCorrect,
  onSubmit,
}: {
  question: Question;
  phase: Phase;
  wasCorrect: boolean;
  onSubmit: (correct: boolean) => void;
}) {
  const disabled = phase === "feedback";

  // Hooks must run unconditionally on every render of this component instance.
  // `options` only exists on some question types, so we compute a safe source
  // array once here and shuffle it — instead of calling useMemo per-branch.
  const optionsSource: string[] = "options" in question ? question.options : [];
  const options = React.useMemo(() => shuffled(optionsSource), [question.id]); // eslint-disable-line react-hooks/exhaustive-deps

  switch (question.type) {
    case "multiple-choice":
    case "dialogue":
    case "grammar": {
      return (
        <div className="flex flex-col gap-3">
          <PromptHeader text={question.prompt} note={question.promptPt} />
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <Button
                key={opt}
                variant="outline"
                disabled={disabled}
                className={cn(
                  "justify-start h-auto whitespace-normal py-3 text-left",
                  disabled && opt === question.correctAnswer && "border-moss-500 bg-moss-500/15"
                )}
                onClick={() => onSubmit(opt === question.correctAnswer)}
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>
      );
    }

    case "vocabulary": {
      return (
        <div className="flex flex-col gap-3">
          <PromptHeader text={question.prompt} note={question.promptPt} spokenText={question.word} />
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <Button
                key={opt}
                variant="outline"
                disabled={disabled}
                className="justify-start h-auto whitespace-normal py-3 text-left"
                onClick={() => onSubmit(opt === question.correctAnswer)}
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>
      );
    }

    case "fill-blank": {
      return (
        <div className="flex flex-col gap-3">
          <p className="text-base leading-relaxed">
            {question.sentenceParts[0]}
            <span className="mx-1 rounded border-b-2 border-dashed border-amber-400 px-2 text-amber-300">
              ____
            </span>
            {question.sentenceParts[1]}
          </p>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
              <Button
                key={opt}
                variant="outline"
                disabled={disabled}
                onClick={() => onSubmit(opt === question.correctAnswer)}
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>
      );
    }

    case "sentence-builder": {
      return <SentenceBuilder question={question} disabled={disabled} onSubmit={onSubmit} />;
    }

    case "translation": {
      return <TranslationInput question={question} disabled={disabled} onSubmit={onSubmit} />;
    }

    default:
      return null;
  }
}

function PromptHeader({ text, note, spokenText }: { text: string; note?: string; spokenText?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-base leading-relaxed">{text}</p>
        <SpeakButton text={spokenText ?? text} />
      </div>
      {note && <p className="mt-1 text-xs text-parchment-100/60">{note}</p>}
    </div>
  );
}

function SentenceBuilder({
  question,
  disabled,
  onSubmit,
}: {
  question: Extract<Question, { type: "sentence-builder" }>;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}) {
  const pool = React.useMemo(() => shuffled(question.words), [question.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const [chosen, setChosen] = React.useState<string[]>([]);
  // Track by index to allow duplicate words safely.
  const [usedIndicesState, setUsedIndicesState] = React.useState<Set<number>>(new Set());
  const usedIndices = usedIndicesState;

  const pick = (word: string, idx: number) => {
    if (disabled || usedIndices.has(idx)) return;
    setChosen((c) => [...c, word]);
    setUsedIndicesState((s) => new Set(s).add(idx));
  };

  const undo = () => {
    if (disabled || chosen.length === 0) return;
    const lastWord = chosen[chosen.length - 1];
    setChosen((c) => c.slice(0, -1));
    setUsedIndicesState((s) => {
      const arr = Array.from(s);
      // remove the last-added index matching lastWord
      for (let i = arr.length - 1; i >= 0; i--) {
        if (pool[arr[i]] === lastWord) {
          const next = new Set(s);
          next.delete(arr[i]);
          return next;
        }
      }
      return s;
    });
  };

  const check = () => {
    const correct = chosen.join(" ") === question.correctOrder.join(" ");
    onSubmit(correct);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base leading-relaxed">{question.prompt}</p>

      <div className="min-h-[46px] rounded-lg border border-ink-700 bg-ink-800/60 p-2 flex flex-wrap gap-2">
        {chosen.length === 0 && <span className="text-sm text-parchment-100/40">Tap words below in order…</span>}
        {chosen.map((w, i) => (
          <span key={i} className="rounded-md bg-moss-500 px-2 py-1 text-sm font-medium">
            {w}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {pool.map((w, idx) => (
          <Button
            key={idx}
            size="sm"
            variant="outline"
            disabled={disabled || usedIndices.has(idx)}
            onClick={() => pick(w, idx)}
          >
            {w}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 self-end">
        <Button variant="ghost" size="sm" onClick={undo} disabled={disabled || chosen.length === 0}>
          Undo
        </Button>
        <Button size="sm" onClick={check} disabled={disabled || chosen.length !== pool.length}>
          Check
        </Button>
      </div>
    </div>
  );
}

function TranslationInput({
  question,
  disabled,
  onSubmit,
}: {
  question: Extract<Question, { type: "translation" }>;
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}) {
  const [value, setValue] = React.useState("");

  const check = () => {
    const correct = question.acceptedAnswers.includes(normalizeAnswer(value));
    onSubmit(correct);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base leading-relaxed">{question.prompt}</p>
      <p className="text-lg font-display font-semibold text-parchment-50">&ldquo;{question.sourceText}&rdquo;</p>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value.trim() && check()}
        placeholder="Type your answer in English…"
        aria-label="Your translation"
        className="rounded-lg border border-ink-700 bg-ink-800/60 px-3 py-2.5 text-parchment-50 placeholder:text-parchment-100/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      />
      <Button size="sm" className="self-end" disabled={disabled || !value.trim()} onClick={check}>
        Check
      </Button>
    </div>
  );
}
