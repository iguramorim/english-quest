import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Normalizes free-text answers for comparison: lowercase, trims, strips punctuation. */
export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[.,!?'"]/g, "")
    .replace(/\s+/g, " ");
}

export function xpNeededForLevel(level: number): number {
  // Gentle curve: 100, 150, 200, 250 ...
  return 100 + (level - 1) * 50;
}
