"use client";

import * as React from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SpeakButton({ text, className }: { text: string; className?: string }) {
  const [supported, setSupported] = React.useState(false);
  const [speaking, setSpeaking] = React.useState(false);

  React.useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  if (!supported) return null;

  const speak = () => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeaking(false);
    }
  };

  return (
    <button
      type="button"
      onClick={speak}
      aria-label="Listen to pronunciation"
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-lagoon-300 hover:text-lagoon-200 focus-visible:outline-none",
        speaking && "text-amber-300",
        className
      )}
    >
      <Volume2 className="h-3.5 w-3.5" />
      Listen
    </button>
  );
}
