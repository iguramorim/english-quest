import { Menu } from "lucide-react";
import { Hearts } from "@/components/game/Hearts";
import { CoinCounter } from "@/components/game/CoinCounter";
import { XPBar } from "@/components/game/XPBar";
import { Button } from "@/components/ui/button";

export function GameHUD({
  level,
  xp,
  xpToNextLevel,
  coins,
  hearts,
  maxHearts,
  currentQuestTitle,
  currentQuestLocation,
  onOpenMenu,
}: {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  hearts: number;
  maxHearts: number;
  currentQuestTitle: string | null;
  currentQuestLocation: string | null;
  onOpenMenu: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-2 p-3 md:p-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl2 border border-ink-700 bg-ink-900/85 px-3 py-2.5 shadow-panel backdrop-blur-sm md:px-4">
        <Hearts hearts={hearts} maxHearts={maxHearts} />
        <XPBar level={level} xp={xp} xpToNextLevel={xpToNextLevel} />
        <CoinCounter coins={coins} />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          onClick={onOpenMenu}
          className="shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {currentQuestTitle && (
        <div className="pointer-events-auto self-start rounded-lg border border-ink-700 bg-ink-900/80 px-3 py-2 shadow-card backdrop-blur-sm">
          <p className="text-[11px] text-parchment-100/50">
            Current quest{currentQuestLocation ? ` in ${currentQuestLocation}` : ""}
          </p>
          <p className="text-sm font-semibold text-parchment-50">{currentQuestTitle}</p>
        </div>
      )}
    </div>
  );
}
