import { TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH, buildingObstacles, isTreeTile } from "@/lib/game/map";

export interface AABB {
  x: number;
  y: number;
  w: number;
  h: number;
}

const obstacles = buildingObstacles();

function tileRectToPixels(rect: { x: number; y: number; w: number; h: number }): AABB {
  return {
    x: rect.x * TILE_SIZE,
    y: rect.y * TILE_SIZE,
    w: rect.w * TILE_SIZE,
    h: rect.h * TILE_SIZE,
  };
}

function intersects(a: AABB, b: AABB): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/**
 * Returns true when the given player bounding box (pixels) would collide
 * with a building, a tree, or the edge of the world.
 */
export function isBlocked(box: AABB): boolean {
  if (box.x < 0 || box.y < 0 || box.x + box.w > WORLD_WIDTH || box.y + box.h > WORLD_HEIGHT) {
    return true;
  }

  for (const rect of obstacles) {
    if (intersects(box, tileRectToPixels(rect))) return true;
  }

  // Trees block a single tile each, slightly inset so movement near them feels fair.
  const minTileX = Math.floor(box.x / TILE_SIZE) - 1;
  const maxTileX = Math.floor((box.x + box.w) / TILE_SIZE) + 1;
  const minTileY = Math.floor(box.y / TILE_SIZE) - 1;
  const maxTileY = Math.floor((box.y + box.h) / TILE_SIZE) + 1;

  for (let ty = minTileY; ty <= maxTileY; ty++) {
    for (let tx = minTileX; tx <= maxTileX; tx++) {
      if (isTreeTile(tx, ty)) {
        const treeBox = tileRectToPixels({ x: tx, y: ty, w: 1, h: 1 });
        if (intersects(box, treeBox)) return true;
      }
    }
  }

  return false;
}
