import { Achievement } from "@/types/game";
import { VOCABULARY } from "@/lib/game/vocabulary";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "a-first-steps", title: "First Steps", emoji: "🏆",
    description: "Complete your first mission.",
    condition: { kind: "missions-completed", count: 1 },
  },
  {
    id: "a-coffee-lover", title: "Coffee Lover", emoji: "☕",
    description: "Complete all Café missions.",
    condition: { kind: "location-missions-completed", locationId: "cafe" },
  },
  {
    id: "a-vocabulary-builder", title: "Vocabulary Builder", emoji: "📖",
    description: "Learn 15 words.",
    condition: { kind: "words-learned", count: 15 },
  },
  {
    id: "a-word-master", title: "Word Master", emoji: "🧠",
    description: "Learn all the words in the game.",
    condition: { kind: "words-learned", count: VOCABULARY.length },
  },
  {
    id: "a-perfect-day", title: "Perfect Day", emoji: "✨",
    description: "Complete 5 challenges in a row without a mistake.",
    condition: { kind: "perfect-challenges", count: 5 },
  },
  {
    id: "a-explorer", title: "Explorer", emoji: "🧭",
    description: "Unlock 5 locations.",
    condition: { kind: "locations-unlocked", count: 5 },
  },
  {
    id: "a-globetrotter", title: "Globetrotter", emoji: "🗺️",
    description: "Unlock every location in town.",
    condition: { kind: "locations-unlocked", count: 8 },
  },
  {
    id: "a-english-speaker", title: "English Speaker", emoji: "🗣️",
    description: "Complete your first conversation.",
    condition: { kind: "dialogues-completed", count: 1 },
  },
  {
    id: "a-conversationalist", title: "Conversationalist", emoji: "💬",
    description: "Complete 8 conversations.",
    condition: { kind: "dialogues-completed", count: 8 },
  },
  {
    id: "a-graduate", title: "Graduate", emoji: "🎓",
    description: "Reach Level 5 — English Adventurer.",
    condition: { kind: "level-reached", level: 5 },
  },
];

export function achievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
