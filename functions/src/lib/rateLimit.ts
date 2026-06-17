import { HttpsError } from 'firebase-functions/v2/https';

const HOUR_MS = 60 * 60 * 1000;

/**
 * Simple in-memory, per-instance sliding-window rate limiter keyed by user id.
 *
 * Sufficient for protecting paid AI endpoints from a single abusive client;
 * for strict cross-instance limits this would be backed by Firestore/Redis.
 */
export function createHourlyRateLimiter(maxPerHour: number, message: string) {
  const hits = new Map<string, number[]>();

  return function enforce(uid: string): void {
    const now = Date.now();
    const recent = (hits.get(uid) ?? []).filter((time) => now - time < HOUR_MS);
    if (recent.length >= maxPerHour) {
      throw new HttpsError('resource-exhausted', message);
    }
    hits.set(uid, [...recent, now]);
  };
}
