import { LocationDef, NPCDef } from "@/types/game";

// World is laid out on a grid; TILE_SIZE is the pixel size of one grid cell.
export const TILE_SIZE = 48;
export const WORLD_COLS = 26;
export const WORLD_ROWS = 20;
export const WORLD_WIDTH = WORLD_COLS * TILE_SIZE;
export const WORLD_HEIGHT = WORLD_ROWS * TILE_SIZE;

export const LOCATIONS: LocationDef[] = [
  {
    id: "home",
    name: "Home",
    emoji: "🏠",
    description: "Where your adventure begins.",
    unlockedByDefault: true,
    requiresLevel: 1,
    tile: { x: 3, y: 3 },
    color: "#E8A33D",
  },
  {
    id: "park",
    name: "Park",
    emoji: "🏞️",
    description: "A quiet green space to meet Emma.",
    unlockedByDefault: true,
    requiresLevel: 1,
    tile: { x: 9, y: 4 },
    color: "#5C9271",
  },
  {
    id: "cafe",
    name: "Café",
    emoji: "☕",
    description: "Order your first drink in English.",
    unlockedByDefault: true,
    requiresLevel: 1,
    tile: { x: 15, y: 5 },
    color: "#CE8626",
  },
  {
    id: "market",
    name: "Market",
    emoji: "🛒",
    description: "Shopping vocabulary and numbers.",
    unlockedByDefault: false,
    requiresLevel: 2,
    tile: { x: 20, y: 6 },
    color: "#D2555B",
  },
  {
    id: "school",
    name: "School",
    emoji: "🏫",
    description: "Grammar lessons with Sarah.",
    unlockedByDefault: false,
    requiresLevel: 2,
    tile: { x: 4, y: 12 },
    color: "#4FAFB4",
  },
  {
    id: "library",
    name: "Library",
    emoji: "📚",
    description: "Build your vocabulary in silence.",
    unlockedByDefault: false,
    requiresLevel: 3,
    tile: { x: 10, y: 14 },
    color: "#8FD3D6",
  },
  {
    id: "hospital",
    name: "Hospital",
    emoji: "🏥",
    description: "Health and emergency English.",
    unlockedByDefault: false,
    requiresLevel: 4,
    tile: { x: 17, y: 13 },
    color: "#E06B72",
  },
  {
    id: "hotel",
    name: "Hotel",
    emoji: "🏨",
    description: "Check in and travel talk with Michael.",
    unlockedByDefault: false,
    requiresLevel: 5,
    tile: { x: 22, y: 15 },
    color: "#3F6B4F",
  },
];

export const NPCS: NPCDef[] = [
  {
    id: "guide",
    name: "Grandma Rose",
    role: "Your guide",
    locationId: "home",
    color: "#E8A33D",
    greeting: "Welcome home, dear! Ready to explore the town and learn some English?",
    tile: { x: 3, y: 4 },
  },
  {
    id: "emma",
    name: "Emma",
    role: "A friendly student",
    locationId: "park",
    color: "#F2C265",
    greeting: "Hi! I'm Emma. What's your name?",
    tile: { x: 9, y: 5 },
  },
  {
    id: "james",
    name: "James",
    role: "Café owner",
    locationId: "cafe",
    color: "#CE8626",
    greeting: "Good morning! What would you like to order?",
    tile: { x: 15, y: 6 },
  },
  {
    id: "daniel",
    name: "Daniel",
    role: "Market seller",
    locationId: "market",
    color: "#D2555B",
    greeting: "Welcome! Are you looking for something fresh today?",
    tile: { x: 20, y: 7 },
  },
  {
    id: "sarah",
    name: "Sarah",
    role: "Teacher",
    locationId: "school",
    color: "#4FAFB4",
    greeting: "Good to see you! Ready for today's lesson?",
    tile: { x: 4, y: 13 },
  },
  {
    id: "olivia",
    name: "Olivia",
    role: "Librarian",
    locationId: "library",
    color: "#8FD3D6",
    greeting: "Shh! Welcome to the library. Looking for a book?",
    tile: { x: 10, y: 15 },
  },
  {
    id: "robert",
    name: "Dr. Robert",
    role: "Doctor",
    locationId: "hospital",
    color: "#E06B72",
    greeting: "Hello. How are you feeling today?",
    tile: { x: 17, y: 14 },
  },
  {
    id: "michael",
    name: "Michael",
    role: "Hotel receptionist",
    locationId: "hotel",
    color: "#3F6B4F",
    greeting: "Welcome to Sunrise Hotel! Do you have a reservation?",
    tile: { x: 22, y: 16 },
  },
];

/**
 * Rectangular obstacles in world-grid coordinates (inclusive), representing
 * buildings, trees and decoration that block player movement. Doors are left
 * open one tile below each building's `tile` position so NPCs stay reachable.
 */
export interface ObstacleRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function buildingObstacles(): ObstacleRect[] {
  const obstacles: ObstacleRect[] = [];
  for (const loc of LOCATIONS) {
    obstacles.push({ x: loc.tile.x - 1, y: loc.tile.y - 1, w: 3, h: 1 });
  }
  return obstacles;
}

// Decorative trees scattered around the map (purely visual + light collision)
export const TREE_TILES: { x: number; y: number }[] = [
  { x: 1, y: 1 }, { x: 2, y: 8 }, { x: 6, y: 2 }, { x: 12, y: 1 },
  { x: 18, y: 2 }, { x: 24, y: 3 }, { x: 7, y: 9 }, { x: 13, y: 9 },
  { x: 19, y: 9 }, { x: 24, y: 10 }, { x: 1, y: 16 }, { x: 6, y: 18 },
  { x: 13, y: 18 }, { x: 20, y: 18 }, { x: 24, y: 17 }, { x: 2, y: 6 },
];

export function isTreeTile(x: number, y: number): boolean {
  return TREE_TILES.some((t) => t.x === x && t.y === y);
}

export function locationById(id: string): LocationDef | undefined {
  return LOCATIONS.find((l) => l.id === id);
}

export function npcById(id: string): NPCDef | undefined {
  return NPCS.find((n) => n.id === id);
}

export function npcsAt(locationId: string): NPCDef[] {
  return NPCS.filter((n) => n.locationId === locationId);
}
