import { NextRequest } from "next/server";
import { ok } from "@/lib/utils/api-response";
import { resolveIdentity } from "@/lib/auth/identity";
import { usageSummary } from "@/lib/rate-limit";
import { LIMITS } from "@/lib/config/limits";
import { collections } from "@/lib/db";

export async function GET(req: NextRequest) {
  const idn = resolveIdentity(req);
  const usage = usageSummary(idn.user?.id ?? null, idn.guestToken);
  const limits = LIMITS[idn.plan];
  return ok({
    user: idn.user ? { id: idn.user.id, email: idn.user.email, name: idn.user.name, plan: idn.user.plan, role: idn.user.role } : null,
    plan: idn.plan,
    usage, limits,
    projectCount: collections.projects().filter(p => (idn.user ? p.userId === idn.user.id : p.guestToken === idn.guestToken)).length,
  });
}
