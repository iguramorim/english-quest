import { LOCATIONS } from "@/lib/game/map";
import { LocationId } from "@/types/game";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapProgress({ unlockedLocations }: { unlockedLocations: LocationId[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {LOCATIONS.map((loc) => {
        const unlocked = unlockedLocations.includes(loc.id);
        return (
          <div
            key={loc.id}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border p-4 text-center",
              unlocked ? "border-ink-700 bg-ink-800/40" : "border-ink-700/40 bg-ink-800/10 opacity-50"
            )}
          >
            <span className="text-2xl">{unlocked ? loc.emoji : <Lock className="h-6 w-6 mx-auto" />}</span>
            <p className="text-sm font-semibold">{loc.name}</p>
            <p className="text-[11px] text-parchment-100/50">
              {unlocked ? "Unlocked" : `Reach Lv. ${loc.requiresLevel} or complete quests`}
            </p>
          </div>
        );
      })}
    </div>
  );
}
