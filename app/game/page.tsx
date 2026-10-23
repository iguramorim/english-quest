"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { GameCanvas, GameCanvasHandle } from "@/components/game/GameCanvas";
import { GameHUD } from "@/components/game/GameHUD";
import { MobileControls } from "@/components/game/MobileControls";
import { GameMenu } from "@/components/game/GameMenu";
import { LevelUpModal } from "@/components/game/LevelUpModal";
import { AchievementPopup } from "@/components/game/AchievementPopup";
import { DialogueBox } from "@/components/game/DialogueBox";
import { QuizModal } from "@/components/game/QuizModal";
import { FocusSession } from "@/components/game/FocusSession";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { useGame } from "@/hooks/use-game";
import { InteractionTarget } from "@/lib/game/game-engine";
import { npcById, locationById } from "@/lib/game/map";
import { nextMissionFor, missionById } from "@/lib/game/quests";
import { dialogueById } from "@/lib/game/dialogues";
import { questionsByIds } from "@/lib/game/questions";
import { VOCABULARY } from "@/lib/game/vocabulary";
import { Mission } from "@/types/game";
import { saveGame } from "@/lib/storage/game-storage";

export default function GamePage() {
  return (
    <ToastProvider>
      <GamePageInner />
    </ToastProvider>
  );
}

type MissionPhase = "dialogue" | "quiz" | "rewards";

