export type Direction = "up" | "down" | "left" | "right";

export interface PlayerEntity {
  x: number; // pixel center-x
  y: number; // pixel center-y
  width: number;
  height: number;
  speed: number; // px/sec
  direction: Direction;
  moving: boolean;
  walkCycle: number; // 0..1, drives the walk-bounce animation
}

export const PLAYER_WIDTH = 28;
export const PLAYER_HEIGHT = 34;
export const PLAYER_SPEED = 170;

export function createPlayer(x: number, y: number, direction: Direction = "down"): PlayerEntity {
  return {
    x,
    y,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speed: PLAYER_SPEED,
    direction,
    moving: false,
    walkCycle: 0,
  };
}

export function playerBoundingBox(p: PlayerEntity) {
  return {
    x: p.x - p.width / 2,
    y: p.y - p.height / 2 + 8, // feet-weighted box so tree tops can overlap visually
    w: p.width,
    h: p.height - 10,
  };
}

export function advanceWalkCycle(p: PlayerEntity, dt: number) {
  if (p.moving) {
    p.walkCycle = (p.walkCycle + dt * 6) % (Math.PI * 2);
  } else {
    p.walkCycle = 0;
  }
}
