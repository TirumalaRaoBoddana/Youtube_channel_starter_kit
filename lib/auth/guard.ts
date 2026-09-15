import "server-only";
import { NextRequest } from "next/server";
import { getCurrentUser } from "./session";
import { fail } from "../utils/api-response";
import { env } from "../config/env";
import type { User } from "../db/types";

export type Actor =
  | { kind: "user"; user: User }
  | { kind: "guest"; guestToken: string };

// All mutating API routes go through this: authentication + CSRF mitigation.
// SameSite=Lax cookies plus a required custom header block cross-site form posts.
export function guardApi(req: NextRequest, opts: { requireUser?: boolean; requireAdmin?: boolean } = {}) {
  const isMutation = req.method !== "GET" && req.method !== "HEAD";
  if (isMutation && !req.headers.get("x-cf-client")) {
    return { error: fail("CSRF_REJECTED", "Request rejected. Please refresh the page and try again.", 403) };
  }
  const user = getCurrentUser();
  if (opts.requireAdmin) {
    const isAdmin = user && (user.role === "admin" || env.adminEmails.includes(user.email.toLowerCase()));
    if (!isAdmin) return { error: fail("FORBIDDEN", "You do not have access to this area.", 403) };
  }
  if (opts.requireUser && !user) {
    return { error: fail("UNAUTHORIZED", "Please sign in to continue.", 401) };
  }
  return { user };
}
