import "server-only";
import { NextRequest } from "next/server";
import { getCurrentUser, getGuestToken } from "./session";
import type { User } from "../db/types";

export interface Identity {
  user: User | null;
  guestToken: string;
  ip: string;
  plan: "free" | "pro" | "anon";
  key: { userId: string | null; guestToken: string | null; ip: string };
}

export function resolveIdentity(req: NextRequest): Identity {
  const user = getCurrentUser();
  const guestToken = getGuestToken();
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const plan = user ? user.plan : "anon";
  return {
    user, guestToken, ip, plan,
    key: { userId: user?.id ?? null, guestToken: user ? null : guestToken, ip },
  };
}
