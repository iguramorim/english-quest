"use client";

import * as React from "react";
import { GameState, LocationId, Difficulty, LEVEL_TITLES } from "@/types/game";
import { createInitialState, loadGame, saveGame, resetGame } from "@/lib/storage/game-storage";
import { xpNeededForLevel } from "@/lib/utils";
import { ACHIEVEMENTS } from "@/lib/game/achievements";
import { missionsByLocation } from "@/lib/game/quests";
import { LOCATIONS } from "@/lib/game/map";
import { VOCABULARY } from "@/lib/game/vocabulary";

export type GameEvent =
  | { type: "correct-answer"; xp: number }
  | { type: "wrong-answer" }
  | { type: "award-bonus-xp"; xp: number }
  | {
      type: "complete-mission";
      missionId: string;
      locationId: LocationId;
      rewardXp: number;
      rewardCoins: number;
      unlocksLocation?: LocationId;
      unlocksVocabularyIds?: string[];
    }
  | { type: "complete-dialogue"; dialogueId: string }
  | { type: "update-position"; x: number; y: number; direction: GameState["position"]["direction"] }
  | { type: "set-current-location"; locationId: LocationId | null }
  | { type: "touch-streak" };

export interface LevelUpInfo {
  from: number;
  to: number;
  fromTitle: string;
  toTitle: string;
}

