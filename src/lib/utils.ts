import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKg(value: number) {
  return `${Math.round(value).toLocaleString()} kg`;
}

export function percent(value: number) {
  return `${Math.round(value)}%`;
}

export function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** ISO timestamp `days` in the future (negative for the past). */
export function isoDaysFromNow(days: number): string {
  return new Date(Date.now() + days * MS_PER_DAY).toISOString();
}
