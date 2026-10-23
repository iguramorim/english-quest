// ---------------------------------------------------------------------------
// Core domain types shared across the engine, data files, storage and UI.
// ---------------------------------------------------------------------------

export type Difficulty = "A1" | "A2" | "B1";

export type LocationId =
  | "home"
  | "cafe"
  | "school"
  | "market"
  | "hospital"
  | "park"
  | "library"
  | "hotel";

export interface LocationDef {
  id: LocationId;
  name: string;
  emoji: string;
  description: string;
  unlockedByDefault: boolean;
  requiresLevel: number;
  /** Tile position of the building's door on the world map (grid units). */
  tile: { x: number; y: number };
  color: string;
}

// --- Challenges --------------------------------------------------------

export type ChallengeType =
  | "multiple-choice"
  | "translation"
  | "fill-blank"
  | "sentence-builder"
  | "dialogue"
  | "vocabulary"
  | "grammar";

export interface BaseQuestion {
  id: string;
  type: ChallengeType;
  difficulty: Difficulty;
  locationId: LocationId;
  prompt: string;
  promptPt?: string; // short PT-BR helper note for tricky phrasing
  explanation: string;
  xp: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice" | "dialogue" | "grammar";
  options: string[];
  correctAnswer: string;
}

export interface TranslationQuestion extends BaseQuestion {
  type: "translation";
  sourceText: string; // Portuguese sentence to translate to English
  acceptedAnswers: string[]; // normalized, lowercase, punctuation-free
}

export interface FillBlankQuestion extends BaseQuestion {
  type: "fill-blank";
  sentenceParts: [string, string]; // text before/after the blank
  options: string[];
  correctAnswer: string;
}

export interface SentenceBuilderQuestion extends BaseQuestion {
  type: "sentence-builder";
  words: string[]; // shuffled on render
  correctOrder: string[];
}

export interface VocabularyQuestion extends BaseQuestion {
  type: "vocabulary";
  word: string;
  options: string[]; // meanings
  correctAnswer: string;
}

export type Question =
  | MultipleChoiceQuestion
  | TranslationQuestion
  | FillBlankQuestion
  | SentenceBuilderQuestion
  | VocabularyQuestion;

// --- Vocabulary ----------------------------------------------------------

export interface VocabularyWord {
  id: string;
  word: string;
  emoji: string;
  translation: string;
  category: string;
  example: string;
  chapter: string; // human readable location/context where it's learned
}

// --- Dialogue --------------------------------------------------------------

export interface DialogueChoice {
  text: string;
  correct: boolean;
  feedback?: string; // shown only when correct=false, PT-BR tip
}

export interface DialogueLine {
  id: string;
  speaker: string; // npc id or "player"
  text: string;
  choices?: DialogueChoice[];
  note?: string; // PT-BR explanation shown under a tricky line
}

export interface Dialogue {
  id: string;
  npcId: string;
  locationId: LocationId;
  title: string;
  lines: DialogueLine[];
}

// --- NPCs --------------------------------------------------------------

export interface NPCDef {
  id: string;
  name: string;
  role: string;
  locationId: LocationId;
  color: string;
  greeting: string;
  tile: { x: number; y: number };
}

// --- Quests / Missions ---------------------------------------------------

export interface Mission {
  id: string;
  locationId: LocationId;
  order: number;
  title: string;
  description: string;
  npcId: string;
  dialogueId?: string;
  questionIds: string[];
  rewardXp: number;
  rewardCoins: number;
  unlocksLocation?: LocationId;
  unlocksVocabularyIds?: string[];
}

// --- Achievements ---------------------------------------------------------

export type AchievementCondition =
  | { kind: "missions-completed"; count: number }
  | { kind: "location-missions-completed"; locationId: LocationId }
  | { kind: "words-learned"; count: number }
  | { kind: "perfect-challenges"; count: number }
  | { kind: "locations-unlocked"; count: number }
  | { kind: "dialogues-completed"; count: number }
  | { kind: "level-reached"; level: number }
  | { kind: "streak"; days: number };

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: AchievementCondition;
}

// --- Player / Save state ---------------------------------------------------

export interface PlayerPosition {
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
}

export interface GameState {
  version: number;
  name: string;
  difficulty: Difficulty;
  createdAt: number;
  lastPlayedAt: number;

  level: number;
  xp: number; // xp within current level
  xpToNextLevel: number;
  totalXp: number;
  coins: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  lastStreakDate: string | null; // ISO date

  unlockedLocations: LocationId[];
  completedMissionIds: string[];
  learnedVocabularyIds: string[];
  unlockedAchievementIds: string[];
  completedDialogueIds: string[];

  perfectChallengeStreak: number; // resets on any mistake
  perfectChallengesTotal: number;

  position: PlayerPosition;
  currentLocationId: LocationId | null; // set while inside a location's mission flow
}

export const SAVE_KEY = "english-quest-save-v1";
export const SAVE_VERSION = 1;

export const LEVEL_TITLES: Record<number, string> = {
  1: "Beginner",
  2: "Explorer",
  3: "Traveler",
  4: "Communicator",
  5: "English Adventurer",
  6: "Fluent Wanderer",
  7: "Global Speaker",
};