export interface NewAchievementInfo {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

interface UseGameResult {
  state: GameState | null;
  status: "loading" | "needs-new-game" | "ready";
  loadError: string | null;
  startNewGame: (name: string, difficulty: Difficulty) => void;
  dispatchEvent: (e: GameEvent) => void;
  hardReset: () => void;
  pendingLevelUp: LevelUpInfo | null;
  clearLevelUp: () => void;
  pendingAchievements: NewAchievementInfo[];
  clearAchievement: () => void;
}

function levelTitle(level: number): string {
  return LEVEL_TITLES[level] ?? "English Master";
}

/** Adds XP to `state` in place and returns level-up info if a level threshold was crossed. */
function addXpAndCheckLevelUp(state: GameState, xp: number): LevelUpInfo | null {
  state.totalXp += xp;
  state.xp += xp;
  let levelUp: LevelUpInfo | null = null;
  while (state.xp >= state.xpToNextLevel) {
    state.xp -= state.xpToNextLevel;
    const fromLevel = state.level;
    state.level += 1;
    state.xpToNextLevel = xpNeededForLevel(state.level);
    levelUp = {
      from: fromLevel,
      to: state.level,
      fromTitle: levelTitle(fromLevel),
      toTitle: levelTitle(state.level),
    };
  }
  return levelUp;
}

function checkAchievements(state: GameState): NewAchievementInfo[] {
  const unlocked: NewAchievementInfo[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (state.unlockedAchievementIds.includes(ach.id)) continue;
    let met = false;
    switch (ach.condition.kind) {
      case "missions-completed":
        met = state.completedMissionIds.length >= ach.condition.count;
        break;
      case "location-missions-completed": {
        const all = missionsByLocation(ach.condition.locationId).map((m) => m.id);
        met = all.length > 0 && all.every((id) => state.completedMissionIds.includes(id));
        break;
      }
      case "words-learned":
        met = state.learnedVocabularyIds.length >= ach.condition.count;
        break;
      case "perfect-challenges":
        met = state.perfectChallengeStreak >= ach.condition.count;
        break;
      case "locations-unlocked":
        met = state.unlockedLocations.length >= ach.condition.count;
        break;
      case "dialogues-completed":
        met = state.completedDialogueIds.length >= ach.condition.count;
        break;
      case "level-reached":
        met = state.level >= ach.condition.level;
        break;
      case "streak":
        met = state.streak >= ach.condition.days;
        break;
    }
    if (met) unlocked.push({ id: ach.id, title: ach.title, description: ach.description, emoji: ach.emoji });
  }
  return unlocked;
}

function applyEvent(state: GameState, event: GameEvent): { next: GameState; levelUp: LevelUpInfo | null } {
  let next: GameState = { ...state };
  let levelUp: LevelUpInfo | null = null;

  switch (event.type) {
    case "correct-answer": {
      next.perfectChallengeStreak += 1;
      next.perfectChallengesTotal += 1;
      const result = addXpAndCheckLevelUp(next, event.xp);
      if (result) levelUp = result;
      break;
    }
    case "award-bonus-xp": {
      // Mission-completion bonus XP — does NOT count as a "challenge answered
      // correctly", so it never touches the perfect-streak achievement counters.
      const result = addXpAndCheckLevelUp(next, event.xp);
      if (result) levelUp = result;
      break;
    }
    case "wrong-answer": {
      next.perfectChallengeStreak = 0;
      next.hearts = Math.max(0, next.hearts - 1);
      break;
    }
    case "complete-mission": {
      if (!next.completedMissionIds.includes(event.missionId)) {
        next.completedMissionIds = [...next.completedMissionIds, event.missionId];
        next.coins += event.rewardCoins;
        next.hearts = next.maxHearts; // small breather after finishing a mission
        if (event.unlocksLocation && !next.unlockedLocations.includes(event.unlocksLocation)) {
          next.unlockedLocations = [...next.unlockedLocations, event.unlocksLocation];
        }
        if (event.unlocksVocabularyIds) {
          const merged = new Set(next.learnedVocabularyIds);
          event.unlocksVocabularyIds.forEach((id) => merged.add(id));
          next.learnedVocabularyIds = Array.from(merged);
        }
      }
      break;
    }
    case "complete-dialogue": {
      if (!next.completedDialogueIds.includes(event.dialogueId)) {
        next.completedDialogueIds = [...next.completedDialogueIds, event.dialogueId];
      }
      break;
    }
    case "update-position": {
      next.position = { x: event.x, y: event.y, direction: event.direction };
      break;
    }
    case "set-current-location": {
      next.currentLocationId = event.locationId;
      break;
    }
    case "touch-streak": {
      const today = new Date().toISOString().slice(0, 10);
      if (next.lastStreakDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        next.streak = next.lastStreakDate === yesterday ? next.streak + 1 : 1;
        next.lastStreakDate = today;
      }
      break;
    }
  }

  return { next, levelUp };
}

export function useGame(): UseGameResult {
  const [state, setState] = React.useState<GameState | null>(null);
  const [status, setStatus] = React.useState<UseGameResult["status"]>("loading");
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [pendingLevelUp, setPendingLevelUp] = React.useState<LevelUpInfo | null>(null);
  const [pendingAchievements, setPendingAchievements] = React.useState<NewAchievementInfo[]>([]);

  React.useEffect(() => {
    const result = loadGame();
    switch (result.status) {
      case "ok":
        setState(result.state);
        setStatus("ready");
        break;
      case "empty":
        setStatus("needs-new-game");
        break;
      case "unavailable":
        setLoadError(
          "Seu navegador não permite salvar o progresso (localStorage indisponível). Você ainda pode jogar, mas o progresso não será salvo."
        );
        setStatus("needs-new-game");
        break;
      case "corrupted":
        setLoadError("Seu save estava corrompido e foi reiniciado.");
        setStatus("needs-new-game");
        break;
      case "incompatible-version":
        setLoadError("Seu save é de uma versão antiga do jogo e foi reiniciado.");
        setStatus("needs-new-game");
        break;
    }
  }, []);

  // Autosave whenever state changes (debounced via microtask-friendly effect).
  React.useEffect(() => {
    if (state) saveGame(state);
  }, [state]);

  const startNewGame = React.useCallback((name: string, difficulty: Difficulty) => {
    const fresh = createInitialState(name, difficulty);
    setState(fresh);
    setStatus("ready");
  }, []);

  const dispatchEvent = React.useCallback((event: GameEvent) => {
    setState((prev) => {
      if (!prev) return prev;
      const { next, levelUp } = applyEvent(prev, event);
      if (levelUp) setPendingLevelUp(levelUp);
      const newAchievements = checkAchievements(next);
      if (newAchievements.length > 0) {
        next.unlockedAchievementIds = [
          ...next.unlockedAchievementIds,
          ...newAchievements.map((a) => a.id),
        ];
        setPendingAchievements((prevList) => [...prevList, ...newAchievements]);
      }
      return next;
    });
  }, []);

  const hardReset = React.useCallback(() => {
    resetGame();
    setState(null);
    setStatus("needs-new-game");
    setPendingLevelUp(null);
    setPendingAchievements([]);
  }, []);

  const clearLevelUp = React.useCallback(() => setPendingLevelUp(null), []);
  const clearAchievement = React.useCallback(() => {
    setPendingAchievements((prev) => prev.slice(1));
  }, []);

  return {
    state,
    status,
    loadError,
    startNewGame,
    dispatchEvent,
    hardReset,
    pendingLevelUp,
    clearLevelUp,
    pendingAchievements,
    clearAchievement,
  };
}

export function totalLocationsCount(): number {
  return LOCATIONS.length;
}

export function totalVocabularyCount(): number {
  return VOCABULARY.length;
}
