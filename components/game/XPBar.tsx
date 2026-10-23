import { Progress } from "@/components/ui/progress";
import { LEVEL_TITLES } from "@/types/game";

export function XPBar({
  level,
  xp,
  xpToNextLevel,
}: {
  level: number;
  xp: number;
  xpToNextLevel: number;
}) {
  const pct = Math.min(100, Math.round((xp / xpToNextLevel) * 100));
  const title = LEVEL_TITLES[level] ?? "English Master";

  return (
    <div className="flex-1 min-w-[140px]">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-semibold text-amber-300">
          ⭐ LV.{level} <span className="text-parchment-100/60 font-normal">{title}</span>
        </span>
        <span className="text-[11px] text-parchment-100/50 tabular-nums">
          {xp}/{xpToNextLevel} XP
        </span>
      </div>
      <Progress value={pct} aria-label="Experience progress" />
    </div>
  );
}
