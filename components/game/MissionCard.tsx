import { Mission } from "@/types/game";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function MissionCard({
  mission,
  completed,
  locked,
}: {
  mission: Mission;
  completed: boolean;
  locked: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3",
        completed ? "border-moss-500/50 bg-moss-500/10" : "border-ink-700 bg-ink-800/40",
        locked && "opacity-50"
      )}
    >
      <div className="mt-0.5">
        {completed ? (
          <CheckCircle2 className="h-5 w-5 text-moss-400" />
        ) : locked ? (
          <Lock className="h-5 w-5 text-parchment-100/40" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-amber-400" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{mission.title}</p>
        <p className="text-xs text-parchment-100/60">{mission.description}</p>
      </div>
      <Badge variant={completed ? "default" : "outline"}>+{mission.rewardXp} XP</Badge>
    </div>
  );
}
