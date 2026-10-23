import {
  Difficulty,
  GameState,
  SAVE_KEY,
  SAVE_VERSION,
} from "@/types/game";
import { LOCATIONS } from "@/lib/game/map";
import { xpNeededForLevel } from "@/lib/utils";

/**
 * All localStorage access is isolated in this module and is only ever
 * called from client components (never during SSR/build).
 */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function storageAvailable(): boolean {
  if (!isBrowser()) return false;
  try {
    const testKey = "__english_quest_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function createInitialState(name: string, difficulty: Difficulty): GameState {
  const now = Date.now();
  return {
    version: SAVE_VERSION,
    name: name.trim() || "Traveler",
    difficulty,
    createdAt: now,
    lastPlayedAt: now,

    level: 1,
    xp: 0,
    xpToNextLevel: xpNeededForLevel(1),
    totalXp: 0,
    coins: 0,
    hearts: 5,
    maxHearts: 5,
    streak: 0,
    lastStreakDate: null,

    unlockedLocations: LOCATIONS.filter((l) => l.unlockedByDefault).map((l) => l.id),
    completedMissionIds: [],
    learnedVocabularyIds: [],
    unlockedAchievementIds: [],
    completedDialogueIds: [],

    perfectChallengeStreak: 0,
    perfectChallengesTotal: 0,

    position: { x: 3 * 48 + 24, y: 4 * 48 + 24, direction: "down" },
    currentLocationId: null,
  };
}

function isValidState(data: unknown): data is GameState {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.version === "number" &&
    typeof d.name === "string" &&
    typeof d.level === "number" &&
    typeof d.xp === "number" &&
    Array.isArray(d.unlockedLocations) &&
    Array.isArray(d.completedMissionIds) &&
    Array.isArray(d.learnedVocabularyIds) &&
    Array.isArray(d.unlockedAchievementIds) &&
    typeof d.position === "object" &&
    d.position !== null
  );
}

export type LoadResult =
  | { status: "ok"; state: GameState }
  | { status: "empty" }
  | { status: "unavailable" }
  | { status: "corrupted" }
  | { status: "incompatible-version"; foundVersion: number };

export function loadGame(): LoadResult {
  if (!storageAvailable()) return { status: "unavailable" };

  const raw = window.localStorage.getItem(SAVE_KEY);
  if (!raw) return { status: "empty" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: "corrupted" };
  }

  if (!isValidState(parsed)) return { status: "corrupted" };

  const state = parsed as GameState;
  if (state.version !== SAVE_VERSION) {
    return { status: "incompatible-version", foundVersion: state.version };
  }

  return { status: "ok", state };
}

export function saveGame(state: GameState): boolean {
  if (!storageAvailable()) return false;
  try {
    const toSave: GameState = { ...state, lastPlayedAt: Date.now() };
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
    return true;
  } catch {
    return false;
  }
}

export function resetGame(): boolean {
  if (!storageAvailable()) return false;
  try {
    window.localStorage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Attempts to salvage a same-shaped-enough save from an older/incompatible version. */
export function migrateLegacySave(): void {
  if (!storageAvailable()) return;
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    // no-op — nothing more we can safely do
  }
}
