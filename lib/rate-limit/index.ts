import "server-only";
import { collections, persist } from "../db";
import { newId } from "../utils/id";
import { LIMITS, type Plan } from "../config/limits";

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface QuotaResult { allowed: boolean; remaining: number; limit: number; resetAt: string; }

/**
 * Daily quota per identity.
 * - Signed-in users: keyed by user id.
 * - Guests: keyed by BOTH guest cookie and IP (so clearing cookies doesn't reset quota).
 */
export function checkDailyQuota(
  identity: { userId: string | null; guestToken: string | null; ip: string },
  kind: "text" | "image",
  plan: Plan | "anon",
): QuotaResult {
  const limit = LIMITS[plan][kind];
  const day = today();
  const guestKey = identity.guestToken ? `g:${identity.guestToken}` : null;
  // NOTE: operate on the live collection — filtering first and pushing into
  // the copy silently records nothing (this bug shipped once already).
  const events = collections.usageEvents();
  const todays = events.filter(e => e.day === day && e.kind === kind);
  // One event per request. Guests are capped by max(cookie count, IP count)
  // so clearing cookies doesn't reset the daily quota.
  const used = identity.userId
    ? todays.filter(e => e.userId === identity.userId).length
    : Math.max(
        todays.filter(e => guestKey !== null && e.guestToken === guestKey).length,
        todays.filter(e => e.ip === identity.ip).length,
      );
  const resetAt = new Date(new Date(day + "T00:00:00Z").getTime() + 24 * 3600 * 1000).toISOString();
  if (used >= limit) return { allowed: false, remaining: 0, limit, resetAt };
  events.push({
    id: newId("use"),
    userId: identity.userId,
    guestToken: identity.userId ? null : guestKey,
    ip: identity.userId ? null : identity.ip,
    kind, day, at: new Date().toISOString(),
  });
  persist();
  return { allowed: true, remaining: limit - used - 1, limit, resetAt };
}

export function usageSummary(userId: string | null, guestToken: string | null) {
  const day = today();
  const events = collections.usageEvents().filter(e => e.day === day);
  const mine = userId
    ? events.filter(e => e.userId === userId)
    : events.filter(e => e.guestToken === (guestToken ? `g:${guestToken}` : null));
  // IP-keyed mirror events are counted for guests too (dedupe by taking max).
  return { day, text: mine.filter(e => e.kind === "text").length, image: mine.filter(e => e.kind === "image").length };
}

const buckets = new Map<string, { count: number; windowStart: number }>();
export function endpointRateLimit(key: string, max = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now - b.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }
  b.count += 1;
  return b.count <= max;
}
