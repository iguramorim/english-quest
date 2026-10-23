"use client";

import * as React from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Direction } from "@/lib/game/player";

function DPadButton({
  direction,
  icon,
  className,
  onPress,
}: {
  direction: Direction;
  icon: React.ReactNode;
  className?: string;
  onPress: (dir: Direction, active: boolean) => void;
}) {
  const bind = {
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onPress(direction, true);
    },
    onPointerUp: () => onPress(direction, false),
    onPointerLeave: () => onPress(direction, false),
    onPointerCancel: () => onPress(direction, false),
  };

  return (
    <button
      type="button"
      aria-label={`Move ${direction}`}
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full bg-ink-800/90 border border-ink-700 text-parchment-50 active:bg-moss-500 shadow-card touch-none select-none",
        className
      )}
      {...bind}
    >
      {icon}
    </button>
  );
}

export function MobileControls({
  onDirection,
  onInteract,
  interactVisible,
  interactLabel,
}: {
  onDirection: (dir: Direction, active: boolean) => void;
  onInteract: () => void;
  interactVisible: boolean;
  interactLabel: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-4 md:hidden">
      <div className="pointer-events-auto relative h-40 w-40">
        <DPadButton direction="up" icon={<ArrowUp className="h-6 w-6" />} className="absolute left-1/2 top-0 -translate-x-1/2" onPress={onDirection} />
        <DPadButton direction="left" icon={<ArrowLeft className="h-6 w-6" />} className="absolute left-0 top-1/2 -translate-y-1/2" onPress={onDirection} />
        <DPadButton direction="right" icon={<ArrowRight className="h-6 w-6" />} className="absolute right-0 top-1/2 -translate-y-1/2" onPress={onDirection} />
        <DPadButton direction="down" icon={<ArrowDown className="h-6 w-6" />} className="absolute left-1/2 bottom-0 -translate-x-1/2" onPress={onDirection} />
      </div>

      {interactVisible && (
        <button
          type="button"
          onClick={onInteract}
          className="pointer-events-auto mb-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-ink-950 shadow-panel active:bg-amber-300"
        >
          {interactLabel}
        </button>
      )}
    </div>
  );
}
