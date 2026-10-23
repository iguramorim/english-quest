# English Quest 🗺️

A playable 2D exploration RPG for learning English — built with **Next.js 14, TypeScript, React, Tailwind CSS, shadcn-style UI, HTML5 Canvas and Framer Motion**. No backend, no database, no authentication: all progress is saved to the browser's `localStorage`.

## Running it locally

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

To build for production:

```bash
npm run build
npm run start
```

## How it plays

1. **Home page (`/`)** — welcome screen. First-time players pick a name and difficulty (A1 Beginner / A2 Elementary). Returning players see **Continue Adventure** / **New Game** (with a confirmation before erasing progress).
2. **Game page (`/game`)** — the actual town. Move with **WASD** or **arrow keys** (touch D-pad on mobile). Walk up to an NPC and press **E** (or tap **Talk** on mobile) to interact.
3. Interacting opens a short **dialogue** (when the mission has one) followed by a **quiz** made of several challenge types (multiple choice, translation, fill‑in‑the‑blank, sentence builder, vocabulary matching, grammar). Finishing a mission grants XP, coins, and sometimes unlocks new vocabulary or a new part of town.
4. The **menu** (top-right, or the hamburger icon) has tabs for **Quests**, **Vocabulary**, **Achievements**, **Map**, **Progress**, and **Settings** (manual save / new game).
5. Leveling up and unlocking achievements trigger their own celebratory animations.

## Project structure

```
app/
  page.tsx            – start screen (name, difficulty, continue/new game)
  game/page.tsx        – main game orchestration (canvas + HUD + mission flow)
components/
  game/                – GameCanvas, HUD, DialogueBox, QuizModal, GameMenu, etc.
  ui/                  – hand-rolled shadcn-style primitives (Button, Card, Dialog, ...)
lib/
  game/                – game-engine.ts (canvas loop), map.ts, collision.ts, player.ts,
                         questions.ts, vocabulary.ts, dialogues.ts, quests.ts, achievements.ts
  storage/game-storage.ts – localStorage persistence layer (versioned, corruption-safe)
  utils.ts
hooks/
  use-game.ts          – game state reducer: XP/leveling, hearts, achievements, autosave
types/
  game.ts              – shared TypeScript types
```

### Why this split?

The Canvas (`GameCanvas` + `GameEngine`) only ever handles **movement, collision, camera and rendering** — high-frequency state (player position, walk animation) lives entirely inside the engine and never triggers a React re-render. React only hears about *meaningful* events: proximity to an NPC changed, the player pressed interact, or the position should be persisted (throttled). Everything else — dialogue, quizzes, menus, HUD — is ordinary React + Tailwind.

### Content bank

`lib/game/` ships with **50 questions**, **32 vocabulary words**, **10 dialogues**, **20 missions**, and **10 achievements**, spread across all 8 locations and levels A1 → B1. Adding more is just adding another object to the relevant array — no other code needs to change.

### Extending it

- **New location**: add it to `LOCATIONS` and an NPC to `NPCS` in `lib/game/map.ts`, then add missions/questions/vocabulary/dialogues that reference it.
- **New challenge type**: add the shape to `types/game.ts`, add a `case` to `QuestionBody` in `components/game/QuizModal.tsx`.
- **Audio**: a "Listen" button (`SpeakButton.tsx`) already uses the browser's `SpeechSynthesis` API and hides itself automatically if unsupported — no external APIs required.

## Notes

- Everything renders client-side where it needs browser APIs (`"use client"`); `localStorage` is only ever touched after mount, never during SSR.
- The save is stored under the key `english-quest-save-v1`; an incompatible or corrupted save is detected and safely reset rather than crashing the app.
