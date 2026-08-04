import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

// @export
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// @export
export function formatScore(score: number): string {
  if (score < 1000) return score.toString();
  if (score < 1000000) return `${(score / 1000).toFixed(1)}K`;
  return `${(score / 1000000).toFixed(1)}M`;
}
