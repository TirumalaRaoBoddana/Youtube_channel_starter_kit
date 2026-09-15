import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { loginSchema } from "@/lib/validation/schemas";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, getGuestToken } from "@/lib/auth/session";
import { collections, persistNow } from "@/lib/db";
import { endpointRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0];
  if (!endpointRateLimit(`login:${ip}`, 10, 10 * 60_000)) {
    return fail("RATE_LIMITED", "Too many sign-in attempts. Please try again later.", 429);
  }

  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Enter a valid email and password.", 400);

  const user = collections.users().find(u => u.email.toLowerCase() === parsed.data.email.toLowerCase());
  if (!user || !user.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return fail("INVALID_CREDENTIALS", "Email or password is incorrect.", 401);
  }
  if (user.disabled) return fail("ACCOUNT_DISABLED", "This account has been disabled. Contact support.", 403);

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
  return ok({ user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role } });
}
