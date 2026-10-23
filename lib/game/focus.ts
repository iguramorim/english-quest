import { Question, LocationId } from "@/types/game";
import { questionsByLocation } from "@/lib/game/questions";

export type FocusDuration = 5 | 10;

/** Rough question count per duration — tuned for ~35–45s per question including feedback. */
const QUESTIONS_PER_DURATION: Record<FocusDuration, number> = {
  5: 8,
  10: 15,
};

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function questionCountFor(duration: FocusDuration): number {
  return QUESTIONS_PER_DURATION[duration];
}

/**
 * Builds a shuffled practice set drawn from every location the player has
 * already unlocked — a mix of familiar and lightly-new material, closer to
 * genuine review than a single mission's narrow question set.
 */
export function buildFocusSession(
  unlockedLocations: LocationId[],
  duration: FocusDuration
): Question[] {
  const pool = unlockedLocations.flatMap((loc) => questionsByLocation(loc));
  const targetCount = questionCountFor(duration);
  if (pool.length === 0) return [];

  const result: Question[] = [];
  // Cycle through freshly-reshuffled copies of the pool until we hit the target,
  // so short pools (few unlocked locations) still fill a full session without
  // the exact same order repeating back-to-back.
  while (result.length < targetCount) {
    result.push(...shuffled(pool));
  }
  return result.slice(0, targetCount);
}
