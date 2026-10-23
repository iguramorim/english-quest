import { VOCABULARY } from "@/lib/game/vocabulary";
import { SpeakButton } from "@/components/game/SpeakButton";
import { Lock } from "lucide-react";

export function VocabularyBook({ learnedIds }: { learnedIds: string[] }) {
  const learnedSet = new Set(learnedIds);
  const sorted = [...VOCABULARY].sort((a, b) => {
    const aLearned = learnedSet.has(a.id) ? 0 : 1;
    const bLearned = learnedSet.has(b.id) ? 0 : 1;
    return aLearned - bLearned;
  });

  return (
    <div>
      <p className="mb-3 text-xs text-parchment-100/50">
        {learnedIds.length} of {VOCABULARY.length} words learned
      </p>
      <div className="flex flex-col gap-2">
        {sorted.map((w) => {
          const learned = learnedSet.has(w.id);
          return (
            <div
              key={w.id}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                learned ? "border-ink-700 bg-ink-800/40" : "border-ink-700/50 bg-ink-800/10 opacity-50"
              }`}
            >
              <span className="text-xl">{learned ? w.emoji : <Lock className="h-4 w-4" />}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{learned ? w.word : "???"}</p>
                  {learned && <SpeakButton text={w.word} />}
                </div>
                {learned && (
                  <>
                    <p className="text-xs text-parchment-100/60">{w.translation} · {w.category}</p>
                    <p className="text-xs text-parchment-100/40 italic mt-0.5">&ldquo;{w.example}&rdquo;</p>
                  </>
                )}
              </div>
              {learned && <span className="text-[10px] text-parchment-100/40 text-right">{w.chapter}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
