import {
  LOCATIONS,
  NPCS,
  TILE_SIZE,
  TREE_TILES,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  buildingObstacles,
} from "@/lib/game/map";
import { isBlocked } from "@/lib/game/collision";
import {
  Direction,
  PlayerEntity,
  advanceWalkCycle,
  createPlayer,
  playerBoundingBox,
} from "@/lib/game/player";
import { LocationId } from "@/types/game";

export interface InteractionTarget {
  kind: "npc" | "location";
  id: string;
  label: string;
  locationId: LocationId;
  locked: boolean;
}

export interface GameEngineCallbacks {
  onProximityChange: (target: InteractionTarget | null) => void;
  onInteract: (target: InteractionTarget) => void;
  onPositionChange: (pos: { x: number; y: number; direction: Direction }) => void;
}

const INTERACT_RADIUS = TILE_SIZE * 1.15;
const MOVE_KEYS: Record<string, Direction> = {
  KeyW: "up", ArrowUp: "up",
  KeyS: "down", ArrowDown: "down",
  KeyA: "left", ArrowLeft: "left",
  KeyD: "right", ArrowRight: "right",
};

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private player: PlayerEntity;
  private keys = new Set<Direction>();
  private touchDirections = new Set<Direction>();
  private raf = 0;
  private lastTime = 0;
  private running = false;
  private paused = false;
  private unlockedLocations: Set<LocationId>;
  private currentTarget: InteractionTarget | null = null;
  private callbacks: GameEngineCallbacks;
  private positionSaveAccumulator = 0;
  private camera = { x: 0, y: 0 };
  private dpr = 1;
  private cssWidth = 0;
  private cssHeight = 0;
  private particles: { x: number; y: number; life: number; color: string }[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    initial: { x: number; y: number; direction: Direction },
    unlockedLocations: LocationId[],
    callbacks: GameEngineCallbacks
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");
    this.ctx = ctx;
    this.player = createPlayer(initial.x, initial.y, initial.direction);
    this.unlockedLocations = new Set(unlockedLocations);
    this.callbacks = callbacks;
  }

  setUnlockedLocations(ids: LocationId[]) {
    this.unlockedLocations = new Set(ids);
  }

  resize(cssWidth: number, cssHeight: number, dpr: number) {
    this.cssWidth = cssWidth;
    this.cssHeight = cssHeight;
    this.dpr = dpr;
    this.canvas.width = Math.floor(cssWidth * dpr);
    this.canvas.height = Math.floor(cssHeight * dpr);
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;
  }

  setKeyActive(code: string, active: boolean) {
    const dir = MOVE_KEYS[code];
    if (!dir) return;
    if (active) this.keys.add(dir);
    else this.keys.delete(dir);
  }

  setTouchDirectionActive(dir: Direction, active: boolean) {
    if (active) this.touchDirections.add(dir);
    else this.touchDirections.delete(dir);
  }

  pause() {
    this.paused = true;
    this.keys.clear();
    this.touchDirections.clear();
  }

  resume() {
    this.paused = false;
    this.lastTime = performance.now();
  }

  requestInteract() {
    if (this.currentTarget) this.callbacks.onInteract(this.currentTarget);
  }

  teleportTo(x: number, y: number, direction: Direction) {
    this.player.x = x;
    this.player.y = y;
    this.player.direction = direction;
  }

  spawnSparkle(worldX: number, worldY: number) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: worldX + (Math.random() - 0.5) * 20,
        y: worldY + (Math.random() - 0.5) * 20,
        life: 1,
        color: i % 2 === 0 ? "#F2C265" : "#8FD3D6",
      });
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const loop = (t: number) => {
      if (!this.running) return;
      const dt = Math.min((t - this.lastTime) / 1000, 0.05);
      this.lastTime = t;
      this.update(dt);
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private activeDirection(): Direction | null {
    const merged = new Set<Direction>([...this.keys, ...this.touchDirections]);
    if (merged.size === 0) return null;
    // Priority order keeps single-axis movement predictable when two keys are held.
    const order: Direction[] = ["up", "down", "left", "right"];
    return order.find((d) => merged.has(d)) ?? null;
  }

  private update(dt: number) {
    if (this.paused) return;

    const dir = this.activeDirection();
    this.player.moving = dir !== null;

    if (dir) {
      this.player.direction = dir;
      const dx = dir === "left" ? -1 : dir === "right" ? 1 : 0;
      const dy = dir === "up" ? -1 : dir === "down" ? 1 : 0;
      const dist = this.player.speed * dt;

      // Move on each axis independently so sliding along walls feels natural.
      const nextBoxX = { ...playerBoundingBox(this.player) };
      nextBoxX.x += dx * dist;
      if (!isBlocked(nextBoxX)) this.player.x += dx * dist;

      const nextBoxY = { ...playerBoundingBox(this.player) };
      nextBoxY.y += dy * dist;
      if (!isBlocked(nextBoxY)) this.player.y += dy * dist;
    }

    advanceWalkCycle(this.player, dt);

    // Camera follows the player, clamped to world bounds. When the viewport
    // is larger than the world itself (wide/ultrawide monitors), center the
    // world instead of pinning it to the top-left corner.
    const targetX = this.player.x - this.cssWidth / 2;
    const targetY = this.player.y - this.cssHeight / 2;

    this.camera.x =
      WORLD_WIDTH <= this.cssWidth
        ? -(this.cssWidth - WORLD_WIDTH) / 2
        : clamp(targetX, 0, WORLD_WIDTH - this.cssWidth);

    this.camera.y =
      WORLD_HEIGHT <= this.cssHeight
        ? -(this.cssHeight - WORLD_HEIGHT) / 2
        : clamp(targetY, 0, WORLD_HEIGHT - this.cssHeight);

    this.updateProximity();

    // Particles
    this.particles.forEach((p) => (p.life -= dt * 1.2));
    this.particles = this.particles.filter((p) => p.life > 0);

    // Throttled position reporting (for autosave), ~twice a second.
    this.positionSaveAccumulator += dt;
    if (this.positionSaveAccumulator > 0.5) {
      this.positionSaveAccumulator = 0;
      this.callbacks.onPositionChange({
        x: this.player.x,
        y: this.player.y,
        direction: this.player.direction,
      });
    }
  }

  private updateProximity() {
    let closest: InteractionTarget | null = null;
    let closestDist = Infinity;

    for (const npc of NPCS) {
      const nx = npc.tile.x * TILE_SIZE + TILE_SIZE / 2;
      const ny = npc.tile.y * TILE_SIZE + TILE_SIZE / 2;
      const d = dist(this.player.x, this.player.y, nx, ny);
      if (d < INTERACT_RADIUS && d < closestDist) {
        closestDist = d;
        closest = {
          kind: "npc",
          id: npc.id,
          label: npc.name,
          locationId: npc.locationId,
          locked: !this.unlockedLocations.has(npc.locationId),
        };
      }
    }

    for (const loc of LOCATIONS) {
      const lx = loc.tile.x * TILE_SIZE + TILE_SIZE / 2;
      const ly = loc.tile.y * TILE_SIZE + TILE_SIZE / 2;
      const d = dist(this.player.x, this.player.y, lx, ly);
      if (d < INTERACT_RADIUS && d < closestDist && !NPCS.some((n) => n.locationId === loc.id)) {
        closestDist = d;
        closest = {
          kind: "location",
          id: loc.id,
          label: loc.name,
          locationId: loc.id,
          locked: !this.unlockedLocations.has(loc.id),
        };
      }
    }

    const changed =
      (closest?.id ?? null) !== (this.currentTarget?.id ?? null) ||
      (closest?.locked ?? null) !== (this.currentTarget?.locked ?? null);

    if (changed) {
      this.currentTarget = closest;
      this.callbacks.onProximityChange(closest);
    }
  }

  private render() {
    const { ctx } = this;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

    ctx.translate(-this.camera.x, -this.camera.y);

    this.drawGround();
    this.drawTrees();
    this.drawBuildings();
    this.drawNPCs();
    this.drawPlayer();
    this.drawParticles();

    ctx.restore();
  }

  private drawGround() {
    const { ctx } = this;

    // Fill the entire visible viewport (not just WORLD_WIDTH/HEIGHT) so that
    // on wide screens — where the window is larger than the town itself —
    // there's never a blank/undrawn strip around the map.
    const viewLeft = this.camera.x;
    const viewTop = this.camera.y;
    const viewRight = this.camera.x + this.cssWidth;
    const viewBottom = this.camera.y + this.cssHeight;

    ctx.fillStyle = "#1F3A2E";
    ctx.fillRect(viewLeft, viewTop, this.cssWidth, this.cssHeight);

    // Paths connecting locations, drawn as soft bands.
    ctx.strokeStyle = "#C9B98A";
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = TILE_SIZE * 0.9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(3 * TILE_SIZE, 4 * TILE_SIZE);
    for (const loc of LOCATIONS) {
      ctx.lineTo(loc.tile.x * TILE_SIZE, loc.tile.y * TILE_SIZE);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Subtle grid across the full visible area, aligned to the world grid.
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    const startX = Math.floor(viewLeft / TILE_SIZE) * TILE_SIZE;
    const startY = Math.floor(viewTop / TILE_SIZE) * TILE_SIZE;
    for (let x = startX; x <= viewRight; x += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, viewTop);
      ctx.lineTo(x, viewBottom);
      ctx.stroke();
    }
    for (let y = startY; y <= viewBottom; y += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(viewLeft, y);
      ctx.lineTo(viewRight, y);
      ctx.stroke();
    }
  }

  private drawTrees() {
    const { ctx } = this;
    for (const t of TREE_TILES) {
      const cx = t.x * TILE_SIZE + TILE_SIZE / 2;
      const cy = t.y * TILE_SIZE + TILE_SIZE / 2;
      ctx.beginPath();
      ctx.fillStyle = "#3F6B4F";
      ctx.arc(cx, cy - 6, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2F5540";
      ctx.beginPath();
      ctx.arc(cx - 6, cy - 2, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6B4A32";
      ctx.fillRect(cx - 3, cy + 6, 6, 10);
    }
  }

  private drawBuildings() {
    const { ctx } = this;
    const obstacles = buildingObstacles();
    LOCATIONS.forEach((loc, i) => {
      const rect = obstacles[i];
      const px = rect.x * TILE_SIZE;
      const py = rect.y * TILE_SIZE;
      const pw = rect.w * TILE_SIZE;
      const ph = rect.h * TILE_SIZE;
      const locked = !this.unlockedLocations.has(loc.id);

      ctx.fillStyle = locked ? "#2A2A2A" : loc.color;
      ctx.globalAlpha = locked ? 0.55 : 1;
      roundRect(ctx, px, py, pw, ph, 10);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Roof accent
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      roundRect(ctx, px, py, pw, ph * 0.35, 10);
      ctx.fill();

      ctx.font = "22px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = locked ? "#8a8a8a" : "#0E1A22";
      ctx.fillText(locked ? "🔒" : loc.emoji, px + pw / 2, py + ph * 0.68);

      ctx.font = "600 11px var(--font-body), sans-serif";
      ctx.fillStyle = "#F3EAD1";
      ctx.fillText(loc.name, px + pw / 2, py + ph + 14);
    });
  }

  private drawNPCs() {
    const { ctx } = this;
    for (const npc of NPCS) {
      const locked = !this.unlockedLocations.has(npc.locationId);
      if (locked) continue;
      const x = npc.tile.x * TILE_SIZE + TILE_SIZE / 2;
      const y = npc.tile.y * TILE_SIZE + TILE_SIZE / 2;

      // shadow
      ctx.beginPath();
      ctx.ellipse(x, y + 14, 12, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = npc.color;
      ctx.arc(x, y, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#0E1A22";
      ctx.arc(x, y - 16, 8, 0, Math.PI * 2);
      ctx.fill();

      const isTarget = this.currentTarget?.kind === "npc" && this.currentTarget.id === npc.id;
      if (isTarget) {
        ctx.beginPath();
        ctx.strokeStyle = "#F2C265";
        ctx.lineWidth = 2;
        ctx.arc(x, y - 2, 22, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  private drawPlayer() {
    const { ctx, player } = this;
    const bounce = player.moving ? Math.sin(player.walkCycle * 4) * 3 : 0;
    const x = player.x;
    const y = player.y + bounce * 0.3;

    // shadow
    ctx.beginPath();
    ctx.ellipse(x, player.y + 16, 13, 4.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fill();

    // legs (simple walk animation via two offset rectangles)
    const stride = player.moving ? Math.sin(player.walkCycle * 4) * 6 : 0;
    ctx.fillStyle = "#25404F";
    ctx.fillRect(x - 9, y + 6 + Math.max(0, stride), 7, 12);
    ctx.fillRect(x + 2, y + 6 + Math.max(0, -stride), 7, 12);

    // body
    ctx.beginPath();
    ctx.fillStyle = "#4FAFB4";
    roundRect(ctx, x - 12, y - 12, 24, 22, 8);
    ctx.fill();

    // head
    ctx.beginPath();
    ctx.fillStyle = "#F2C4A0";
    ctx.arc(x, y - 20, 10, 0, Math.PI * 2);
    ctx.fill();

    // direction indicator (simple face nub)
    ctx.fillStyle = "#0E1A22";
    const dirOffset = { up: [0, -3], down: [0, 3], left: [-3, 0], right: [3, 0] }[player.direction];
    ctx.beginPath();
    ctx.arc(x + dirOffset[0], y - 20 + dirOffset[1], 2, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawParticles() {
    const { ctx } = this;
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y - (1 - p.life) * 30, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
