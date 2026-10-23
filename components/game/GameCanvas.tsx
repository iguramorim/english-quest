"use client";

import * as React from "react";
import { GameEngine, InteractionTarget } from "@/lib/game/game-engine";
import { Direction } from "@/lib/game/player";
import { LocationId } from "@/types/game";

export interface GameCanvasHandle {
  pause: () => void;
  resume: () => void;
  teleportTo: (x: number, y: number, direction: Direction) => void;
  spawnSparkle: (x: number, y: number) => void;
  requestInteract: () => void;
  setTouchDirectionActive: (dir: Direction, active: boolean) => void;
}

interface GameCanvasProps {
  initialPosition: { x: number; y: number; direction: Direction };
  unlockedLocations: LocationId[];
  onProximityChange: (target: InteractionTarget | null) => void;
  onInteract: (target: InteractionTarget) => void;
  onPositionChange: (pos: { x: number; y: number; direction: Direction }) => void;
}

export const GameCanvas = React.forwardRef<GameCanvasHandle, GameCanvasProps>(
  ({ initialPosition, unlockedLocations, onProximityChange, onInteract, onPositionChange }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const engineRef = React.useRef<GameEngine | null>(null);

    // Keep latest callbacks in refs so the engine (created once) always calls current versions.
    const callbacksRef = React.useRef({ onProximityChange, onInteract, onPositionChange });
    callbacksRef.current = { onProximityChange, onInteract, onPositionChange };

    React.useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const engine = new GameEngine(canvas, initialPosition, unlockedLocations, {
        onProximityChange: (t) => callbacksRef.current.onProximityChange(t),
        onInteract: (t) => callbacksRef.current.onInteract(t),
        onPositionChange: (p) => callbacksRef.current.onPositionChange(p),
      });
      engineRef.current = engine;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      engine.resize(rect.width, rect.height, dpr);
      engine.start();

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          engine.resize(width, height, dpr);
        }
      });
      resizeObserver.observe(container);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "KeyE") {
          engine.requestInteract();
          return;
        }
        engine.setKeyActive(e.code, true);
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        engine.setKeyActive(e.code, false);
      };
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        resizeObserver.disconnect();
        engine.stop();
        engineRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      engineRef.current?.setUnlockedLocations(unlockedLocations);
    }, [unlockedLocations]);

    React.useImperativeHandle(ref, () => ({
      pause: () => engineRef.current?.pause(),
      resume: () => engineRef.current?.resume(),
      teleportTo: (x, y, direction) => engineRef.current?.teleportTo(x, y, direction),
      spawnSparkle: (x, y) => engineRef.current?.spawnSparkle(x, y),
      requestInteract: () => engineRef.current?.requestInteract(),
      setTouchDirectionActive: (dir, active) => engineRef.current?.setTouchDirectionActive(dir, active),
    }));

    return (
      <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-ink-950">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Town exploration map"
          className="h-full w-full"
        />
      </div>
    );
  }
);
GameCanvas.displayName = "GameCanvas";