function GamePageInner() {
  const router = useRouter();
  const { toast } = useToast();
  const game = useGame();
  const canvasRef = React.useRef<GameCanvasHandle>(null);

  const [proximity, setProximity] = React.useState<InteractionTarget | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [activeMission, setActiveMission] = React.useState<Mission | null>(null);
  const [missionPhase, setMissionPhase] = React.useState<MissionPhase>("dialogue");
  const [missionXpEarned, setMissionXpEarned] = React.useState(0);
  const [rewardSummary, setRewardSummary] = React.useState<{
    xp: number;
    coins: number;
    vocab: string[];
  } | null>(null);
  const [flavorNpc, setFlavorNpc] = React.useState<string | null>(null);
  const [focusOpen, setFocusOpen] = React.useState(false);

  React.useEffect(() => {
    if (game.status === "needs-new-game") {
      router.replace("/");
    }
  }, [game.status, router]);

  const anyOverlayOpen = menuOpen || !!activeMission || !!flavorNpc || !!game.pendingLevelUp || focusOpen;

  React.useEffect(() => {
    if (anyOverlayOpen) canvasRef.current?.pause();
    else canvasRef.current?.resume();
  }, [anyOverlayOpen]);

  const handleInteract = React.useCallback(
    (target: InteractionTarget) => {
      if (!game.state) return;
      if (target.kind !== "npc") return;
      const npc = npcById(target.id);
      if (!npc) return;

      if (target.locked) {
        const loc = locationById(target.locationId);
        toast({
          title: `${loc?.name ?? "This place"} is locked`,
          description: `Reach level ${loc?.requiresLevel ?? "?"} or finish nearby quests to unlock it.`,
        });
        return;
      }

      const next = nextMissionFor(target.locationId, game.state.completedMissionIds);
      if (next) {
        setActiveMission(next);
        setMissionPhase(next.dialogueId ? "dialogue" : "quiz");
        setMissionXpEarned(0);
        game.dispatchEvent({ type: "set-current-location", locationId: target.locationId });
      } else {
        setFlavorNpc(npc.id);
      }
    },
    [game, toast]
  );

  if (game.status !== "ready" || !game.state) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-950 text-parchment-50">
        <p className="text-sm text-parchment-100/60">Loading your adventure…</p>
      </div>
    );
  }

  const state = game.state;
  const currentMission = activeMission;
  const activeDialogue = currentMission?.dialogueId ? dialogueById(currentMission.dialogueId) : undefined;
  const activeNpc = currentMission ? npcById(currentMission.npcId) : undefined;
  const flavorNpcDef = flavorNpc ? npcById(flavorNpc) : undefined;

  const closeMissionFlow = () => {
    setActiveMission(null);
    setRewardSummary(null);
    setMissionPhase("dialogue");
    setMissionXpEarned(0);
    game.dispatchEvent({ type: "set-current-location", locationId: null });
  };

  const handleMissionQuizFinished = () => {
    if (!currentMission) return;
    const learnedNames = (currentMission.unlocksVocabularyIds ?? [])
      .map((id) => VOCABULARY.find((v) => v.id === id)?.word)
      .filter((w): w is string => Boolean(w));

    game.dispatchEvent({
      type: "complete-mission",
      missionId: currentMission.id,
      locationId: currentMission.locationId,
      rewardXp: currentMission.rewardXp,
      rewardCoins: currentMission.rewardCoins,
      unlocksLocation: currentMission.unlocksLocation,
      unlocksVocabularyIds: currentMission.unlocksVocabularyIds,
    });
    // The mission-completion bonus is awarded separately from per-question XP
    // (already granted as each answer was checked) and must NOT count toward
    // the "answered correctly" achievement streaks — it isn't a challenge.
    game.dispatchEvent({ type: "award-bonus-xp", xp: currentMission.rewardXp });
    game.dispatchEvent({ type: "touch-streak" });

    setRewardSummary({
      xp: missionXpEarned + currentMission.rewardXp,
      coins: currentMission.rewardCoins,
      vocab: learnedNames,
    });
    setMissionPhase("rewards");
  };

  const currentLocationLabel = proximity ? locationById(proximity.locationId)?.name ?? null : null;
  const currentQuest = state.unlockedLocations
    .map((locId) => nextMissionFor(locId, state.completedMissionIds))
    .find(Boolean);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        <GameCanvas
          ref={canvasRef}
          initialPosition={state.position}
          unlockedLocations={state.unlockedLocations}
          onProximityChange={setProximity}
          onInteract={handleInteract}
          onPositionChange={(pos) => game.dispatchEvent({ type: "update-position", ...pos })}
        />
      </div>

      <GameHUD
        level={state.level}
        xp={state.xp}
        xpToNextLevel={state.xpToNextLevel}
        coins={state.coins}
        hearts={state.hearts}
        maxHearts={state.maxHearts}
        currentQuestTitle={currentQuest?.title ?? null}
        currentQuestLocation={currentQuest ? locationById(currentQuest.locationId)?.name ?? null : null}
        onOpenMenu={() => setMenuOpen(true)}
      />

      {/* Desktop interaction prompt */}
      {proximity && !anyOverlayOpen && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 md:block">
          <div className="rounded-full border border-amber-400/60 bg-ink-900/90 px-4 py-2 text-sm shadow-panel">
            {proximity.locked ? (
              <span className="text-parchment-100/60">🔒 {currentLocationLabel} is locked</span>
            ) : (
              <span>
                Press <kbd className="rounded bg-ink-700 px-1.5 py-0.5 text-xs">E</kbd> to talk to{" "}
                {proximity.label}
              </span>
            )}
          </div>
        </div>
      )}

      <MobileControls
        onDirection={(dir, active) => canvasRef.current?.setTouchDirectionActive(dir, active)}
        onInteract={() => canvasRef.current?.requestInteract()}
        interactVisible={!!proximity && !anyOverlayOpen}
        interactLabel={proximity?.locked ? "🔒 Locked" : "Talk"}
      />

      <GameMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        state={state}
        onSaveNow={() => saveGame(state)}
        onNewGame={() => {
          game.hardReset();
          router.replace("/");
        }}
        onOpenFocus={() => setFocusOpen(true)}
      />

      <LevelUpModal info={game.pendingLevelUp} onClose={game.clearLevelUp} />
      <AchievementPopup
        achievement={game.pendingAchievements[0] ?? null}
        onDismiss={game.clearAchievement}
      />

      {/* Flavor dialogue when a location has no remaining missions */}
      <Dialog open={!!flavorNpc} onOpenChange={(open) => !open && setFlavorNpc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{flavorNpcDef?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-parchment-100/80 mb-4">
            &ldquo;{flavorNpcDef?.greeting}&rdquo; — There&apos;s nothing new here right now. Come back
            after leveling up or completing quests elsewhere!
          </p>
          <Button onClick={() => setFlavorNpc(null)} className="self-end">
            Okay
          </Button>
        </DialogContent>
      </Dialog>

      {/* Mission flow: dialogue -> quiz -> rewards */}
      <Dialog open={!!currentMission} onOpenChange={(open) => !open && closeMissionFlow()}>
        <DialogContent>
          {currentMission && (
            <>
              <DialogHeader>
                <DialogTitle>{currentMission.title}</DialogTitle>
              </DialogHeader>

              {missionPhase === "dialogue" && activeDialogue && activeNpc && (
                <DialogueBox
                  dialogue={activeDialogue}
                  npcName={activeNpc.name}
                  onCorrectChoice={(xp) => {
                    game.dispatchEvent({ type: "correct-answer", xp });
                    setMissionXpEarned((v) => v + xp);
                  }}
                  onWrongChoice={() => game.dispatchEvent({ type: "wrong-answer" })}
                  onComplete={() => {
                    game.dispatchEvent({ type: "complete-dialogue", dialogueId: activeDialogue.id });
                    setMissionPhase("quiz");
                  }}
                />
              )}

              {missionPhase === "quiz" && (
                <QuizModal
                  questions={questionsByIds(currentMission.questionIds)}
                  onCorrect={(xp) => {
                    game.dispatchEvent({ type: "correct-answer", xp });
                    setMissionXpEarned((v) => v + xp);
                  }}
                  onWrong={() => game.dispatchEvent({ type: "wrong-answer" })}
                  onFinished={handleMissionQuizFinished}
                />
              )}

              {missionPhase === "rewards" && rewardSummary && (
                <div className="flex flex-col items-center gap-3 py-2 text-center">
                  <p className="text-2xl">🎉</p>
                  <p className="font-display text-xl font-bold">Mission Complete!</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-amber-300 font-semibold">+{rewardSummary.xp} XP</span>
                    <span className="text-amber-300 font-semibold">+{rewardSummary.coins} Coins</span>
                  </div>
                  {rewardSummary.vocab.length > 0 && (
                    <div className="mt-1 rounded-lg border border-ink-700 bg-ink-800/50 p-3 text-left w-full">
                      <p className="text-xs text-parchment-100/50 mb-1">Vocabulary learned</p>
                      <p className="text-sm">{rewardSummary.vocab.map((w) => `"${w}"`).join(", ")}</p>
                    </div>
                  )}
                  <Button onClick={closeMissionFlow} className="mt-2 w-full">
                    Continue
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Focus mode: short, heart-safe review session across unlocked content */}
      <Dialog open={focusOpen} onOpenChange={setFocusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Focus session</DialogTitle>
          </DialogHeader>
          <FocusSession
            unlockedLocations={state.unlockedLocations}
            onCorrect={(xp) => game.dispatchEvent({ type: "correct-answer", xp })}
            onClose={() => setFocusOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
