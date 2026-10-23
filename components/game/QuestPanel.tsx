import { LOCATIONS } from "@/lib/game/map";
import { missionsByLocation } from "@/lib/game/quests";
import { MissionCard } from "@/components/game/MissionCard";
import { LocationId } from "@/types/game";

export function QuestPanel({
  completedMissionIds,
  unlockedLocations,
}: {
  completedMissionIds: string[];
  unlockedLocations: LocationId[];
}) {
  return (
    <div className="flex flex-col gap-5">
      {LOCATIONS.map((loc) => {
        const missions = missionsByLocation(loc.id);
        const unlocked = unlockedLocations.includes(loc.id);
        return (
          <div key={loc.id}>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-parchment-100/80">
              <span>{loc.emoji}</span>
              {loc.name}
            </h4>
            <div className="flex flex-col gap-2">
              {missions.map((m) => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  completed={completedMissionIds.includes(m.id)}
                  locked={!unlocked}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
