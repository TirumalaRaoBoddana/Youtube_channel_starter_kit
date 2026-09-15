import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { registerSchema } from "@/lib/validation/schemas";
import { hashPassword } from "@/lib/auth/password";
import { createSession, getGuestToken } from "@/lib/auth/session";
import { collections, persistNow } from "@/lib/db";
import { newId } from "@/lib/utils/id";
import { track } from "@/lib/analytics";
import { env } from "@/lib/config/env";
import { endpointRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0];
  if (!endpointRateLimit(`register:${ip}`, 5, 10 * 60_000)) {
    return fail("RATE_LIMITED", "Too many sign-up attempts. Please try again later.", 429);
  }

  const parsed = registerSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Please check your input.", 400);
  const { email, password, name } = parsed.data;

  const existing = collections.users().find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return fail("EMAIL_TAKEN", "An account with this email already exists. Try signing in.", 409);

  const user = {
    id: newId("usr"), email: email.toLowerCase(), name,
    passwordHash: await hashPassword(password),
    role: (env.adminEmails.includes(email.toLowerCase()) ? "admin" : "user") as "admin" | "user",
    plan: "free" as const, disabled: false, createdAt: new Date().toISOString(),
  };
  collections.users().push(user);
  persistNow();
  createSession(user.id);

  // Claim any guest projects created under this browser before sign-up.
  {
    const gt = getGuestToken();
    let claimed = 0;
    for (const p of collections.projects()) {
      if (p.guestToken === gt) { p.userId = user.id; p.guestToken = null; claimed++; }
    }
    if (claimed > 0) persistNow();
  }
  track("signup_completed", { userId: user.id, guestToken: null });

  return ok({ user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role } });
}
