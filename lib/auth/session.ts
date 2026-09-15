import "server-only";
import { cookies, headers } from "next/headers";
import { randomBytes } from "crypto";
import { collections, persistNow } from "../db";
import type { User } from "../db/types";

const COOKIE = "cf_session";

export function createSession(userId: string): string {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
  collections.sessions().push({ id: token, userId, expiresAt });
  persistNow();
  cookies().set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", expires: new Date(expiresAt),
  });
  return token;
}

export function destroySession() {
  const token = cookies().get(COOKIE)?.value;
  if (token) {
    const db = collections.sessions();
    const idx = db.findIndex(s => s.id === token);
    if (idx >= 0) db.splice(idx, 1);
    persistNow();
  }
  cookies().set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function getCurrentUser(): User | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const session = collections.sessions().find(s => s.id === token);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;
  const user = collections.users().find(u => u.id === session.userId);
  if (!user || user.disabled) return null;
  return user;
}

export function requireUser(): User {
  const u = getCurrentUser();
  if (!u) throw new AuthError();
  return u;
}

export class AuthError extends Error {
  constructor() { super("unauthorized"); this.name = "AuthError"; }
}

// Guest identity: a cookie-bound token so guests can generate & save projects
// before signing up (spec: guest user experience). The cookie itself is issued
// by middleware.ts (cookies cannot be written during RSC rendering).
const GUEST_COOKIE = "cf_guest";
export function getGuestToken(): string {
  // Cookie first; on the very first request of a session the middleware has
  // just issued the cookie and forwards the same token via x-cf-guest header.
  return (
    cookies().get(GUEST_COOKIE)?.value ??
    headers().get("x-cf-guest") ??
    `g_anon_${randomBytes(8).toString("hex")}`
  );
}
