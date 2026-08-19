import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDuration(milliseconds?: number): string {
  if (milliseconds === undefined) return "—";
  if (milliseconds < 1_000) return `${milliseconds}ms`;
  const seconds = Math.round(milliseconds / 1_000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "Something went wrong";
  return message.replace(/^Error invoking remote method '[^']+': Error: /, "");
}
