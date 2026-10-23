"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestPanel } from "@/components/game/QuestPanel";
import { VocabularyBook } from "@/components/game/VocabularyBook";
import { MapProgress } from "@/components/game/MapProgress";
import { ACHIEVEMENTS } from "@/lib/game/achievements";
import { GameState, LEVEL_TITLES } from "@/types/game";
import { useToast } from "@/components/ui/toast";
import { totalVocabularyCount, totalLocationsCount } from "@/hooks/use-game";

export function GameMenu({
  open,
  onOpenChange,
  state,
  onSaveNow,
  onNewGame,
  onOpenFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: GameState;
  onSaveNow: () => void;
  onNewGame: () => void;
  onOpenFocus: () => void;
}) {
  const { toast } = useToast();
  const [confirmingReset, setConfirmingReset] = React.useState(false);

  const handleSave = () => {
    onSaveNow();
    toast({ title: "Game saved!", variant: "success" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[92vw] sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <p className="text-xs text-parchment-100/50">
            {state.name} · Level {state.level} {LEVEL_TITLES[state.level] ?? ""}
          </p>
        </SheetHeader>

        <Tabs defaultValue="quests">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="focus">Focus</TabsTrigger>
            <TabsTrigger value="quests">Quests</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="focus">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-parchment-100/70">
                A short, judgment-free review session — no hearts at risk. Great for a coffee
                break or a few spare minutes.
              </p>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onOpenFocus();
                }}
              >
                🎯 Start a focus session
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="quests">
            <QuestPanel
              completedMissionIds={state.completedMissionIds}
              unlockedLocations={state.unlockedLocations}
            />
          </TabsContent>

          <TabsContent value="vocabulary">
            <VocabularyBook learnedIds={state.learnedVocabularyIds} />
          </TabsContent>

          <TabsContent value="achievements">
            <div className="flex flex-col gap-2">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = state.unlockedAchievementIds.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                      unlocked ? "border-amber-400/50 bg-amber-400/10" : "border-ink-700 bg-ink-800/30 opacity-50"
                    }`}
                  >
                    <span className="text-2xl">{a.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="text-xs text-parchment-100/60">{a.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="map">
            <MapProgress unlockedLocations={state.unlockedLocations} />
          </TabsContent>

          <TabsContent value="progress">
            <div className="flex flex-col gap-4">
              <StatRow label="Total XP earned" value={state.totalXp.toLocaleString("en-US")} />
              <StatRow label="Coins" value={state.coins.toLocaleString("en-US")} />
              <StatRow
                label="Missions completed"
                value={`${state.completedMissionIds.length}`}
              />
              <StatRow
                label="Words learned"
                value={`${state.learnedVocabularyIds.length} / ${totalVocabularyCount()}`}
              />
              <StatRow
                label="Locations unlocked"
                value={`${state.unlockedLocations.length} / ${totalLocationsCount()}`}
              />
              <StatRow label="Conversations completed" value={`${state.completedDialogueIds.length}`} />
              <StatRow label="Achievements" value={`${state.unlockedAchievementIds.length} / ${ACHIEVEMENTS.length}`} />
              <div>
                <p className="mb-1 text-xs text-parchment-100/50">Level progress</p>
                <Progress value={Math.min(100, Math.round((state.xp / state.xpToNextLevel) * 100))} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="flex flex-col gap-3">
              <Button onClick={handleSave}>Save now</Button>
              {!confirmingReset ? (
                <Button variant="coral" onClick={() => setConfirmingReset(true)}>
                  New game
                </Button>
              ) : (
                <div className="rounded-lg border border-coral-500 bg-coral-500/10 p-3">
                  <p className="text-sm mb-2">
                    This will permanently erase your current progress. Are you sure?
                  </p>
                  <div className="flex gap-2">
                    <Button variant="coral" size="sm" onClick={onNewGame}>
                      Yes, erase and restart
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setConfirmingReset(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-xs text-parchment-100/40">
                Your progress is saved automatically in this browser (localStorage). No account or
                internet connection is required.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-800 pb-2">
      <span className="text-sm text-parchment-100/70">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
